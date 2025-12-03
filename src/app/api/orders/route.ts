import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack/server';
import { createOrder, getUserOrders } from '@/lib/neon/orders';
import { sendOrderNotification } from '@/lib/notifications';

const COD_CHARGE = 49;

export async function POST(request: Request) {
  try {
    // Resolve CORS origin
    const req = request as NextRequest;
    const origin = req.headers.get('origin');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const allowedOrigins = [appUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);
    const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : appUrl || '';

    const body = await request.json();
    const {
      paymentMethod, // 'online' | 'cod'
      amount,        // cart total before COD
      finalAmount,   // cart total after adding COD if applicable
      items,         // [{ name, units, selling_price, sku? }]
      shipping,      // { name, email, phone, address, city, state, pincode, country? }
    } = body || {};

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    if (!shipping || !shipping.name || !shipping.address || !shipping.city || !shipping.state || !shipping.pincode || !shipping.phone || !shipping.email) {
      return NextResponse.json({ error: 'Missing shipping details' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (paymentMethod === 'cod') {
      const codFinal = typeof finalAmount === 'number' ? finalAmount : amount + COD_CHARGE;

      // Get authenticated user
      const user = await stackServerApp.getUser({ tokenStore: request as NextRequest });
      if (!user?.id) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }

      // Map items to cart format
      const cartItems = items.map((i: any) => ({
        product_id: i.sku || i.product_id || '',
        quantity: i.units || 1,
        price: i.selling_price || 0,
      })).filter((ci: any) => ci.product_id);

      if (cartItems.length === 0) {
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

      // Create order in database first
      const order = await createOrder({
        userId: user.id,
        cartItems,
        totalAmount: codFinal,
        shippingAddress,
        paymentMethod: 'cod',
      });

      // Send notification
      await sendOrderNotification(order.id, {
        amount: codFinal,
        items: items,
        shipping: shipping,
        paymentMethod: 'cod'
      });

      return new NextResponse(
        JSON.stringify({
          success: true,
          cod: true,
          finalAmount: codFinal,
          orderId: order.id
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
          },
        }
      );
    }

    // Online payment is handled via PhonePe integration
    // This route is only used for COD orders
    return new NextResponse(
      JSON.stringify({
        error: 'Online payments should use PhonePe API at /api/phonepe/order'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({ error: e?.message || 'Unexpected error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Resolve CORS origin
    const origin = request.headers.get('origin');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const allowedOrigins = [appUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);
    const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : appUrl || '';

    const user = await stackServerApp.getUser({ tokenStore: request });
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status') || undefined;
    const startDate = url.searchParams.get('startDate') || undefined;
    const endDate = url.searchParams.get('endDate') || undefined;

    const result = await getUserOrders(user.id, { page, limit, status, startDate, endDate });

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // User-specific; do not cache publicly
        'Cache-Control': 'private, no-store',
        ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ error: err?.message || 'Failed to fetch orders' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const allowedOrigins = [appUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : appUrl || '';

  return new NextResponse(null, {
    status: 204,
    headers: {
      ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin',
    },
  });
}
