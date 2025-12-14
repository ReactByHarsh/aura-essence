import { NextRequest, NextResponse } from 'next/server';
import { checkPhonePeStatus, verifyPhonePeCallback } from '@/lib/phonepe';
import { stackServerApp } from '@/stack/server';
import { createOrder, updatePaymentStatus, findOrderByTransactionId } from '@/lib/neon/orders';
import { sql } from '@/lib/neon/db';

/**
 * PhonePe Payment Callback Handler
 * POST /api/phonepe/callback
 * Handles PhonePe callback after payment attempt
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { response } = body || {};

    if (!response) {
      return NextResponse.json(
        { error: 'Missing response payload' },
        { status: 400 }
      );
    }

    // Decode base64 response
    const decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
    const responseData = JSON.parse(decodedResponse);

    // Verify X-VERIFY header
    const xVerifyHeader = request.headers.get('X-VERIFY');
    if (!xVerifyHeader) {
      console.error('Missing X-VERIFY header');
      return NextResponse.json(
        { error: 'Missing verification header' },
        { status: 400 }
      );
    }

    // Verify callback signature
    const isValid = verifyPhonePeCallback(xVerifyHeader, response);
    if (!isValid) {
      console.error('Invalid callback signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Extract transaction details
    const { merchantTransactionId, transactionId, code, state } = responseData.data || {};

    // Check payment status from PhonePe
    const statusResult = await checkPhonePeStatus(merchantTransactionId);
    
    if (!statusResult.success) {
      console.error('Failed to verify payment status:', statusResult.error);
      // If status check fails, we can't trust the callback alone for security
      // But for "no webhook" flow, we might want to be lenient? 
      // No, security first.
      return NextResponse.json(
        { error: 'Failed to verify payment status with gateway' },
        { status: 502 }
      );
    }

    const paymentData = statusResult.data;
    
    // Check if payment was successful
    if (paymentData.state !== 'COMPLETED') {
      console.error('Payment not successful:', paymentData.state);
      return NextResponse.json(
        { error: 'Payment not completed', status: paymentData.state },
        { status: 400 }
      );
    }

    // Payment successful - return success
    return NextResponse.json(
      {
        success: true,
        merchantTransactionId,
        transactionId: paymentData.transactionId,
        state: paymentData.state,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('PhonePe callback error:', error);
    return NextResponse.json(
      { error: error?.message || 'Callback processing failed' },
      { status: 500 }
    );
  }
}

/**
 * PhonePe Payment Verification API
 * POST /api/phonepe/verify
 * Verifies payment and creates order in database
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantTransactionId, orderMeta } = body || {};

    console.log('[Verify] Payment verification requested');
    console.log('[Verify] merchantTransactionId:', merchantTransactionId);
    console.log('[Verify] orderMeta:', orderMeta);

    if (!merchantTransactionId) {
      return NextResponse.json(
        { error: 'Missing merchant transaction ID' },
        { status: 400 }
      );
    }

    // Check payment status
    console.log('[Verify] Checking payment status with PhonePe...');
    const statusResult = await checkPhonePeStatus(merchantTransactionId);
    console.log('[Verify] Status result:', JSON.stringify(statusResult, null, 2));
    
    if (!statusResult.success || !statusResult.data) {
      console.error('[Verify] Payment verification failed:', statusResult.error);
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paymentData = statusResult.data;

    // Verify payment is completed
    if (paymentData.state !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed', status: paymentData.state },
        { status: 400 }
      );
    }

    // Acquire an advisory lock to prevent concurrent creates for same transaction
    const lockKey = merchantTransactionId;
    const lockResult = await sql`SELECT pg_try_advisory_lock(hashtext(${lockKey})) as locked`;
    const locked = Array.isArray(lockResult) ? (lockResult[0] as any)?.locked : false;

    try {
      // If unable to lock, still attempt idempotent check first
      // Check if order already exists for this transaction
      const existingOrder = await findOrderByTransactionId(merchantTransactionId);
      if (existingOrder) {
        // console.log('[verify] Order already exists for transaction:', merchantTransactionId);
        try { await sql`SELECT pg_advisory_unlock(hashtext(${lockKey}))`; } catch {}
        return NextResponse.json(
          {
            success: true,
            orderId: existingOrder.id,
            transactionId: paymentData.transactionId,
            alreadyProcessed: true,
          },
          { status: 200 }
        );
      }
      
      // Continue with order creation below inside the lock
    } finally {
      // If we acquired lock, keep it until after create to guard creates
      // We'll explicitly release after creation. Do not release here.
    }

    // Extract order metadata
    const { items, shipping, amount } = orderMeta || {};
    if (!items || !shipping || !amount) {
      console.error('[verify] Missing order meta');
      return NextResponse.json(
        { error: 'Missing order metadata' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const user = await stackServerApp.getUser({ tokenStore: request });
    if (!user?.id) {
      console.error('[verify] User not authenticated');
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Prepare cart items
    const cartItems = items.map((i: any) => ({
      product_id: i.sku || i.product_id || '',
      quantity: i.units || 1,
      price: i.selling_price || 0,
    })).filter((ci: any) => ci.product_id);

    if (cartItems.length === 0) {
      console.error('[verify] No valid cart items found');
      return NextResponse.json(
        { error: 'No valid items in order' },
        { status: 400 }
      );
    }

    // Prepare shipping address
    const shippingAddress = {
      fullName: shipping.name,
      address: shipping.address,
      city: shipping.city,
      state: shipping.state,
      zipCode: shipping.pincode,
      country: shipping.country || 'India',
      phone: shipping.phone,
      merchantTransactionId, // Store transaction ID to prevent duplicates
    };

    // Create order in database
    const order = await createOrder({
      userId: user.id,
      cartItems,
      totalAmount: amount,
      shippingAddress,
      paymentMethod: 'online',
    });

    // Update payment status
    await updatePaymentStatus(order.id, 'paid');

    const response = NextResponse.json(
      {
        success: true,
        orderId: order.id,
        transactionId: paymentData.transactionId,
      },
      { status: 200 }
    );
    
    // Release advisory lock if it was acquired
    try { await sql`SELECT pg_advisory_unlock(hashtext(${lockKey}))`; } catch {}

    return response;
  } catch (error: any) {
    console.error('PhonePe verify error:', error);
    return NextResponse.json(
      { error: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
