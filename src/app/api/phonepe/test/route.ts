import { NextRequest, NextResponse } from 'next/server';

// PhonePe v2 configuration test

/**
 * PhonePe Configuration Test Endpoint
 * GET /api/phonepe/test
 * Tests if PhonePe credentials are properly configured
 */
export async function GET(request: NextRequest) {
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX;
  const env = process.env.PHONEPE_ENV;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const config = {
    configured: !!(merchantId && saltKey),
    merchantId: merchantId ? `${merchantId.substring(0, 10)}...` : 'NOT_SET',
    saltKey: saltKey ? `${saltKey.substring(0, 10)}...` : 'NOT_SET',
    saltIndex: saltIndex || 'NOT_SET',
    environment: env || 'NOT_SET',
    appUrl: appUrl || 'NOT_SET',
    callbackUrl: appUrl ? `${appUrl}/api/phonepe/callback` : 'NOT_SET',
    redirectUrl: appUrl ? `${appUrl}/payment-callback` : 'NOT_SET',
  };

  return NextResponse.json(config);
}
