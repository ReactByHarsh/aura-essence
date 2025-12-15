"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Truck, Award, ChevronRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/commerce/ProductCard';
import { fetchFeatured, fetchProducts } from '@/lib/api/products';
import type { Product } from '@/types';

type HomeProps = {
  initialBestSellers?: Product[];
  initialNewProducts?: Product[];
  initialMenProducts?: Product[];
  initialWomenProducts?: Product[];
  prefetched?: boolean;
};

export function Home({
  initialBestSellers = [],
  initialNewProducts = [],
  initialMenProducts = [],
  initialWomenProducts = [],
  prefetched = false,
}: HomeProps) {
  const [bestSellers, setBestSellers] = useState<Product[]>(initialBestSellers);
  const [menProducts, setMenProducts] = useState<Product[]>(initialMenProducts);
  const [womenProducts, setWomenProducts] = useState<Product[]>(initialWomenProducts);
  const [newProducts, setNewProducts] = useState<Product[]>(initialNewProducts);
  const [loading, setLoading] = useState(!prefetched);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadProducts = useCallback(async () => {
    if (!mountedRef.current) return;

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setErrorMessage(null);

    try {
      const [featuredResult, menResult, womenResult] = await Promise.allSettled([
        fetchFeatured(signal),
        fetchProducts({ category: 'men', limit: 4, signal }),
        fetchProducts({ category: 'women', limit: 4, signal }),
      ]);

      if (!mountedRef.current) {
        return;
      }

      if (featuredResult.status === 'fulfilled') {
        const { newProducts: newItems, bestSellers: bestSellerItems } = featuredResult.value;
        const bestSellerProducts = (bestSellerItems ?? []).slice(0, 4);
        const newestProducts = (newItems ?? []).slice(0, 4);

        if (bestSellerProducts.length > 0) {
          setBestSellers(bestSellerProducts);
        }

        if (newestProducts.length > 0) {
          setNewProducts(newestProducts);
        }
      } else {
        if (featuredResult.reason?.name !== 'AbortError') {
          console.error('Failed to load featured products:', featuredResult.reason);
        }
        setBestSellers([]);
        setNewProducts([]);
      }

      if (menResult.status === 'fulfilled') {
        const menProductList = (menResult.value.products ?? []).slice(0, 4);
        setMenProducts(menProductList);
      } else {
        if (menResult.reason?.name !== 'AbortError') {
          console.error('Failed to load men products:', menResult.reason);
        }
        setMenProducts([]);
      }

      if (womenResult.status === 'fulfilled') {
        const womenProductList = (womenResult.value.products ?? []).slice(0, 4);
        setWomenProducts(womenProductList);
      } else {
        if (womenResult.reason?.name !== 'AbortError') {
          console.error('Failed to load women products:', womenResult.reason);
        }
        setWomenProducts([]);
      }

      if (featuredResult.status === 'rejected' && menResult.status === 'rejected' && womenResult.status === 'rejected') {
        setErrorMessage('Unable to reach the server right now.');
      } else if (featuredResult.status === 'rejected' || menResult.status === 'rejected' || womenResult.status === 'rejected') {
        setErrorMessage('Some sections failed to load.');
      } else {
        setErrorMessage(null);
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        // console.log('Products fetch aborted');
        return;
      }
      console.error('Failed to load products:', error);
      if (!mountedRef.current) {
        return;
      }

      setBestSellers([]);
      setNewProducts([]);
      setMenProducts([]);
      setWomenProducts([]);
      setErrorMessage('Unable to load products.');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (!prefetched) {
      void loadProducts();
    }
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadProducts, prefetched]);

  const handleRetry = useCallback(() => {
    if (!loading) {
      void loadProducts();
    }
  }, [loadProducts, loading]);

  const categories = [
    {
      name: 'Men\'s Collection',
      slug: 'men',
      image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Bold and sophisticated fragrances for the modern man'
    },
    {
      name: 'Women\'s Collection',
      slug: 'women',
      image: 'https://images.pexels.com/photos/1188440/pexels-photo-1188440.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Elegant and captivating scents for every occasion'
    }
  ];

  const testimonials = [
    {
      name: 'Elena Vasquez',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      comment: 'Aura Élixir Midnight Noir has become my signature scent. The depth and sophistication are unparalleled - I receive compliments wherever I go. Pure luxury in a bottle.'
    },
    {
      name: 'Marcus Thompson',
      rating: 5,
      date: '1 month ago',
      verified: true,
      comment: 'As a fragrance connoisseur, I\'ve tried countless brands. Aura Élixir stands apart with their masterful compositions and exceptional longevity. Forest King is simply extraordinary.'
    },
    {
      name: 'Sophia Chen',
      rating: 5,
      date: '3 weeks ago',
      verified: true,
      comment: 'The attention to detail in every Aura Élixir creation is remarkable. Royal Rose captures the essence of timeless elegance. Worth every penny of this premium experience.'
    }
  ];

  const features = [
    {
      icon: Award,
      title: 'Long Lasting Formula',
      description: 'High concentration EDPs designed to last over 12+ hours'
    },
    {
      icon: Shield,
      title: 'Certified Authentic',
      description: '100% original formulations with quality guarantee certificate'
    },
    {
      icon: Crown,
      title: '10k+ Happy Customers',
      description: 'Join the community of fragrance lovers who trust Aura Élixir'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Premium Hero Section - Clean & Elegant */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Background Image/Gradient - Subtle & Sophisticated */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:from-transparent dark:via-slate-900/50 dark:to-slate-900"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-12">
          <div className="mb-6 inline-flex items-center gap-3 animate-fade-in">
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
            <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase">
              Essence of Luxury
            </span>
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1] font-serif">
            Aura <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Élixir</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Discover a collection of premium fragrances, meticulously crafted to elevate your presence and express your unique identity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up mb-12">
            <Button
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 min-h-[56px] px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              asChild
            >
              <Link href="/collections/men">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 min-h-[56px] px-8 rounded-full text-base font-medium backdrop-blur-sm"
              asChild
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-slate-400 grayscale opacity-70">
            {/* Trust signals (Logos could be added here later) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Shield className="h-4 w-4" /> Authentic Guarantee
            </div>
            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Truck className="h-4 w-4" /> Free Shipping
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section - Clean Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {errorMessage && (
            <div className="mb-10 flex flex-col items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
              <p className="text-sm font-medium">{errorMessage}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
                disabled={loading}
                className="border-red-200 hover:bg-red-100 text-red-700"
              >
                {loading ? 'Refreshing...' : 'Retry Now'}
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
            <div className="flex-1 md:sticky md:top-24 self-start text-center md:text-left">
              <span className="text-amber-500 font-bold tracking-wider text-sm uppercase mb-2 block">Most Loved</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-serif">
                Bestselling <br /> Fragrances
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                Our most coveted scents, chosen by connoisseurs worldwide. These signature fragrances have captured hearts and become timeless favorites.
              </p>
              <Link
                href="/collections/men"
                className="inline-flex items-center text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white pb-1 hover:text-amber-600 hover:border-amber-600 dark:hover:text-amber-400 dark:hover:border-amber-400 transition-all group"
              >
                View All Best Sellers
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-900 rounded-2xl aspect-[3/4] animate-pulse"></div>
                  ))
                ) : (
                  bestSellers.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Men's Collection Section - Alternating Background */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse gap-12 lg:gap-16 items-center">
            <div className="flex-1 text-center md:text-left">
              <span className="text-amber-500 font-bold tracking-wider text-sm uppercase mb-2 block">For Him</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-serif">
                Men's Collection
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                Bold, sophisticated fragrances that capture the essence of modern masculinity.
                From fresh and crisp to deep and woody, find your signature scent.
              </p>
              <Link
                href="/collections/men"
                className="inline-flex items-center px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore Men's <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-gray-200 dark:bg-slate-800 rounded-xl aspect-square animate-pulse"></div>
                  ))
                ) : (
                  menProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Women's Collection Section - Clean White */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse gap-12 lg:gap-16 items-center">
            <div className="flex-1 text-center md:text-left">
              <span className="text-amber-500 font-bold tracking-wider text-sm uppercase mb-2 block">For Her</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-serif">
                Women's Collection
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                Elegantly captivating fragrances that celebrate femininity and grace.
                Discover floral, fruity, and oriental scents that turn heads.
              </p>
              <Link
                href="/collections/women"
                className="inline-flex items-center px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore Women's <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-900 rounded-2xl aspect-[3/4] animate-pulse"></div>
                  ))
                ) : (
                  womenProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals - Subtle Background */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex-1 text-center md:text-left">
              <span className="text-amber-500 font-bold tracking-wider text-sm uppercase mb-2 block">Latest Releases</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-serif">
                New Arrivals
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                Fresh additions to our luxury fragrance collection. Discover the latest masterpieces crafted by our perfumers.
              </p>
              <Link
                href="/collections/women"
                className="inline-flex items-center text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white pb-1 hover:text-amber-600 hover:border-amber-600 dark:hover:text-amber-400 dark:hover:border-amber-400 transition-all group"
              >
                View All New Arrivals
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-900 rounded-2xl aspect-[3/4] animate-pulse"></div>
                  ))
                ) : (
                  newProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimalist */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <feature.icon className="h-8 w-8 text-slate-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-serif">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Dark Luxury Theme */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-wider text-sm uppercase mb-2 block">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-serif">
              Loved by Enthusiasts
            </h2>
            <p className="text-slate-400 text-lg">
              Join thousands of satisfied customers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{testimonial.date}</span>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed italic font-light">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm">
                        {testimonial.name}
                      </p>
                      {testimonial.verified && (
                        <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
                          <Shield className="h-2 w-2" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section - Clean Bottom CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-purple-600 text-xs sm:text-sm font-semibold tracking-widest">OUR LEGACY</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 mt-3 sm:mt-4 px-4">
            The Aura Élixir Story
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 mb-8 sm:mb-10 leading-relaxed px-4">
            Since 2020, Aura Élixir has redefined luxury perfumery through unparalleled craftsmanship and innovation.
            Our master perfumers blend rare essences from the world's most prestigious regions, creating olfactory masterpieces
            that tell your unique story and leave an indelible impression.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 text-white hover:scale-105 shadow-xl hover:shadow-2xl transition-all min-h-[56px] text-base font-semibold px-10" asChild>
            <Link href="/about">Explore Our Heritage</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}