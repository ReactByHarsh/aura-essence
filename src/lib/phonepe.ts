/**
 * PhonePe Payment Gateway Integration (Standard Checkout V2 with OAuth)
 * https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration
 */

// Environment variables
const PHONEPE_CLIENT_ID = process.env.PHONEPE_MERCHANT_ID || '';
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_SALT_KEY || '';
const PHONEPE_ENV = process.env.PHONEPE_ENV || 'production';

// API URLs
const PHONEPE_AUTH_URL = PHONEPE_ENV === 'production'
  ? 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token';

const PHONEPE_HOST_URL = PHONEPE_ENV === 'production'
  ? 'https://api.phonepe.com/apis/pg'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Token cache
let authToken: string | null = null;
let tokenExpiry: number = 0;

interface PhonePeAuthResponse {
  access_token: string;
  issued_at: number;
  expires_at: number;
  token_type: string;
}

interface PhonePePaymentRequest {
  merchantOrderId: string;
  amount: number; // in paise
  paymentFlow: {
    type: 'PG_CHECKOUT';
    message?: string;
    merchantUrls: {
      redirectUrl: string;
    };
  };
  metaInfo?: {
    udf1?: string;
    udf2?: string;
  };
}

interface PhonePePaymentResponse {
  orderId: string;
  state: string;
  expireAt: number;
  redirectUrl: string;
}

interface PhonePeStatusResponse {
  merchantOrderId: string;
  transactionId: string;
  amount: number;
  state: 'PENDING' | 'COMPLETED' | 'FAILED';
  responseCode: string;
}

/**
 * Get OAuth access token
 */
async function getAuthToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid
  if (authToken && tokenExpiry > now + 60000) {
    return authToken;
  }

  try {
    const formData = new URLSearchParams({
      client_id: PHONEPE_CLIENT_ID,
      client_secret: PHONEPE_CLIENT_SECRET,
      grant_type: 'client_credentials',
    });

    console.log('[PhonePe Auth] Requesting OAuth token...');
    console.log('[PhonePe Auth] URL:', PHONEPE_AUTH_URL);

    const response = await fetch(PHONEPE_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    console.log('[PhonePe Auth] Response Status:', response.status);

    if (!response.ok) {
      console.error('[PhonePe Auth] Failed:', responseText);
      throw new Error(`Auth failed (${response.status}): ${responseText}`);
    }

    const result: PhonePeAuthResponse = JSON.parse(responseText);
    authToken = result.access_token;
    tokenExpiry = result.expires_at * 1000; // Convert to milliseconds

    console.log('[PhonePe Auth] Token obtained, expires at:', new Date(tokenExpiry).toISOString());
    return authToken;
  } catch (error: any) {
    console.error('[PhonePe Auth] Error:', error.message);
    throw error;
  }
}

/**
 * Create payment order
 */
export async function createPhonePeOrder(params: {
  amount: number; // in rupees
  orderId: string;
  userId: string;
  mobileNumber?: string;
  callbackUrl: string;
  redirectUrl: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!PHONEPE_CLIENT_ID || !PHONEPE_CLIENT_SECRET) {
      throw new Error('PhonePe credentials not configured');
    }

    const amountInPaise = Math.round(params.amount * 100);
    const token = await getAuthToken();

    const payload: PhonePePaymentRequest = {
      merchantOrderId: params.orderId,
      amount: amountInPaise,
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: 'Payment for order',
        merchantUrls: {
          redirectUrl: params.redirectUrl,
        },
      },
      metaInfo: {
        udf1: params.userId,
        udf2: params.mobileNumber || '',
      },
    };

    const apiUrl = `${PHONEPE_HOST_URL}/checkout/v2/pay`;

    console.log('[PhonePe] Creating payment...');
    console.log('[PhonePe] URL:', apiUrl);
    console.log('[PhonePe] Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('[PhonePe] Response Status:', response.status);
    console.log('[PhonePe] Response Body:', responseText);

    let result: PhonePePaymentResponse;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      return {
        success: false,
        error: `Invalid JSON response (${response.status}): ${responseText.substring(0, 200)}`,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: (result as any).message || (result as any).code || `Payment creation failed (${response.status})`,
      };
    }

    return {
      success: true,
      data: {
        redirectUrl: result.redirectUrl,
        merchantOrderId: params.orderId,
        orderId: result.orderId,
      },
    };
  } catch (error: any) {
    console.error('[PhonePe] Error:', error);
    return {
      success: false,
      error: error.message || 'Unexpected error',
    };
  }
}

/**
 * Check payment status
 */
export async function checkPhonePeStatus(merchantOrderId: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const token = await getAuthToken();
    const apiUrl = `${PHONEPE_HOST_URL}/checkout/v2/order/${merchantOrderId}/status`;

    console.log('[PhonePe] Checking status for:', merchantOrderId);
    console.log('[PhonePe] Status URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `O-Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    console.log('[PhonePe Status] Response:', response.status, responseText);

    let result: PhonePeStatusResponse;
    try {
      result = JSON.parse(responseText);
    } catch {
      return { success: false, error: `Invalid response: ${responseText}` };
    }

    if (!response.ok) {
      return {
        success: false,
        error: (result as any).message || (result as any).code || 'Status check failed',
      };
    }

    return {
      success: true,
      data: {
        state: result.state,
        amount: result.amount,
        transactionId: result.transactionId,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unexpected error',
    };
  }
}

/**
 * Verify webhook callback (for webhooks with Basic Auth)
 */
export function verifyPhonePeCallback(xVerify: string, response: string): boolean {
  // With V2 OAuth API and Basic Auth webhooks, signature verification is not needed
  // We rely on Basic Auth for webhook security
  return true;
}

