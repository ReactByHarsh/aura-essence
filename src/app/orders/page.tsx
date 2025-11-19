"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { formatPrice } from '@/lib/utils';
import { Check, Package, Truck, Clock, ShoppingBag } from 'lucide-react';

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

const STEPS = [
  { id: 'pending', label: 'Order Placed', icon: ShoppingBag },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Check },
];

const getStepStatus = (currentStatus: string, stepId: string) => {
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const stepIndex = statusOrder.indexOf(stepId);

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'upcoming';
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="relative py-12 sm:py-16 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-3">
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
            <span className="text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase">YOUR ORDERS</span>
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 leading-tight font-serif">
            Order History
          </h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <section className="space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg text-center">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No orders yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Start shopping to see your orders here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* Order Header */}
                  <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 justify-between items-center">
                    <div className="flex flex-wrap gap-6 sm:gap-12">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Total Amount</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Order ID</p>
                        <p className="text-sm font-mono text-slate-600 dark:text-slate-300">#{order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Tracker */}
                    <div className="mb-8 sm:mb-10 mt-2">
                      <div className="relative">
                        {/* Progress Bar Background */}
                        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-0 relative">
                          {STEPS.map((step, idx) => {
                            const status = getStepStatus(order.status, step.id);
                            const Icon = step.icon;
                            
                            return (
                              <div key={step.id} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3 relative z-10">
                                {/* Icon Circle */}
                                <div className={`
                                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 shrink-0
                                  ${status === 'completed' || status === 'current' 
                                    ? 'bg-amber-500 border-amber-500 text-white' 
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'}
                                `}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                
                                {/* Label */}
                                <div className="flex flex-col sm:items-center">
                                  <span className={`
                                    text-sm font-bold uppercase tracking-wide
                                    ${status === 'completed' || status === 'current' 
                                      ? 'text-slate-900 dark:text-white' 
                                      : 'text-slate-400 dark:text-slate-600'}
                                  `}>
                                    {step.label}
                                  </span>
                                  {status === 'current' && (
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                                      In Progress
                                    </span>
                                  )}
                                </div>

                                {/* Mobile Connector Line (Vertical) */}
                                {idx !== STEPS.length - 1 && (
                                  <div className={`
                                    absolute left-5 top-10 bottom-[-24px] w-0.5 sm:hidden
                                    ${status === 'completed' ? 'bg-amber-500' : 'bg-slate-100 dark:bg-slate-800'}
                                  `}></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 sm:gap-6">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 overflow-hidden shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                              {item.name}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <button className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 underline-offset-4 hover:underline">
                              Write a Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
