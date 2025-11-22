import { NextRequest, NextResponse } from 'next/server';

function resolveCorsOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const allowed = [appUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);
  const allowOrigin = origin && allowed.includes(origin) ? origin : appUrl || '';
  return allowOrigin;
}

export async function OPTIONS(request: NextRequest) {
  const allowOrigin = resolveCorsOrigin(request);
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin',
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");

  const expectedUser = process.env.WEBHOOK_USER;
  const expectedPass = process.env.WEBHOOK_PASS;

  if (!auth || !auth.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const base64Credentials = auth.split(" ")[1];
  const [user, pass] = Buffer.from(base64Credentials, "base64")
    .toString()
    .split(":");

  if (user !== expectedUser || pass !== expectedPass) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("PhonePe Webhook Data:", JSON.stringify(body, null, 2));

    // TODO: Handle the webhook event (update order status, etc.)
    
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
