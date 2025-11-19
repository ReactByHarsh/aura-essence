"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ChevronRight, Home } from 'lucide-react';
import { ProductCard } from '@/components/commerce/ProductCard';
import type { Product } from '@/types';
import { fetchProducts } from '@/lib/api/products';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const initialProducts: Product[] = [];

// Category mapping
const CATEGORY_TITLES: Record<string, string> = {
  men: "Men's Fragrances",
  women: "Women's Fragrances",
};

const VALID_CATEGORIES = ['men', 'women'];

export function Collections() {
  const params = useParams<{ category?: string }>() ?? {};
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('name');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get category from URL parameters
  const rawCategory = (params?.category ?? 'men').toLowerCase();
  const activeCategory = VALID_CATEGORIES.includes(rawCategory) ? rawCategory : 'men';
  const categoryTitle = CATEGORY_TITLES[activeCategory] || "Fragrances";
  const categoryDescription = activeCategory === 'men' 
    ? 'Bold and sophisticated fragrances for the modern man'
    : 'Elegant and captivating scents for every occasion';


  // Validate category - redirect to /collections/men if invalid
  useEffect(() => {
    if (!VALID_CATEGORIES.includes(rawCategory)) {
      router.replace('/collections/men');
    }
  }, [rawCategory, router]);

  // Fetch products by category from Supabase
  useEffect(() => {
    let isMounted = true;
    let requestInProgress = true;
    const abortController = new AbortController();
    
    setLoading(true);
    setErrorMessage(null);
    
    const fetchData = async () => {
      try {
        const resp = await fetchProducts({ 
          category: activeCategory, 
          page: 1, 
          limit: 24,
          signal: abortController.signal 
        });
        requestInProgress = false;
        const mapped = resp.products ?? [];
        
        if (!isMounted) {
          return;
        }
        setProducts(mapped);
        setCurrentPage(1);
        setTotalPages(resp.totalPages || 1);
        setErrorMessage(null);
      } catch (e: any) {
        requestInProgress = false;
        
        // Check if component is still mounted before updating state
        if (!isMounted) {
          return;
        }
        
        // Don't show errors for aborted requests
        if (e.name === 'AbortError') {
          return;
        }
        
        console.error('Failed to load products', e);
        setProducts([]);
        setErrorMessage('Unable to load products from Supabase.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
      // Only abort if request is still in progress
      if (requestInProgress) {
        abortController.abort();
      }
    };
  }, [activeCategory, reloadToken]);

  const handleRetry = useCallback(() => {
    if (!loading) {
      setReloadToken(prev => prev + 1);
    }
  }, [loading]);

  const handleLoadMore = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const resp = await fetchProducts({ category: activeCategory, page: nextPage, limit: 24 });
      setProducts(prev => [...prev, ...(resp.products ?? [])]);
      setCurrentPage(nextPage);
      setTotalPages(resp.totalPages || totalPages);
    } catch (e) {
      console.error('Failed to load more products', e);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, currentPage, totalPages, loading]);

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <section className="py-4 px-4 sm:px-6 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="flex items-center text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-white font-medium">
              {categoryTitle}
            </span>
          </nav>
        </div>
      </section>

      {/* Premium Hero Section for Collections - Clean & Modern */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-3 animate-fade-in">
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
            <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase">
              {activeCategory === 'men' ? 'FOR HIM' : 'FOR HER'}
            </span>
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 font-serif">
            {categoryTitle}
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 tracking-wide font-light max-w-2xl mx-auto px-4 mb-8">
            {categoryDescription}
          </p>

          <p className="text-base text-slate-500 dark:text-slate-400 max-w-3xl mx-auto px-4 mb-10 leading-relaxed">
            {activeCategory === 'men' 
              ? 'From woody earth tones to fresh aquatic notes, our men\'s collection features signature fragrances from renowned perfumers worldwide. Each scent is crafted with the finest ingredients for lasting impression and confidence.'
              : 'Elegant florals, sensual orientals, and sophisticated chypres define our women\'s collection. Discover fragrances that capture the essence of femininity, from delicate daytime scents to captivating evening aromas.'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 min-h-[56px] px-8 rounded-full text-base font-medium" 
              asChild
            >
              <Link href="#products">
                Shop Collection
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid Section - Mobile First */}
      <section id="products" className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {errorMessage && (
            <div className="mb-6 sm:mb-8 flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 sm:px-6 py-4 sm:py-5 text-center text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 shadow-sm">
              <p className="text-sm sm:text-base font-medium">{errorMessage}</p>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleRetry}
                disabled={loading}
                className="border border-red-200 text-red-700 dark:text-red-300 min-h-[48px] px-6 font-semibold hover:bg-red-100 dark:hover:bg-red-900/40"
              >
                {loading ? 'Refreshing...' : 'Retry Now'}
              </Button>
            </div>
          )}

          {/* Sort Dropdown */}
          {products.length > 0 && (
            <div className="mb-6 sm:mb-8 flex justify-end">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Sort by</label>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium hover:border-amber-500 transition-colors focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm cursor-pointer text-sm"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Display */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-slate-800 rounded-xl aspect-square animate-pulse"></div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 dark:bg-slate-900 rounded-full mb-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 font-serif">
                No Products Found
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
                Check back soon for new arrivals in our {categoryTitle.toLowerCase()}
              </p>
              <Button className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" asChild>
                <Link href="/">Browse All Collections</Link>
              </Button>
            </div>
          )}

          {/* Load more */}
          {products.length > 0 && currentPage < totalPages && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}