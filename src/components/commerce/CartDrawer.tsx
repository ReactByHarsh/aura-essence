"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { CartItem as CartItemType } from '@/types';
import Image from 'next/image';

const DEFAULT_SIZES = ['20ml', '50ml', '100ml'];

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
  const drawerRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-in-right"
      >
        {/* Header - Clean & Organized */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-slate-900 dark:text-white" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Cart
            </h2>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {items.reduce((t, i) => t + i.quantity, 0)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeCart}
            className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-2"
          >
            <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </Button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-0 bg-white dark:bg-slate-950">
          {/* Error display */}
          {error && (
            <div className="m-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 dark:border-white border-t-transparent"></div>
              <p className="text-slate-600 dark:text-gray-400 mb-4 font-medium mt-6">
                Loading...
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center h-full px-4">
              <div className="mb-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-full">
                <ShoppingBag className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-slate-900 dark:text-white mb-2 font-bold text-lg">
                Your cart is empty
              </p>
              <p className="text-sm text-slate-500 dark:text-gray-500 mb-8 max-w-xs mx-auto">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button
                onClick={closeCart}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-full font-medium transition-all"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map(item => {
                const sizeValue = item.selectedSize ?? null;
                const selectedSize = sizeValue ?? '20ml';
                const itemKey = buildLoadingKey(item.id, sizeValue);
                const isItemLoading = loadingItems.has(itemKey);
                const unitPrice = item.unitPrice ?? item.product.price;
                const lineTotal = item.lineTotal ?? unitPrice * item.quantity;
                const sizeOptions = item.product.sizes ? Object.keys(item.product.sizes) : DEFAULT_SIZES;
                const coverImage = item.product.images[0] ?? '/perfume-logo.png';

                return (
                  <div key={itemKey} className="flex gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group relative">
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                      <Image
                        src={coverImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      {isItemLoading && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-900 dark:border-white border-t-transparent"></div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate pr-2">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <select
                              value={selectedSize}
                              onChange={(e) => handleSizeChange(item, e.target.value)}
                              disabled={isItemLoading}
                              className="text-xs text-slate-500 dark:text-slate-400 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
                            >
                              {sizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.product.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          disabled={isItemLoading}
                          className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors p-1 -mr-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-3">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {formatPrice(lineTotal)}
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 shadow-sm">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={isItemLoading}
                            className="p-1.5 px-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-1 text-xs font-semibold text-slate-900 dark:text-white min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={isItemLoading}
                            className="p-1.5 px-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-50"
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
          <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            {/* Note Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 py-2 px-4 text-center border-b border-emerald-100 dark:border-emerald-900/20">
              <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                NOTE: Free shipping on all prepaid orders
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* Coupon Section */}
              <CouponSelector
                subtotal={totals.subtotal}
                discount={totals.discount}
                promotionText={totals.promotionText}
                onApply={async (code) => applyCoupon(code)}
                onClear={async () => clearCoupon()}
              />

              {/* Totals */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Savings</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(totals.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full bg-black hover:bg-slate-800 text-white font-bold h-12 text-sm transition-all duration-300 shadow-lg flex items-center justify-between px-6 group"
                  onClick={() => {
                    closeCart();
                    setTimeout(() => router.push('/checkout'), 250);
                  }}
                >
                  <span>BUY NOW</span>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 opacity-80">
                      {/* Simple payment indicators */}
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                    </div>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
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
  color: string;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'AURA10',
    title: '10% OFF',
    description: 'Get 10% discount on orders above ₹1,199',
    discount: '10% OFF',
    minOrder: 1199,
    color: 'amber',
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
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-amber-400 dark:border-amber-600 shadow-sm">
        {!activeCoupon ? (
          <button
            onClick={() => setShowModal(true)}
            className="w-full p-2.5 flex items-center justify-between hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Apply Coupon</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          </button>
        ) : (
          <div className="p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs font-bold text-green-700 dark:text-green-400">{activeCoupon.code} Applied</p>
                <p className="text-[9px] text-slate-600 dark:text-slate-400">{activeCoupon.title} • Saved {formatPrice(discount)}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-[10px] text-red-600 dark:text-red-400 hover:underline font-semibold"
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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-slide-up border-t-4 border-amber-500">
            {/* Modal Header */}
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">Available Coupons</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Coupons List */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
              {AVAILABLE_COUPONS.map((coupon) => {
                const eligible = subtotal >= coupon.minOrder;
                const missing = Math.max(0, coupon.minOrder - subtotal);

                return (
                  <div
                    key={coupon.code}
                    className={`p-3 rounded-xl border transition-all ${eligible
                        ? 'border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-70'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Tag className={`h-3.5 w-3.5 ${eligible ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
                            }`} />
                          <span className={`font-bold text-xs ${eligible ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-gray-400'
                            }`}>
                            {coupon.code}
                          </span>
                        </div>
                        <p className={`text-base font-bold mb-0.5 ${eligible ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-gray-500'
                          }`}>
                          {coupon.discount}
                        </p>
                        <p className="text-[10px] text-slate-600 dark:text-gray-400 mb-1.5 leading-snug">
                          {coupon.description}
                        </p>
                        {!eligible && (
                          <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold">
                            Add {formatPrice(missing)} more to unlock
                          </p>
                        )}
                        {eligible && (
                          <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
                            ✓ Eligible to apply
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApplyCoupon(coupon.code)}
                        disabled={!eligible}
                        className={`${eligible
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                          } px-3 py-1.5 text-[10px] font-bold`}
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
