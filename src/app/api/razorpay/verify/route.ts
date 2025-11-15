import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
// Shiprocket is only for COD; do not import or use here for prepaid
import { stackServerApp } from '@/stack/server';
import { createOrder, updatePaymentStatus } from '@/lib/neon/orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderMeta } = body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Missing Razorpay key secret' }, { status: 500 });
    }

    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Payment verified -> for online orders, persist order in DB and return success
    const { items, shipping, amount } = orderMeta || {};
    if (!items || !shipping || !amount) {
      console.error('[verify] Missing order meta');
      return NextResponse.json({ error: 'Missing order meta; cannot save order' }, { status: 400 });
    }

    // Identify user and persist order
    const user = await stackServerApp.getUser({ tokenStore: request });
    if (!user?.id) {
      console.error('[verify] User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const cartItems = items.map((i: any) => ({
      product_id: i.sku || i.product_id || '',
      quantity: i.units || 1,
      price: i.selling_price || 0,
    })).filter((ci: any) => ci.product_id);

    if (cartItems.length === 0) {
      console.error('[verify] No valid cart items found');
      return NextResponse.json({ error: 'No valid items in order' }, { status: 400 });
    }

    const shippingAddress = {
      fullName: shipping.name,
      address: shipping.address,
      city: shipping.city,
      state: shipping.state,
      zipCode: shipping.pincode,
      country: shipping.country || 'India',
      phone: shipping.phone,
    };

    const order = await createOrder({
      userId: user.id,
      cartItems,
      totalAmount: amount,
      shippingAddress,
      paymentMethod: 'online',
    });

    await updatePaymentStatus(order.id, 'paid');
    // console.log('[verify] Order created successfully:', order.id);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Verification failed' }, { status: 500 });
  }
}
