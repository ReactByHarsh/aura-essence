"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { formatPrice } from '@/lib/utils';

type OrderItemDisplay = {
  name: string;
  image: string;
  quantity: number;
  price: number;
};

type OrderDisplay = {
  id: string;
  created_at: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: OrderItemDisplay[];
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
};

export default function OrdersPage() {
  const stackUser = useUser();
  const router = useRouter();
  const [orders, setOrders] = React.useState<OrderDisplay[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!stackUser) {
      router.replace('/handler/sign-in');
    }
  }, [stackUser, router]);

  React.useEffect(() => {
    if (!stackUser?.id) return;
    
    const abortController = new AbortController();
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/orders?page=1&limit=10', { 
          cache: 'no-store',
          signal: abortController.signal 
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        const mapped: OrderDisplay[] = (data.orders || []).map((o: any) => ({
          id: o.id,
          created_at: o.created_at,
          status: o.status,
          total: o.total_amount,
          items: (o.order_items || []).map((i: any) => ({
            name: i.product?.name ?? 'Product',
            image: (Array.isArray(i.product?.images) && i.product?.images[0]) ? i.product.images[0] : '/perfume-logo.png',
            quantity: i.quantity,
            price: i.price,
          })),
        }));
        setOrders(mapped);
      } catch (e: any) {
        if (e.name === 'AbortError') {
          // console.log('Orders fetch aborted');
          return;
        }
        setError(e?.message ?? 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    
    return () => {
      abortController.abort();
    };
  }, [stackUser?.id]);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-primary-950">
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-amber-400 text-xs sm:text-sm font-semibold tracking-widest">YOUR ORDERS</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white mt-2">
            Order History
          </h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6">
          {loading ? (
            <p className="text-slate-600 dark:text-gray-400">Loading orders...</p>
          ) : error ? (
            <p className="text-red-600 dark:text-red-400">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-slate-600 dark:text-gray-400">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-gray-400">Order ID</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{order.id}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[order.status] || 'bg-slate-100 text-slate-800'}`}>{order.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 dark:text-gray-400">Total</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3 overflow-x-auto">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-2 min-w-[220px]">
                        <img src={it.image} alt={it.name} className="h-10 w-10 object-cover rounded" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{it.name}</p>
                          <p className="text-xs text-slate-600 dark:text-gray-400">{it.quantity} × {formatPrice(it.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
