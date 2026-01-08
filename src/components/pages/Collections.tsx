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
        <div className="min-h-screen bg-neutral-50 dark:bg-primary-950">
            {/* Breadcrumb Navigation - Dark Theme */}
            <section className="mt-20 py-4 px-4 sm:px-6 bg-primary-950 border-b border-primary-900">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="flex items-center text-neutral-400 hover:text-accent-500 transition-colors">
                            <Home className="h-4 w-4 mr-1" />
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-neutral-600" />
                        <span className="text-neutral-200 font-medium">
                            {categoryTitle}
                        </span>
                    </nav>
                </div>
            </section>

            {/* Premium Hero Section for Collections */}
            <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden bg-primary-950 text-center">

                {/* Background Element */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-primary-950 to-primary-950"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="mb-6 inline-flex items-center gap-3 animate-fade-in">
                        <div className="h-[1px] w-12 bg-accent-500"></div>
                        <span className="text-accent-500 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">
                            {activeCategory === 'men' ? 'POUR HOMME' : 'POUR FEMME'}
                        </span>
                        <div className="h-[1px] w-12 bg-accent-500"></div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-50 mb-6 font-serif">
                        {categoryTitle}
                    </h1>

                    <p className="text-lg sm:text-xl text-neutral-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
                        {categoryDescription}
                    </p>

                    <p className="text-base text-neutral-500 max-w-3xl mx-auto mb-12 leading-relaxed">
                        {activeCategory === 'men'
                            ? 'Masterfully blended notes of oud, leather, and fresh spice. Designed for the man who commands attention without speaking a word.'
                            : 'A symphony of rare florals, warm vanilla, and exotic spices. Created for the woman who leaves a lingering trace of elegance.'
                        }
                    </p>
                </div>
            </section>

            {/* Products Grid Section */}
            <section id="products" className="py-12 sm:py-16 px-4 sm:px-6 bg-white dark:bg-primary-950 border-t border-primary-900/50">
                <div className="max-w-7xl mx-auto">
                    {errorMessage && (
                        <div className="mb-8 flex flex-col items-center gap-3 rounded-none border border-red-900/30 bg-red-900/10 px-6 py-5 text-center text-red-400">
                            <p className="text-sm sm:text-base font-medium">{errorMessage}</p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleRetry}
                                disabled={loading}
                                className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                            >
                                {loading ? 'Refreshing...' : 'Retry Now'}
                            </Button>
                        </div>
                    )}

                    {/* Sort & Filter Bar */}
                    <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-primary-900/50 pb-6">
                        <span className="text-neutral-400 text-sm">
                            Showing <span className="text-white font-semibold">{products.length}</span> results
                        </span>

                        {products.length > 0 && (
                            <div className="flex items-center gap-3">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Sort by</label>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="appearance-none pl-4 pr-10 py-2.5 rounded-none border border-primary-800 bg-primary-900 text-neutral-300 font-medium hover:border-accent-600 transition-colors focus:outline-none focus:border-accent-500 text-sm"
                                    >
                                        <option value="name">Name (A-Z)</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Products Display */}
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-primary-900 aspect-[4/5] animate-pulse"></div>
                            ))}
                        </div>
                    ) : sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {sortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 px-4 bg-primary-900/30 border border-primary-900 border-dashed">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-900 rounded-full mb-6 text-neutral-600">
                                <ShoppingBag className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-200 mb-3 font-serif">
                                No Products Found
                            </h3>
                            <p className="text-neutral-500 mb-8">
                                Check back soon for new arrivals in our {categoryTitle.toLowerCase()}
                            </p>
                            <Button className="bg-accent-600 text-primary-950 font-bold hover:bg-accent-500" asChild>
                                <Link href="/">Return to Home</Link>
                            </Button>
                        </div>
                    )}

                    {/* Load more */}
                    {products.length > 0 && currentPage < totalPages && (
                        <div className="mt-16 flex justify-center">
                            <Button
                                onClick={handleLoadMore}
                                disabled={loading}
                                variant="outline"
                                className="border-accent-600 text-accent-500 hover:bg-accent-950 hover:text-accent-400 font-semibold px-8 py-6 rounded-none uppercase tracking-widest text-xs"
                            >
                                {loading ? 'Loading...' : 'Load More Products'}
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}