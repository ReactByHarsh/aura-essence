"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth-neon';

import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { CartItem as CartItemType } from '@/types';
import Image from 'next/image';

const DEFAULT_SIZES = ['30ml', '50ml'];

export function CartDrawer() {
  const {
    items,
    totals,
    isOpen,
    isLoading,
    error,
    closeCart,
    updateQuantity,
    removeItem,
    addItem,
    clearError,
    applyCoupon,
    clearCoupon,
  } = useCartStore();

  const router = useRouter();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [isNavigating, setIsNavigating] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [shippingConfig, setShippingConfig] = useState({ freeThreshold: 400, charge: 40 });

  // Fetch shipping configuration
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings?type=shipping');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setShippingConfig({
              freeThreshold: json.data.free_shipping_threshold,
              charge: json.data.standard_shipping_charge
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch shipping settings:', error);
      }
    }
    fetchSettings();
  }, []);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    // Reset navigating state when cart opens
    setIsNavigating(false);

    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        closeCart();
      }
    }

    // Add small delay to avoid immediate close when opening
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeCart]);

  const buildLoadingKey = (cartItemId: string, size: string | null) => `${cartItemId}-${size ?? 'default'}`;

  const handleSizeChange = async (item: CartItemType, newSize: string) => {
    const oldSizeValue = item.selectedSize ?? null;
    const oldDisplaySize = oldSizeValue ?? '20ml';
    if (newSize === oldDisplaySize) return;

    const oldItemKey = buildLoadingKey(item.id, oldSizeValue);
    const newItemKey = `${item.product.id}-${newSize}`;

    setLoadingItems(prev => {
      const next = new Set(prev);
      next.add(oldItemKey);
      next.add(newItemKey);
      return next;
    });

    try {
      await addItem(item.product, item.quantity, newSize, { skipReload: true });
      await removeItem(item.id, item.product.id, oldSizeValue, { skipReload: true });
      await useCartStore.getState().loadCart();
    } catch (error) {
      console.error('Error changing size:', error);
      await useCartStore.getState().loadCart();
    } finally {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(oldItemKey);
        next.delete(newItemKey);
        return next;
      });
    }
  };

  const handleQuantityChange = async (item: CartItemType, newQuantity: number) => {
    if (newQuantity === item.quantity) return;
    const sizeValue = item.selectedSize ?? null;
    const itemKey = buildLoadingKey(item.id, sizeValue);
    setLoadingItems(prev => new Set(prev).add(itemKey));

    try {
      await updateQuantity(item.id, item.product.id, newQuantity, item.selectedSize ?? null);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (item: CartItemType) => {
    const sizeValue = item.selectedSize ?? null;
    const itemKey = buildLoadingKey(item.id, sizeValue);
    setLoadingItems(prev => new Set(prev).add(itemKey));

    try {
      await removeItem(item.id, item.product.id, sizeValue);
    } catch (error) {
      console.error('Error removing cart item:', error);
    } finally {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  };

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-primary-950 shadow-2xl flex flex-col border-l border-primary-800 animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-800 bg-primary-950">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-accent-500" />
            <h2 className="text-xl font-bold font-serif text-neutral-50 tracking-wide">
              Your Selection
            </h2>
            <span className="bg-primary-900 border border-primary-800 text-accent-500 text-xs font-bold px-2 py-0.5 rounded-none">
              {items.reduce((t, i) => t + i.quantity, 0)} ITEMS
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeCart}
            className="hover:bg-primary-900 text-neutral-400 hover:text-accent-500 rounded-none transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-0 bg-primary-950 scrollbar-thin scrollbar-thumb-primary-800">
          {/* Error display */}
          {error && (
            <div className="m-4 p-3 bg-red-900/10 border border-red-900/30 text-red-400">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-500 border-t-transparent"></div>
              <p className="text-accent-500 mb-4 font-medium mt-6 tracking-widest uppercase text-xs">
                Loading...
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center h-full px-4">
              <div className="mb-6 bg-primary-900/50 p-6 rounded-full border border-primary-800">
                <ShoppingBag className="h-12 w-12 text-primary-700" />
              </div>
              <p className="text-neutral-50 mb-2 font-serif font-bold text-xl">
                Your cart is empty
              </p>
              <p className="text-sm text-neutral-500 mb-8 max-w-xs mx-auto font-light leading-relaxed">
                Discover our collection of premium long-lasting perfumes.
              </p>
              <Button
                onClick={closeCart}
                className="bg-accent-600 hover:bg-accent-500 text-primary-950 font-bold px-8 py-3 rounded-none tracking-widest uppercase text-xs transition-all"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-primary-900">
              {items.map(item => {
                const sizeValue = item.selectedSize ?? null;
                const selectedSize = sizeValue ?? '20ml';
                const itemKey = buildLoadingKey(item.id, sizeValue);
                const isItemLoading = loadingItems.has(itemKey);
                const unitPrice = item.unitPrice ?? item.product.price;
                const lineTotal = item.lineTotal ?? unitPrice * item.quantity;
                const sizeOptions = (item.product.sizes ? Object.keys(item.product.sizes) : DEFAULT_SIZES).filter(s => s === '30ml' || s === '50ml');
                const coverImage = item.product.images[0] ?? '/perfume-logo.png';

                return (
                  <div key={itemKey} className="flex gap-5 p-6 hover:bg-primary-900/20 transition-colors group relative">
                    {/* Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-primary-900 border border-primary-800 overflow-hidden">
                      <Image
                        src={coverImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      {isItemLoading && (
                        <div className="absolute inset-0 bg-primary-950/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-500 border-t-transparent"></div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-serif font-medium text-neutral-100 text-lg truncate pr-2">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <select
                              value={selectedSize}
                              onChange={(e) => handleSizeChange(item, e.target.value)}
                              disabled={isItemLoading}
                              className="text-xs text-accent-500 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-accent-400 transition-colors font-medium uppercase tracking-wider"
                            >
                              {sizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                            <span className="text-primary-800">|</span>
                            <p className="text-xs text-neutral-500 uppercase tracking-wider">
                              {item.product.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          disabled={isItemLoading}
                          className="text-neutral-600 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-3">
                        <div className="font-medium text-neutral-200">
                          {formatPrice(lineTotal)}
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center border border-primary-800 bg-primary-900/50">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={isItemLoading}
                            className="p-1 px-2.5 hover:bg-primary-800 text-neutral-400 hover:text-accent-500 transition-colors disabled:opacity-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-1 text-xs font-bold text-neutral-200 min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={isItemLoading}
                            className="p-1 px-2.5 hover:bg-primary-800 text-neutral-400 hover:text-accent-500 transition-colors disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-primary-800 bg-primary-950 z-10">
            {/* Shipping Banner */}
            <div className="bg-primary-900/40 py-2.5 px-6 text-center border-b border-primary-800">
              <p className="text-[10px] font-bold text-accent-500 tracking-widest uppercase">
                {totals.subtotal >= shippingConfig.freeThreshold
                  ? '✨ Free Shipping Applied'
                  : `Add ${formatPrice(shippingConfig.freeThreshold - totals.subtotal)} more for Free Shipping`
                }
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Coupon Section */}
              <CouponSelector
                subtotal={totals.subtotal}
                discount={totals.discount}
                promotionText={totals.promotionText}
                onApply={async (code) => applyCoupon(code)}
                onClear={async () => clearCoupon()}
              />

              {/* Totals */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs text-neutral-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-neutral-200 font-medium">{formatPrice(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-xs text-green-400 font-medium uppercase tracking-widest">
                    <span>DSCT.</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                {/* Shipping Charge */}
                <div className="flex justify-between text-xs text-neutral-400 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="font-medium text-neutral-200">
                    {totals.subtotal >= shippingConfig.freeThreshold ? (
                      <span className="text-accent-500">FREE</span>
                    ) : (
                      formatPrice(shippingConfig.charge)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-primary-800">
                  <span className="text-sm font-bold text-neutral-50 uppercase tracking-widest">Total</span>
                  <span className="text-xl font-bold font-serif text-accent-500">
                    {formatPrice(totals.total + (totals.subtotal >= shippingConfig.freeThreshold ? 0 : shippingConfig.charge))}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full bg-accent-600 hover:bg-accent-500 text-primary-950 font-bold h-12 text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between px-6 group disabled:opacity-70 rounded-none transform active:scale-[0.99]"
                  disabled={isNavigating}
                  onClick={() => {
                    setIsNavigating(true);
                    closeCart();

                    if (useAuthStore.getState().user) {
                      router.push('/checkout');
                    } else {
                      router.push('/handler/sign-in?after_auth_return_to=/checkout');
                    }
                  }}
                >
                  {isNavigating ? (
                    <>
                      <span>Processing...</span>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-950 border-t-transparent"></div>
                    </>
                  ) : (
                    <>
                      <span>Secure Checkout</span>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1 opacity-60 mix-blend-multiply">
                          {/* Simple circles as placeholders if needed, but simplified for cleaner look */}
                        </div>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Coupon {
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: number;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'AURA10',
    title: '10% OFF',
    description: 'Get 10% discount on orders above ₹1,199',
    discount: '10% OFF',
    minOrder: 1199,
  },
];

function CouponSelector({
  subtotal,
  discount,
  promotionText,
  onApply,
  onClear,
}: {
  subtotal: number;
  discount: number;
  promotionText: string | null;
  onApply: (code: string) => Promise<void>;
  onClear: () => Promise<void>;
}) {
  const [showModal, setShowModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const handleApplyCoupon = async (code: string) => {
    await onApply(code);
    setAppliedCoupon(code);
    setShowModal(false);
  };

  const handleRemoveCoupon = async () => {
    await onClear();
    setAppliedCoupon(null);
  };

  const activeCoupon = AVAILABLE_COUPONS.find(c => c.code === appliedCoupon);

  return (
    <>
      {/* Coupon Button/Display */}
      <div className="bg-primary-900/30 border border-dashed border-primary-700 hover:border-accent-500/50 transition-colors">
        {!activeCoupon ? (
          <button
            onClick={() => setShowModal(true)}
            className="w-full p-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-accent-500" />
              <span className="text-xs font-bold text-neutral-300 group-hover:text-accent-400 uppercase tracking-wider">Apply Coupon</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-accent-500" />
          </button>
        ) : (
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-green-500" />
              <div>
                <p className="text-xs font-bold text-green-400 uppercase tracking-wider">{activeCoupon.code} Applied</p>
                <p className="text-[9px] text-neutral-500 uppercase tracking-wide">Saved {formatPrice(discount)}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-[10px] text-red-400 hover:text-red-300 hover:underline font-bold uppercase tracking-wider"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Coupon Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-primary-950/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-primary-950 border border-primary-800 shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-slide-up border-t-2 border-t-accent-500">
            {/* Modal Header */}
            <div className="p-4 border-b border-primary-800 flex items-center justify-between bg-primary-900/30">
              <h3 className="text-sm font-bold text-neural-50 font-serif tracking-wide text-white">AVAILABLE COUPONS</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-primary-800 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Coupons List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-primary-950">
              {AVAILABLE_COUPONS.map((coupon) => {
                const eligible = subtotal >= coupon.minOrder;
                const missing = Math.max(0, coupon.minOrder - subtotal);

                return (
                  <div
                    key={coupon.code}
                    className={`p-4 border transition-all ${eligible
                      ? 'border-accent-500/50 bg-accent-500/5 shadow-sm'
                      : 'border-primary-800 bg-primary-900/20 opacity-60'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Tag className={`h-3.5 w-3.5 ${eligible ? 'text-accent-500' : 'text-neutral-500'
                            }`} />
                          <span className={`font-bold text-xs uppercase tracking-wider ${eligible ? 'text-accent-500' : 'text-neutral-500'
                            }`}>
                            {coupon.code}
                          </span>
                        </div>
                        <p className={`text-sm font-bold mb-1 ${eligible ? 'text-neutral-200' : 'text-neutral-500'
                          }`}>
                          {coupon.discount}
                        </p>
                        <p className="text-[10px] text-neutral-400 mb-2 leading-relaxed">
                          {coupon.description}
                        </p>
                        {!eligible && (
                          <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                            Add {formatPrice(missing)} more to unlock
                          </p>
                        )}
                        {eligible && (
                          <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">
                            ✓ Eligible to apply
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApplyCoupon(coupon.code)}
                        disabled={!eligible}
                        className={`${eligible
                          ? 'bg-accent-600 hover:bg-accent-500 text-primary-950'
                          : 'bg-primary-800 text-neutral-500 cursor-not-allowed'
                          } px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-none h-auto`}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
