"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Heart, ShoppingBag, Truck, Shield, RotateCcw, ChevronRight, Sparkles, Flame, Award } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useToaster } from '@/components/ui/ToasterProvider';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/commerce/ProductCard';
import { formatPrice, formatRating } from '@/lib/utils';
import { fetchProduct as fetchProductApi, fetchProducts } from '@/lib/api/products';
import type { Product as AppProduct } from '@/types';

type Product = AppProduct;

type ProductDetailProps = {
  initialProduct?: AppProduct | null;
  initialRelated?: AppProduct[];
  prefetched?: boolean;
};

export function ProductDetail({ initialProduct = null, initialRelated = [], prefetched = false }: ProductDetailProps) {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!prefetched);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<AppProduct[]>(initialRelated);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('30ml');
  const [currentPrice, setCurrentPrice] = useState<number>(349);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();
  const toast = useToaster();
  const stackUser = useUser({ or: 'return-null' });

  // Fetch product and related products via API if not prefetched
  useEffect(() => {
    if (prefetched) return;

    const abortController = new AbortController();

    async function loadProductData() {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const productData = await fetchProductApi(id, abortController.signal);
        if (!productData) {
          setError('Product not found');
          setProduct(null);
          return;
        }
        setProduct(productData as any);
        try {
          const response = await fetchProducts({
            category: productData.category,
            page: 1,
            limit: 4,
            signal: abortController.signal
          });
          const related = response.products.filter(p => p.id !== id).slice(0, 4);
          setRelatedProducts(related);
        } catch (err: any) {
          if (err.name === 'AbortError') {
            // console.log('Related products fetch aborted');
            return;
          }
          console.error('Error fetching related products:', err);
          setRelatedProducts([]);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // console.log('Product fetch aborted');
          return;
        }
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadProductData();

    return () => {
      abortController.abort();
    };
  }, [id, prefetched]);

  // Show loading state while params are being resolved
  if (isLoading || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium tracking-wide">Loading Essence...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-serif">Product Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
            {error || 'Sorry, we couldn\'t find the product you\'re looking for. Please browse our collections or try searching again.'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900">
              <Link href="/collections/men">Browse Men's Collection</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">
              <Link href="/collections/women">Browse Women's Collection</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!stackUser) {
      toast.info('Please sign in to add items to cart');
      router.push('/handler/sign-in');
      return;
    }

    if (product) {
      try {
        await addItem(product, quantity, selectedSize);
        toast.success(`Added ${product.name} to cart`);
      } catch (error) {
        console.error('❌ Error adding to cart:', error);
        const message = error instanceof Error ? error.message : 'Failed to add to cart';
        toast.error(message);
      }
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const sizes = product?.sizes as any;
    if (sizes && sizes[size]) {
      setCurrentPrice(sizes[size].price || 699);
    }
  };

  const getSizePrice = (): number => {
    const sizes = product?.sizes as any;
    if (sizes && sizes[selectedSize]) {
      return sizes[selectedSize].price || (selectedSize === '20ml' ? 299 : selectedSize === '30ml' ? 369 : selectedSize === '50ml' ? 499 : 699);
    }
    return selectedSize === '20ml' ? 299 : selectedSize === '30ml' ? 369 : selectedSize === '50ml' ? 499 : 699;
  };

  const getSlashedPrice = (price: number): number => {
    // Add ~43% markup to show as slashed price
    return Math.round(price * 1.43);
  };

  const getSillageDescription = (sillage: string) => {
    switch (sillage) {
      case 'soft': return 'Intimate - Close to skin projection';
      case 'moderate': return 'Moderate - Arms length projection';
      case 'strong': return 'Strong - Room filling presence';
      default: return sillage;
    }
  };

  const getLongevityDescription = (hours: number) => {
    if (hours <= 4) return 'Poor (0-4 hours)';
    if (hours <= 6) return 'Weak (4-6 hours)';
    if (hours <= 8) return 'Moderate (6-8 hours)';
    if (hours <= 12) return 'Good (8-12 hours)';
    return 'Excellent (12+ hours)';
  };

  // JSON-LD Schema for SEO
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "ratingCount": "100"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb & Navigation - Clean */}
      <section className="py-4 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-16 z-30 backdrop-blur-sm bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/collections/${product.category}`}
              className="capitalize hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {product.category === 'unisex' ? 'Unisex' : product.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 dark:text-white font-medium line-clamp-1">{product.name}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </section>

      {/* Main Product Section - Clean Layout */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative group">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {/* Only show first 2 images */}
                  {product.images.slice(0, 2).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                        ? 'border-slate-900 dark:border-white ring-1 ring-slate-900/10 dark:ring-white/10'
                        : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                    >
                      <div className="relative w-full h-full bg-slate-50 dark:bg-slate-900">
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 sm:space-y-8">
              {/* Badges - Clean */}
              <div className="flex gap-2 flex-wrap">
                {product.isNew && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                    <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                    New Arrival
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/50">
                    <Award className="h-3 w-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
                {product.isOnSale && (
                  <Badge variant="secondary" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800/50">
                    <Flame className="h-3 w-3 mr-1" />
                    Limited Offer
                  </Badge>
                )}
              </div>

              {/* Title and Brand - Clean Typography */}
              <div className="space-y-2">
                <p className="text-amber-600 dark:text-amber-400 text-xs font-bold tracking-widest uppercase">
                  {product.brand}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight font-serif">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-medium capitalize">
                    {product.type}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-medium capitalize">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Rating - Clean */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200 dark:text-slate-700'
                        }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatRating(product.rating)}
                  </span>
                  <span className="mx-1">•</span>
                  <span>100+ reviews</span>
                </div>
              </div>

              {/* Description - Clean */}
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Size Selection - Clean */}
              <div className="space-y-3">
                <label className="font-medium text-slate-900 dark:text-white text-sm">
                  Select Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {/* ['20ml', '30ml', '50ml', '100ml'] - Commented out 20ml and 100ml */}
                  {['30ml', '50ml'].map((size) => {
                    const sizes = product.sizes as any;
                    const price = sizes?.[size]?.price || (size === '20ml' ? 299 : size === '30ml' ? 369 : size === '50ml' ? 499 : 699);
                    const slashedPrice = getSlashedPrice(price);
                    const discount = Math.round((1 - price / slashedPrice) * 100);
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`py-3 px-1 rounded-lg border transition-all text-sm flex flex-col items-center justify-center ${selectedSize === size
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100 ring-1 ring-amber-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                          }`}
                      >
                        <span className="font-medium mb-1">{size}</span>
                        <div className="text-xs flex items-center gap-1.5">
                          <span className="font-bold">₹{price}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Display - Clean */}
              <div className="py-4 border-t border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-medium">
                    Total Price
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white font-serif">
                      ₹{getSizePrice()}
                    </span>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{getSlashedPrice(getSizePrice())}
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                      SAVE {Math.round((1 - getSizePrice() / getSlashedPrice(getSizePrice())) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Fragrance Notes - Clean */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">
                  Fragrance Profile
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-xs mb-1">Top Notes</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {product.notes && typeof product.notes === 'object' && 'top' in product.notes
                        ? (product.notes as any).top?.join(', ') || '—'
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-xs mb-1">Heart Notes</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {product.notes && typeof product.notes === 'object' && 'heart' in product.notes
                        ? (product.notes as any).heart?.join(', ') || '—'
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-xs mb-1">Base Notes</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {product.notes && typeof product.notes === 'object' && 'base' in product.notes
                        ? (product.notes as any).base?.join(', ') || '—'
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart - Clean */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
                    >
                      −
                    </button>
                    <span className="px-4 py-3 font-medium text-slate-900 dark:text-white min-w-[3rem] text-center border-l border-r border-slate-200 dark:border-slate-700">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {product.stock > 0 ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        In Stock
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 h-12 text-base font-medium rounded-lg shadow-sm"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="h-12 w-12 p-0 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'
                        }`}
                    />
                  </Button>
                </div>
              </div>

              {/* Features - Clean */}
              <div className="grid grid-cols-1 gap-3 pt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <Truck className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Free shipping on orders over ₹5000</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <Shield className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">100% authentic guarantee</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <RotateCcw className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">30-day hassle-free returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-t-2 border-amber-200 dark:border-amber-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="h-1 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></span>
                <span className="text-amber-600 dark:text-amber-400 text-sm font-bold tracking-widest uppercase">✨ DISCOVER MORE</span>
                <span className="h-1 w-12 bg-gradient-to-l from-amber-500 to-orange-500 rounded-full"></span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                You May Also Love
              </h2>
              <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore other premium scents in our {product.category === 'men' ? "men's" : product.category === 'women' ? "women's" : "curated"} collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 py-4 px-8 text-lg"
                asChild
              >
                <Link href={`/collections/${product.category}`}>
                  View All {product.category === 'men' ? "Men's" : "Women's"} Collection
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
