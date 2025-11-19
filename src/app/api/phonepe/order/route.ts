import { NextRequest, NextResponse } from 'next/server';
import { createPhonePeOrder } from '@/lib/phonepe';

/**
 * PhonePe Order Creation API
 * POST /api/phonepe/order
 * Creates a PhonePe payment order and returns payment URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, userId, mobileNumber } = body || {};

    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: 'Missing orderId or userId' },
        { status: 400 }
      );
    }

    // Get app URL for callbacks
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Create PhonePe order
    const result = await createPhonePeOrder({
      amount,
      orderId,
      userId,
      mobileNumber,
      callbackUrl: `${appUrl}/api/phonepe/callback`,
      redirectUrl: `${appUrl}/payment-callback`,
    });

    if (!result.success) {
      console.error('PhonePe order creation failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to create PhonePe order' },
        { status: 502 }
      );
    }

    // Extract payment URL from response
    // v2 API returns: { orderId, state, expireAt, redirectUrl }
    const paymentUrl = result.data?.redirectUrl;
    
    if (!paymentUrl) {
      console.error('PhonePe response missing redirectUrl:', result.data);
      return NextResponse.json(
        { error: 'Payment URL not found in response' },
        { status: 502 }
      );
    }

    // Return payment URL to frontend
    return NextResponse.json(
      {
        success: true,
        data: result.data,
        paymentUrl: paymentUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('PhonePe order API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}
