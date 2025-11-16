"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useUser, useStackApp } from '@stackframe/stack';
import { Button } from '@/components/ui/Button';
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

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800'
};

export function Account() {
  const stackUser = useUser();
  const stackApp = useStackApp();
  const router = useRouter();
  const [orders, setOrders] = React.useState<OrderDisplay[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const user = React.useMemo(() => {
    if (!stackUser) return null;
    return {
      id: stackUser.id,
      email: stackUser.primaryEmail || '',
      firstName: stackUser.displayName?.split(' ')[0] || '',
      lastName: stackUser.displayName?.split(' ').slice(1).join(' ') || '',
    };
  }, [stackUser?.id, stackUser?.primaryEmail, stackUser?.displayName]);

  React.useEffect(() => {
    if (!stackUser) {
      router.replace('/handler/sign-in');
    }
  }, [stackUser, router]);

  React.useEffect(() => {
    if (!user?.id) {
      return;
    }
    
    const abortController = new AbortController();
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/orders?page=1&limit=10', { 
          cache: 'no-store',
          signal: abortController.signal 
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
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
  }, [user?.id]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await stackApp.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section - Mobile Optimized */}
      <section className="relative py-10 sm:py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-3 sm:mb-4 inline-block">
            <span className="text-purple-300 text-[10px] sm:text-xs font-semibold tracking-widest">WELCOME BACK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white mb-2 leading-tight">
            My Account
          </h1>
          <p className="text-base sm:text-lg text-purple-200 tracking-wide font-light">
            {user.firstName} {user.lastName}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800/50 p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-2.5">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 truncate max-w-[150px]">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-1.5">
                <a
                  href="#orders"
                  className="flex items-center px-2.5 py-2 text-xs text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                >
                  <Package className="h-3.5 w-3.5 mr-2" />
                  Order History
                </a>
              
                <a
                  href="#settings"
                  className="flex items-center px-2.5 py-2 text-xs text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 mr-2" />
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Orders section */}
          <div className="lg:col-span-3">
            <section id="orders" className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800/50 p-4 sm:p-5">
                  <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">Order History</h2>
                  {loading ? (
                    <p className="text-purple-600 dark:text-purple-400 text-sm">Loading orders...</p>
                  ) : error ? (
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  ) : orders.length === 0 ? (
                    <p className="text-purple-600 dark:text-purple-400 text-sm">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map(order => (
                        <div key={order.id} className="border border-purple-200 dark:border-purple-800/50 rounded-lg p-3">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <div>
                              <p className="text-[10px] text-purple-600 dark:text-purple-400">Order ID</p>
                              <p className="font-semibold text-xs text-purple-700 dark:text-purple-300">{order.id}</p>
                            </div>
                            <div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusColors[order.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-800'}`}>{order.status}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-purple-600 dark:text-purple-400">Total</p>
                              <p className="font-semibold text-xs text-purple-700 dark:text-purple-300">{formatPrice(order.total)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-1.5 min-w-[180px] border border-purple-200 dark:border-purple-800/50">
                                <img src={it.image} alt={it.name} className="h-8 w-8 object-cover rounded" />
                                <div>
                                  <p className="text-[10px] font-medium text-purple-700 dark:text-purple-300 truncate max-w-[120px]">{it.name}</p>
                                  <p className="text-[9px] text-purple-600 dark:text-purple-400">{it.quantity} × {formatPrice(it.price)}</p>
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
      </div>
    </div>
  );
}