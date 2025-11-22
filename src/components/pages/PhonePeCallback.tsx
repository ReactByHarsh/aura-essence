"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cart';
import { useToaster } from '@/components/ui/ToasterProvider';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function PhonePeCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, loadCart } = useCartStore();
  const toast = useToaster();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Verifying your payment...');
  const [isVerifying, setIsVerifying] = useState(false);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    async function verifyPayment() {
      // Prevent duplicate verification
      if (hasVerifiedRef.current || isVerifying) {
        // console.log('[Callback] Already verifying, skipping...');
        return;
      }

      setIsVerifying(true);
      hasVerifiedRef.current = true;

      try {
        // PhonePe v2 sends different parameters - check all possible ones
        const merchantOrderId = searchParams.get('merchantOrderId') ||
          searchParams.get('merchantTransactionId') ||
          searchParams.get('orderId');
        const transactionId = searchParams.get('transactionId') ||
          searchParams.get('providerReferenceId');

        // console.log('[Callback] URL params:', {
        //   merchantOrderId,
        //   transactionId,
        //   allParams: Object.fromEntries(searchParams.entries()),
        // });

        if (!merchantOrderId) {
          // Try to get orderId from sessionStorage as fallback
          const pendingOrderStr = sessionStorage.getItem('pendingOrder');
          if (pendingOrderStr) {
            const orderMeta = JSON.parse(pendingOrderStr);
            // console.log('[Callback] Using orderId from sessionStorage:', orderMeta.orderId);

            // Verify payment with backend using orderId from sessionStorage
            const verifyRes = await fetch('/api/phonepe/verify', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                merchantTransactionId: orderMeta.orderId,
                orderMeta,
              }),
            });

            const verifyJson = await verifyRes.json();

            if (!verifyRes.ok || !verifyJson.success) {
              console.error('Verify error', verifyJson);
              setStatus('failed');
              setMessage(verifyJson.error || 'Payment verification failed');
              toast.error('Payment failed. Redirecting to homepage...');
              // Redirect to homepage after 3 seconds
              setTimeout(() => router.push('/'), 3000);
              return;
            }

            // Success path
            try { sessionStorage.setItem(`payment:verified:${orderMeta.orderId}`, '1'); } catch { }
            sessionStorage.removeItem('pendingOrder');
            await clearCart();
            await loadCart();
            setStatus('success');
            setMessage('Payment successful! Redirecting to your orders...');
            toast.success('Payment successful! Your order has been placed.');
            setTimeout(() => router.push('/orders'), 2000);
            return;
          }

          setStatus('failed');
          setMessage('Invalid payment reference');
          toast.error('Payment failed. Redirecting to homepage...');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // Get pending order from sessionStorage
        const pendingOrderStr = sessionStorage.getItem('pendingOrder');
        if (!pendingOrderStr) {
          setStatus('failed');
          setMessage('Order details not found');
          toast.error('Payment failed. Redirecting to homepage...');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        const orderMeta = JSON.parse(pendingOrderStr);
        // If we've already verified this order, short-circuit
        const verifiedKey = `payment:verified:${orderMeta.orderId}`;
        if (sessionStorage.getItem(verifiedKey) === '1') {
          setStatus('success');
          setMessage('Payment already verified. Redirecting to your orders...');
          setTimeout(() => router.push('/orders'), 1200);
          return;
        }

        // Verify payment with backend
        const verifyRes = await fetch('/api/phonepe/verify', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchantTransactionId: merchantOrderId,
            orderMeta,
          }),
        });

        const verifyJson = await verifyRes.json();

        if (!verifyRes.ok || !verifyJson.success) {
          console.error('Verify error', verifyJson);
          setStatus('failed');
          setMessage(verifyJson.error || 'Payment verification failed');
          toast.error('Payment failed. Redirecting to homepage...');
          // Redirect to homepage after 3 seconds
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // Clear sessionStorage
        try { sessionStorage.setItem(`payment:verified:${orderMeta.orderId}`, '1'); } catch { }
        sessionStorage.removeItem('pendingOrder');

        // Clear cart
        await clearCart();
        await loadCart();

        // Success
        setStatus('success');
        setMessage('Payment successful! Redirecting to your orders...');
        toast.success('Payment successful! Your order has been placed.');

        // Redirect to orders page
        setTimeout(() => {
          router.push('/orders');
        }, 2000);
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('An error occurred during payment verification');
        toast.error('Payment failed. Redirecting to homepage...');
        setTimeout(() => router.push('/'), 3000);
      } finally {
        setIsVerifying(false);
      }
    }

    verifyPayment();
  }, [searchParams, clearCart, loadCart, toast, router, isVerifying]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="mb-6">
              <div className="inline-block bg-amber-50 dark:bg-amber-900/20 p-6 rounded-full">
                <Loader2 className="h-12 w-12 text-amber-600 dark:text-amber-400 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-serif">
              Processing Payment
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <div className="inline-block bg-green-50 dark:bg-green-900/20 p-6 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-3 font-serif">
              Payment Successful!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {message}
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mb-6">
              <div className="inline-block bg-red-50 dark:bg-red-900/20 p-6 rounded-full">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3 font-serif">
              Payment Failed
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {message}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              Redirecting to homepage in 3 seconds...
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  );
}
