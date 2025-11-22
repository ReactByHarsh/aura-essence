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

  // Fetch shipping and COD configuration from backend
  const [shippingConfig, setShippingConfig] = React.useState({ freeThreshold: 400, charge: 40 });
  const [codCharge, setCodCharge] = React.useState(49);

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setShippingConfig({
              freeThreshold: json.data.shipping.free_shipping_threshold,
              charge: json.data.shipping.standard_shipping_charge
            });
            setCodCharge(json.data.cod.amount);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    }
    fetchSettings();
  }, []);

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

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const shipping = getSubtotal() >= shippingConfig.freeThreshold ? 0 : shippingConfig.charge;
  const baseTotal = getTotal() + shipping;
  const finalTotal = useMemo(() => baseTotal + (paymentMethod === 'cod' ? codCharge : 0), [baseTotal, paymentMethod, codCharge]);
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

      // Online: create PhonePe payment
      if (!user) {
        toast.error('User not found. Please log in again.');
        router.push('/handler/sign-in');
        return;
      }

      const uniqueOrderId = `ORD_${Date.now()}_${user.id.substring(0, 8)}`;

      // Create PhonePe order
      const phonepeRes = await fetch('/api/phonepe/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: baseTotal,
          orderId: uniqueOrderId,
          userId: user.id,
          mobileNumber: data.phone || undefined,
        })
      });

      const phonepeJson = await phonepeRes.json();
      if (!phonepeRes.ok || !phonepeJson.success || !phonepeJson.paymentUrl) {
        console.error('PhonePe order init error', phonepeJson);
        toast.error(phonepeJson?.error || 'Failed to initialize payment.');
        return;
      }

      // Store order metadata in sessionStorage for verification
      sessionStorage.setItem('pendingOrder', JSON.stringify({
        orderId: uniqueOrderId,
        items: orderItems,
        shipping: shippingDetails,
        amount: baseTotal,
      }));

      // Redirect to PhonePe payment page
      window.location.href = phonepeJson.paymentUrl;
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
      <div className="min-h-screen bg-white dark:bg-slate-950 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 font-serif">
              Your Cart is Empty
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button size="lg" asChild className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium shadow-lg rounded-full px-8 min-h-[50px]">
              <Link href="/collections/men">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Clean */}
        <div className="flex items-center mb-8">
          <Button
            type="button"
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 px-0 hover:px-4 transition-all"
            onClick={handleBackToCart}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Checkout Form */}
          <div>
            <div className="mb-5 sm:mb-6">
              <span className="text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">Secure Checkout</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1.5 leading-tight font-serif">
                Shipping Details
              </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Contact Information */}
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
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
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
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
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Payment Method</h2>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-slate-900 dark:text-white font-medium">Pay Online (UPI / Card)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-slate-900 dark:text-white font-medium">Cash on Delivery (₹{codCharge} extra)</span>
                  </label>
                  {paymentMethod === 'cod' && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">COD Charge: ₹{codCharge} added</p>
                  )}
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold h-12 text-base shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-8">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 font-serif">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {formatPrice(getSubtotal())}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Tax</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {formatPrice(getTax())}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Shipping</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                    <span>COD Charge</span>
                    <span className="font-medium">+ {formatPrice(codCharge)}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-slate-900 dark:text-white">Total</span>
                    <span className="text-slate-900 dark:text-white">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="text-center text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
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
