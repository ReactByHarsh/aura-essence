/**
 * PhonePe Payment Gateway Integration (v2 API)
 * Based on Standard Checkout API v2
 * https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration
 */

// Environment variables
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || '';
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_SALT_KEY || '';
const PHONEPE_ENV = process.env.PHONEPE_ENV || 'sandbox';

// API URLs
const PHONEPE_BASE_URL = PHONEPE_ENV === 'production'
  ? 'https://api.phonepe.com/apis/pg'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

const PHONEPE_AUTH_URL = PHONEPE_ENV === 'production'
  ? 'https://api.phonepe.com/apis/identity-manager'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Token cache
let authToken: string | null = null;
let tokenExpiry: number = 0;

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
    udf3?: string;
  };
}

interface PhonePePaymentResponse {
  orderId: string;
  state: string;
  expireAt: number;
  redirectUrl: string;
}

interface PhonePeErrorResponse {
  code: string;
  message: string;
}

interface PhonePeOrderStatusResponse {
  orderId: string;
  state: string;
  amount: number;
  merchantOrderId: string;
  transactionId?: string;
}

/**
 * Get OAuth access token
 */
async function getAuthToken(): Promise<string> {
  const now = Date.now();
  if (authToken && tokenExpiry > now + 300000) {
    return authToken;
  }

  try {
    // Build form data with required fields
    const formData = new URLSearchParams({
      client_id: PHONEPE_MERCHANT_ID,
      client_secret: PHONEPE_CLIENT_SECRET,
      client_version: '1.0',
      grant_type: 'CLIENT_CREDENTIALS',
    });

    // console.log('[PhonePe Auth] Requesting token with:', {
    //   client_id: PHONEPE_MERCHANT_ID,
    //   client_version: '1.0',
    //   grant_type: 'CLIENT_CREDENTIALS',
    // });

    const response = await fetch(`${PHONEPE_AUTH_URL}/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    
    // Extract token - response might be JWT string or object
    if (typeof result === 'string') {
      authToken = result;
    } else {
      authToken = result.token || result.accessToken || result.access_token || JSON.stringify(result);
    }

    tokenExpiry = result.expiresOn || (now + 3600000);
    
    // console.log('[PhonePe] Auth token obtained');
    return authToken || '';
  } catch (error) {
    console.error('[PhonePe Auth] Error:', error);
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
    if (!PHONEPE_MERCHANT_ID || !PHONEPE_CLIENT_SECRET) {
      throw new Error('PhonePe credentials not configured');
    }

    // console.log('[PhonePe] Creating order:', params.orderId);
    
    const amountInPaise = Math.round(params.amount * 100);
    const token = await getAuthToken();

    const paymentRequest: PhonePePaymentRequest = {
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

    const apiUrl = `${PHONEPE_BASE_URL}/checkout/v2/pay`;
    // console.log('[PhonePe] Request to:', apiUrl);
    // console.log('[PhonePe] Payload:', JSON.stringify(paymentRequest, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${token}`,
      },
      body: JSON.stringify(paymentRequest),
    });

    const responseText = await response.text();
    // console.log('[PhonePe] Response:', response.status, responseText);

    let result: PhonePePaymentResponse | PhonePeErrorResponse;
    try {
      result = JSON.parse(responseText);
    } catch {
      return { success: false, error: `Invalid response: ${responseText}` };
    }

    if (!response.ok) {
      const error = result as PhonePeErrorResponse;
      return {
        success: false,
        error: error.message || error.code || 'Payment creation failed',
      };
    }

    return {
      success: true,
      data: result as PhonePePaymentResponse,
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
    const apiUrl = `${PHONEPE_BASE_URL}/checkout/v2/order/${merchantOrderId}/status`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `O-Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    let result: PhonePeOrderStatusResponse | PhonePeErrorResponse;
    
    try {
      result = JSON.parse(responseText);
    } catch {
      return { success: false, error: `Invalid response: ${responseText}` };
    }

    if (!response.ok) {
      const error = result as PhonePeErrorResponse;
      return {
        success: false,
        error: error.message || error.code || 'Status check failed',
      };
    }

    return {
      success: true,
      data: result as PhonePeOrderStatusResponse,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unexpected error',
    };
  }
}

/**
 * Verify webhook callback (not needed for v2 - uses OAuth)
 */
export function verifyPhonePeCallback(xVerify: string, response: string): boolean {
  // V2 API uses OAuth tokens, not signature verification
  return true;
}

/**
 * Initiate refund
 */
export async function initiatePhonePeRefund(params: {
  merchantTransactionId: string;
  originalTransactionId: string;
  amount: number; // in rupees
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = await getAuthToken();
    const amountInPaise = Math.round(params.amount * 100);

    const refundRequest = {
      merchantRefundId: params.merchantTransactionId,
      originalOrderId: params.originalTransactionId,
      amount: amountInPaise,
    };

    const apiUrl = `${PHONEPE_BASE_URL}/payments/v2/refund`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${token}`,
      },
      body: JSON.stringify(refundRequest),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.code || 'Refund failed',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unexpected error',
    };
  }
}
