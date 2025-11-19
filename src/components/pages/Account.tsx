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
  }, [stackUser]);

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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Premium Hero Section - Clean */}
      <section className="relative py-12 sm:py-16 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-3">
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
            <span className="text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase">WELCOME BACK</span>
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 leading-tight font-serif">
            My Account
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 tracking-wide font-light">
            {user.firstName} {user.lastName}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <a
                  href="#orders"
                  className="flex items-center px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                >
                  <Package className="h-4 w-4 mr-3 text-slate-400" />
                  Order History
                </a>
              
                <a
                  href="#settings"
                  className="flex items-center px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                >
                  <Settings className="h-4 w-4 mr-3 text-slate-400" />
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Orders section */}
          <div className="lg:col-span-3">
            <section id="orders" className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-serif">Order History</h2>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg text-center">
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                      <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">No orders yet.</p>
                      <Button className="mt-4" asChild>
                        <Link href="/collections/all">Start Shopping</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-amber-200 dark:hover:border-amber-800/50 transition-colors">
                          <div className="flex items-center justify-between flex-wrap gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Order ID</p>
                              <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Date</p>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Status</p>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[order.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-800'}`}>{order.status}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Total</p>
                              <p className="font-bold text-base text-slate-900 dark:text-white">{formatPrice(order.total)}</p>
                            </div>
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 min-w-[200px] border border-slate-100 dark:border-slate-800">
                                <div className="relative w-10 h-10 rounded bg-white dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                                  <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{it.name}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{it.quantity} × {formatPrice(it.price)}</p>
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