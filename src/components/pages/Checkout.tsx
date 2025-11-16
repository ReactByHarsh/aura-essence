"use client";
import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CreditCard, Lock, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useUser, useStackApp } from '@stackframe/stack';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { checkoutSchema, type CheckoutForm } from '@/lib/schema';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useToaster } from '@/components/ui/ToasterProvider';

// Helper to dynamically load Razorpay script
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function Checkout() {
  const router = useRouter();
  const { items, getSubtotal, getTax, getTotal, clearCart, openCart, loadCart, closeCart } = useCartStore();
  const stackUser = useUser();
  const stackApp = useStackApp();
  const toast = useToaster();
  
  const user = stackUser ? {
    id: stackUser.id,
    email: stackUser.primaryEmail || '',
    firstName: stackUser.displayName?.split(' ')[0] || '',
    lastName: stackUser.displayName?.split(' ').slice(1).join(' ') || '',
  } : null;

  // Load cart from database on mount and close cart drawer
  React.useEffect(() => {
    closeCart(); // Close cart drawer when entering checkout
    if (stackUser) {
      loadCart();
    }
  }, [stackUser, loadCart, closeCart]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      phone: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    }
  });

  const COD_CHARGE = 49;
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const shipping = getSubtotal() >= 100 ? 0 : 15;
  const baseTotal = getTotal() + shipping;
  const finalTotal = useMemo(() => baseTotal + (paymentMethod === 'cod' ? COD_CHARGE : 0), [baseTotal, paymentMethod]);
  const [verifying, setVerifying] = useState(false);

  const onSubmit = async (data: CheckoutForm) => {
    try {
      if (!stackUser) {
        toast.info('Please log in to place an order.');
        router.push('/handler/sign-in');
        return;
      }
      // Build order payload
      const orderItems = items.map(it => ({
        name: it.product.name,
        sku: it.product.id,
        units: it.quantity,
        selling_price: it.unitPrice ?? it.product.price,
      }));
      const shippingDetails = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone || '',
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.zipCode,
        country: data.country || 'India',
      };

      if (paymentMethod === 'cod') {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: 'cod',
            amount: baseTotal,
            finalAmount: finalTotal,
            items: orderItems,
            shipping: shippingDetails,
          })
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          console.error('COD order error', json);
          toast.error(json?.error || 'Failed to place COD order.');
          return;
        }
        // console.log('[COD Order] Created successfully:', json.orderId);
        await clearCart();
        await loadCart(); // Reload cart to ensure it's empty
        toast.success(`COD order placed. Payable ₹${finalTotal}.`);
        router.push('/orders');
        return;
      }

      // Online: create Razorpay order via unified /api/orders
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'online',
          amount: baseTotal, // no COD charge for prepaid
          items: orderItems,
          shipping: shippingDetails,
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.razorpayOrder) {
        console.error('Order init error', json);
        toast.error(json?.error || 'Failed to initialize online payment.');
        return;
      }

      // Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Failed to load payment SDK. Check your connection.');
        return;
      }
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!key) {
        toast.error('Payment configuration missing. Please contact support.');
        return;
      }

      const amountPaise = Math.round(baseTotal * 100);
      const rzp = new (window as any).Razorpay({
        key,
        amount: amountPaise,
        currency: 'INR',
        name: 'Aura Élixir',
        description: 'Order Payment',
        order_id: json.razorpayOrder.id,
        prefill: { name: shippingDetails.name, email: shippingDetails.email },
        notes: { address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}, ${data.country}` },
        theme: { color: '#C9A227' },
        handler: async (response: any) => {
          try {
            setVerifying(true);
            // Verify payment and fulfill via Shiprocket as prepaid
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderMeta: { items: orderItems, shipping: shippingDetails, amount: baseTotal },
              })
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok || !verifyJson.success) {
              console.error('Verify error', verifyJson);
              toast.error(verifyJson.error || 'Payment verified, but order saving failed. Contact support.');
              setVerifying(false);
              return;
            }
            
            // console.log('[Payment Success] Order saved:', verifyJson.orderId);
            await clearCart();
            await loadCart(); // Reload cart to ensure it's empty
            toast.success('Payment successful! Your order has been placed.');
            router.push('/orders');
          } catch (e) {
            console.error('Post-payment error', e);
            const errorMsg = e instanceof Error ? e.message : 'Unknown error occurred';
            toast.error(`Payment succeeded, but order saving failed: ${errorMsg}. Please contact support.`);
            setVerifying(false);
          }
        },
        modal: { ondismiss: () => { toast.info('Payment cancelled. You can try again.'); } }
      });
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Unexpected error during checkout.');
    }
  };
  const handleBackToCart = useCallback(() => {
    openCart();
  }, [openCart]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-block bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-8 rounded-full">
              <ShoppingBag className="h-16 w-16 text-amber-500 mx-auto opacity-75" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8">
            Add items to your cart before proceeding to checkout
          </p>
          <Button size="lg" asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg">
            <Link href="/collections/men">Browse Collections</Link>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-8 sm:py-10 md:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="flex items-center mb-6 sm:mb-8">
          <Button
            type="button"
            variant="ghost"
            className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 min-h-[44px] px-4 sm:px-6"
            onClick={handleBackToCart}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Checkout Form - Mobile Enhanced */}
          <div>
            <div className="mb-5 sm:mb-6">
              <span className="text-purple-600 dark:text-purple-400 text-[10px] sm:text-xs font-semibold tracking-widest uppercase">Secure Checkout</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1.5 leading-tight">
                Shipping Details
              </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Contact Information */}
              <div>
                <h2 className="text-base font-semibold text-purple-700 dark:text-purple-300 mb-3">
                  Contact Information
                </h2>
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <div className="mt-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="10-digit mobile"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-base font-semibold text-purple-700 dark:text-purple-300 mb-3">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                  />
                </div>
                <div className="mt-4 space-y-4">
                  <Input
                    label="Address"
                    {...register('address')}
                    error={errors.address?.message}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      {...register('city')}
                      error={errors.city?.message}
                    />
                    <Input
                      label="State"
                      {...register('state')}
                      error={errors.state?.message}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="ZIP Code"
                      {...register('zipCode')}
                      error={errors.zipCode?.message}
                    />
                    <Input
                      label="Country"
                      {...register('country')}
                      error={errors.country?.message}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method (Online / COD) */}
              <div>
                <h2 className="text-base font-semibold text-purple-700 dark:text-purple-300 mb-3">Payment Method</h2>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800/50 space-y-2.5">
                  <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-purple-700 dark:text-purple-300 font-medium">Pay Online (UPI / Card)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-purple-700 dark:text-purple-300 font-medium">Cash on Delivery (₹{COD_CHARGE} extra)</span>
                  </label>
                  {paymentMethod === 'cod' && (
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">COD Charge: ₹{COD_CHARGE} added</p>
                  )}
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 shadow-lg border border-purple-200 dark:border-purple-800/50 sticky top-8">
              <h2 className="text-lg sm:text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-2.5 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-2.5">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={40}
                      height={40}
                      className="object-cover rounded-md border border-purple-200 dark:border-purple-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium text-slate-900 dark:text-white truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-[10px] text-purple-600 dark:text-purple-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 mb-4 pt-3 border-t border-purple-200 dark:border-purple-800/50">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-600 dark:text-purple-400">Subtotal</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {formatPrice(getSubtotal())}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-purple-600 dark:text-purple-400">Tax</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {formatPrice(getTax())}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-purple-600 dark:text-purple-400">Shipping</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400">
                    <span>COD Charge</span>
                    <span className="font-medium">+ {formatPrice(COD_CHARGE)}</span>
                  </div>
                )}
                
                <div className="border-t border-purple-200 dark:border-purple-800/50 pt-2 mt-2">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-purple-700 dark:text-purple-300">Total</span>
                    <span className="text-purple-700 dark:text-purple-300">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="text-center text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 py-2 rounded-lg">
                <Lock className="h-3 w-3 inline mr-1" />
                Your payment information is secure
              </div>
            </div>
          </div>
        </div>
      </div>
      {verifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl px-6 py-5 shadow-2xl ring-1 ring-white/10 flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-sm text-slate-700 dark:text-slate-200">Confirming payment and preparing your order…</p>
          </div>
        </div>
      )}
    </div>
  );
}
