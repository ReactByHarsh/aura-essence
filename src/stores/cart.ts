import { create } from 'zustand';
import type { Product, CartItem } from '@/types';
import { useAuthStore } from './auth-neon';

const CART_CACHE_KEY = 'apex_cart_v1'

interface CartMutationOptions {
  skipReload?: boolean
}

interface CartTotalsState {
  subtotal: number;
  discount: number;
  total: number;
  promotionText: string | null;
}

interface CartState {
  items: CartItem[];
  totals: CartTotalsState;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  couponCode?: string;
  addItem: (product: Product, quantity?: number, selectedSize?: string, options?: CartMutationOptions) => Promise<void>;
  removeItem: (cartItemId: string, productId: string, selectedSize?: string | null, options?: CartMutationOptions) => Promise<void>;
  updateQuantity: (cartItemId: string, productId: string, quantity: number, selectedSize?: string | null) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  loadCart: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  applyCoupon: (code: string) => Promise<void>;
  clearCoupon: () => Promise<void>;
}

const EMPTY_TOTALS: CartTotalsState = {
  subtotal: 0,
  discount: 0,
  total: 0,
  promotionText: null,
};

function buildFallbackProduct(
  productId: string,
  productName: string | null,
  price: number,
  images: string[] | null,
): Product {
  return {
    id: productId,
    name: productName || 'Unknown Product',
    brand: 'Aura Élixir',
    price,
    images: images && images.length > 0 ? images : ['/perfume-logo.png'],
    category: 'unisex',
    type: 'EDP',
    notes: { top: [], heart: [], base: [] },
    longevity: 0,
    sillage: 'moderate',
    rating: 0,
    stock: 0,
    description: '',
    isNew: false,
    isBestSeller: false,
    isOnSale: false,
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totals: EMPTY_TOTALS,
  isOpen: false,
  isLoading: false,
  error: null,
  couponCode: undefined,

  addItem: async (product: Product, quantity = 1, selectedSize = '30ml', options?: CartMutationOptions) => {
    try {
      set({ error: null });
      const user = useAuthStore.getState().user;

      if (!user) {
        // Guest Cart Logic
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          item => item.product.id === product.id && item.selectedSize === selectedSize
        );

        let newItems = [...currentItems];

        if (existingItemIndex > -1) {
          // Update existing item
          const item = newItems[existingItemIndex];
          const unitPrice = product.sizes?.[selectedSize]?.price ?? product.price; // Use size price
          newItems[existingItemIndex] = {
            ...item,
            quantity: item.quantity + quantity,
            unitPrice,
            lineTotal: unitPrice * (item.quantity + quantity)
          };
        } else {
          // Add new item
          const unitPrice = product.sizes?.[selectedSize]?.price ?? product.price; // Use size price
          const newItem: CartItem = {
            id: `${product.id}-${selectedSize}`, // Temporary ID for guest
            product,
            quantity,
            selectedSize,
            unitPrice,
            lineTotal: unitPrice * quantity,
          };
          newItems.push(newItem);
        }

        // Calculate simplified totals for guest (no coupons/complex logic yet)
        const subtotal = newItems.reduce((acc, item) => acc + (item.lineTotal ?? (item.unitPrice ?? item.product.price) * item.quantity), 0);

        const totals = {
          subtotal,
          discount: 0,
          total: subtotal,
          promotionText: null
        };

        set({ items: newItems, totals });

        // Persist to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            CART_CACHE_KEY,
            JSON.stringify({ items: newItems, totals })
          );
        }
        return;
      }

      // Authenticated Logic
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          productId: product.id,
          quantity,
          selectedSize,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add item' }));
        if (response.status === 401) {
          throw new Error('Please sign in to add items to cart');
        }
        throw new Error(errorData.error || 'Failed to add item to cart');
      }

      // Use the response data instead of reloading
      if (!options?.skipReload) {
        const data = await response.json();
        const cartItems = data.items || [];
        const totalsResponse = data.totals || data.summary || EMPTY_TOTALS;

        const mappedItems: CartItem[] = cartItems.map((ci: any) => {
          const imagesFromCart = ci.product_images && ci.product_images.length > 0 ? ci.product_images : null;

          const product: Product = buildFallbackProduct(
            ci.product_id,
            ci.product_name,
            ci.product_price,
            imagesFromCart
          );

          return {
            id: ci.id || `${ci.product_id}-${ci.selected_size ?? 'default'}`,
            product,
            quantity: ci.quantity,
            selectedSize: ci.selected_size,
            unitPrice: ci.product_price,
            lineTotal: ci.total_price,
          };
        });

        const resolvedTotals: CartTotalsState = {
          subtotal: totalsResponse.subtotal ?? 0,
          discount: totalsResponse.discount ?? 0,
          total: totalsResponse.total ?? 0,
          promotionText: totalsResponse.promotion_text ?? null,
        };

        set({ items: mappedItems, totals: resolvedTotals });
        // Don't cache authenticated cart in localStorage to avoid conflicts
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      const message = error instanceof Error ? error.message : 'Failed to add item to cart';
      set({ error: message });
      throw error;
    }
  },

  removeItem: async (cartItemId: string, productId: string, selectedSize: string | null = null, options?: CartMutationOptions) => {
    try {
      set({ error: null });
      const user = useAuthStore.getState().user;

      if (!user) {
        // Guest Cart Logic
        let newItems = get().items.filter(item =>
          !(item.product.id === productId && (selectedSize ? item.selectedSize === selectedSize : true))
        );

        // Recalculate totals
        const subtotal = newItems.reduce((acc, item) => acc + (item.lineTotal ?? (item.unitPrice ?? item.product.price) * item.quantity), 0);

        const totals = {
          subtotal,
          discount: 0,
          total: subtotal,
          promotionText: null
        };

        set({ items: newItems, totals });

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            CART_CACHE_KEY,
            JSON.stringify({ items: newItems, totals })
          );
        }
        return;
      }

      // Authenticated Logic
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          cartItemId,
          productId,
          selectedSize,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to remove item' }));
        throw new Error(errorData.error || 'Failed to remove item from cart');
      }

      // Use the response data instead of reloading
      if (!options?.skipReload) {
        const data = await response.json();
        const cartItems = data.items || [];
        const totalsResponse = data.totals || data.summary || EMPTY_TOTALS;

        const mappedItems: CartItem[] = cartItems.map((ci: any) => {
          const imagesFromCart = ci.product_images && ci.product_images.length > 0 ? ci.product_images : null;

          const product: Product = buildFallbackProduct(
            ci.product_id,
            ci.product_name,
            ci.product_price,
            imagesFromCart
          );

          return {
            id: ci.id || `${ci.product_id}-${ci.selected_size ?? 'default'}`,
            product,
            quantity: ci.quantity,
            selectedSize: ci.selected_size,
            unitPrice: ci.product_price,
            lineTotal: ci.total_price,
          };
        });

        const resolvedTotals: CartTotalsState = {
          subtotal: totalsResponse.subtotal ?? 0,
          discount: totalsResponse.discount ?? 0,
          total: totalsResponse.total ?? 0,
          promotionText: totalsResponse.promotion_text ?? null,
        };

        set({ items: mappedItems, totals: resolvedTotals });
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove item from cart';
      set({ error: message });
      throw error;
    }
  },

  updateQuantity: async (cartItemId: string, productId: string, quantity: number, selectedSize: string | null = null) => {
    if (quantity <= 0) {
      await get().removeItem(cartItemId, productId, selectedSize);
      return;
    }

    try {
      set({ error: null });
      const user = useAuthStore.getState().user;

      if (!user) {
        // Guest Cart Logic
        const currentItems = get().items;
        const index = currentItems.findIndex(item =>
          item.product.id === productId && (selectedSize ? item.selectedSize === selectedSize : true)
        );

        if (index > -1) {
          const newItems = [...currentItems];
          const item = newItems[index];
          const unitPrice = item.unitPrice ?? item.product.sizes?.[item.selectedSize ?? '']?.price ?? item.product.price;

          newItems[index] = {
            ...item,
            quantity,
            lineTotal: unitPrice * quantity
          };

          const subtotal = newItems.reduce((acc, item) => acc + (item.lineTotal ?? 0), 0);

          const totals = {
            subtotal,
            discount: 0,
            total: subtotal,
            promotionText: null
          };

          set({ items: newItems, totals });
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(
              CART_CACHE_KEY,
              JSON.stringify({ items: newItems, totals })
            );
          }
        }
        return;
      }

      // Authenticated Logic
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          cartItemId,
          productId,
          selectedSize,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update quantity' }));
        throw new Error(errorData.error || 'Failed to update cart quantity');
      }

      // Use the response data instead of reloading
      const data = await response.json();
      const cartItems = data.items || [];
      const totalsResponse = data.totals || data.summary || EMPTY_TOTALS;

      const mappedItems: CartItem[] = cartItems.map((ci: any) => {
        const imagesFromCart = ci.product_images && ci.product_images.length > 0 ? ci.product_images : null;

        const product: Product = buildFallbackProduct(
          ci.product_id,
          ci.product_name,
          ci.product_price,
          imagesFromCart
        );

        return {
          id: ci.id || `${ci.product_id}-${ci.selected_size ?? 'default'}`,
          product,
          quantity: ci.quantity,
          selectedSize: ci.selected_size,
          unitPrice: ci.product_price,
          lineTotal: ci.total_price,
        };
      });

      const resolvedTotals: CartTotalsState = {
        subtotal: totalsResponse.subtotal ?? 0,
        discount: totalsResponse.discount ?? 0,
        total: totalsResponse.total ?? 0,
        promotionText: totalsResponse.promotion_text ?? null,
      };

      set({ items: mappedItems, totals: resolvedTotals });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      const message = error instanceof Error ? error.message : 'Failed to update cart quantity';
      set({ error: message });
      throw error;
    }
  },

  clearCart: async () => {
    try {
      set({ error: null });
      const user = useAuthStore.getState().user;

      if (user) {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'clear' }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to clear cart' }));
          throw new Error(errorData.error || 'Failed to clear cart');
        }
      }

      set({ items: [], totals: EMPTY_TOTALS });

      // Clear localStorage cache for both guest and auth
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(CART_CACHE_KEY);
        }
      } catch { }
    } catch (error) {
      console.error('Error clearing cart:', error);
      const message = error instanceof Error ? error.message : 'Failed to clear cart';
      set({ error: message });
      throw error;
    }
  },

  openCart: () => {
    try {
      const cached = typeof window !== 'undefined' ? window.localStorage.getItem(CART_CACHE_KEY) : null
      if (cached) {
        const parsed = JSON.parse(cached)
        const items = Array.isArray(parsed.items) ? parsed.items : []
        const totals = parsed.totals && typeof parsed.totals === 'object' ? parsed.totals : EMPTY_TOTALS
        set({ items, totals })
      }
    } catch { }
    set({ isOpen: true });
  },

  closeCart: () => set({ isOpen: false, error: null }),

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => get().totals.subtotal,

  getTax: () => 0,

  getTotal: () => get().totals.total,

  loadCart: async () => {
    try {
      set({ isLoading: true, error: null });

      const user = useAuthStore.getState().user;

      if (!user) {
        // Load from local storage for guests
        const cached = typeof window !== 'undefined' ? window.localStorage.getItem(CART_CACHE_KEY) : null;
        if (cached) {
          const parsed = JSON.parse(cached);
          const items = Array.isArray(parsed.items) ? parsed.items : [];
          const totals = parsed.totals && typeof parsed.totals === 'object' ? parsed.totals : EMPTY_TOTALS;
          set({ items, totals });
        } else {
          set({ items: [], totals: EMPTY_TOTALS });
        }
        set({ isLoading: false });
        return;
      }

      // Check for local items to sync BEFORE loading from server
      try {
        const localCache = typeof window !== 'undefined' ? window.localStorage.getItem(CART_CACHE_KEY) : null;
        if (localCache) {
          const parsed = JSON.parse(localCache);
          const localItems = Array.isArray(parsed.items) ? parsed.items : [];

          if (localItems.length > 0) {
            // Sync these items to backend
            const syncBody = {
              action: 'sync',
              items: localItems.map((item: CartItem) => ({
                productId: item.product.id,
                quantity: item.quantity
              }))
            };

            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(syncBody),
            });

            // Clear local cache after sync attempt
            window.localStorage.removeItem(CART_CACHE_KEY);
          }
        }
      } catch (syncError) {
        console.error('Error syncing guest cart:', syncError);
        // Continue to load cart even if sync fails
      }

      const qs = get().couponCode ? `?coupon=${encodeURIComponent(get().couponCode as string)}` : '';
      const response = await fetch(`/api/cart${qs}`, {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Fallback to empty if unauthorized unexpectedly
          set({ items: [], totals: EMPTY_TOTALS, isLoading: false });
          return;
        }
        throw new Error('Failed to load cart');
      }

      const data = await response.json();
      const cartItems = data.items || [];
      const totalsResponse = data.totals || data.summary || EMPTY_TOTALS;

      const mappedItems: CartItem[] = cartItems.map((ci: any) => {
        const imagesFromCart = ci.product_images && ci.product_images.length > 0 ? ci.product_images : null;

        const product: Product = buildFallbackProduct(
          ci.product_id,
          ci.product_name,
          ci.product_price,
          imagesFromCart
        );

        return {
          id: ci.id || `${ci.product_id}-${ci.selected_size ?? 'default'}`,
          product,
          quantity: ci.quantity,
          selectedSize: ci.selected_size,
          unitPrice: ci.product_price,
          lineTotal: ci.total_price,
        };
      });

      const resolvedTotals: CartTotalsState = {
        subtotal: totalsResponse.subtotal ?? 0,
        discount: totalsResponse.discount ?? 0,
        total: totalsResponse.total ?? 0,
        promotionText: totalsResponse.promotion_text ?? null,
      };

      set({ items: mappedItems, totals: resolvedTotals });
      // We do NOT cache server cart in localStorage to avoid confusion with guest cart
      // or we could cache it with a flag, but for now simple separation is safer.
      // Actually, maintaining a cache for authenticated users is good for performance/offline viewing,
      // but mixing "guest items to sync" and "authenticated cache" in the same key is risky.
      // Decision: Remove authenticated cache from localStorage to keep 'CART_CACHE_KEY' purely for guest/offline edits
      // or creating a separate key?
      // For this task, strict separation: Guest uses localStorage. Auth uses Server.
    } catch (error) {
      console.error('Error loading cart:', error);
      set({ error: 'Failed to load cart', items: [], totals: EMPTY_TOTALS });
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  applyCoupon: async (code: string) => {
    set({ couponCode: code.trim() || undefined });
    await get().loadCart();
  },
  clearCoupon: async () => {
    set({ couponCode: undefined });
    await get().loadCart();
  },
}));
