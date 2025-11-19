import { NextRequest, NextResponse } from 'next/server';

const TARGET_URL = 'https://api-preprod.phonepe.com/apis/pg-meta/client/v1/events/batch';

function resolveCorsOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
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

export async function POST(request: NextRequest) {
  const allowOrigin = resolveCorsOrigin(request);

  try {
    const body = await request.text();

    const resp = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body,
    });

    const contentType = resp.headers.get('content-type') || 'application/json';
    const text = await resp.text();

    return new NextResponse(text, {
      status: resp.status,
      headers: {
        'Content-Type': contentType,
        ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ error: err?.message || 'Proxy failed' }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
  }
}
