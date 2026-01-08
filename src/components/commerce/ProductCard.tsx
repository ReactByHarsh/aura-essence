import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRating } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getMinPrice = () => {
    if (product.sizes) {
      const sizes = product.sizes as any;
      if (sizes['30ml']?.price) return sizes['30ml'].price;
      return 369;
    }
    return product.price;
  };

  const currentPrice = getMinPrice();
  // Standard luxury markup visualization
  const slashedPrice = Math.round(currentPrice * 1.4);
  const discount = Math.round((1 - currentPrice / slashedPrice) * 100);

  const getImageForIndex = (index: number) => {
    const image = product.images[index] ?? product.images[0];
    return image ?? '/perfume-logo.png';
  };

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const success = await toggleItem(product);
      if (success) {
        setIsWishlisted(!isWishlisted);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-primary-900 rounded-none overflow-hidden border border-primary-800 hover:border-accent-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
    >
      <div
        className="relative aspect-[4/5] overflow-hidden bg-primary-950"
        onMouseEnter={() => product.images.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <Image
          src={getImageForIndex(currentImageIndex)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent opacity-60"></div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-accent-600 text-primary-950 border-none font-serif tracking-wider">NEW</Badge>}
          {product.isBestSeller && <Badge className="bg-neutral-100 text-primary-950 border-none font-serif tracking-wider">BESTSELLER</Badge>}
          {product.isOnSale && <Badge className="bg-red-900/80 text-white border-red-800 font-serif tracking-wider">SALE</Badge>}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-primary-950/50 backdrop-blur-sm border border-primary-800 text-neutral-400 hover:text-accent-500 hover:border-accent-500 transition-all duration-300"
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? 'fill-accent-500 text-accent-500' : ''}`}
          />
        </button>


      </div>

      <div className="p-4 text-center">
        {/* Type/Brand */}
        <div className="text-xs text-accent-500 mb-1 uppercase tracking-[0.2em]">
          {product.type || 'Eau De Parfum'}
        </div>

        {/* Name */}
        <h3 className="font-serif text-lg text-neutral-100 mb-2 line-clamp-1 group-hover:text-accent-400 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(product.rating || 5) ? 'fill-accent-500 text-accent-500' : 'fill-primary-800 text-primary-800'}`}
            />
          ))}
          <span className="text-xs text-neutral-500 ml-1">({product.reviewCount || 24})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-lg font-medium text-neutral-100">
            ₹{currentPrice}
          </span>
          <span className="text-sm text-neutral-600 line-through">
            ₹{slashedPrice}
          </span>
        </div>

        {/* Add to Cart Button - Visible on Hover/Always visible on mobile if desired, but request asked for 'below' */}
        <Button
          onClick={handleAddToCart}
          className="w-full bg-transparent border border-accent-600 text-accent-500 hover:bg-accent-600 hover:text-primary-950 font-bold uppercase tracking-wider rounded-none transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Bag
        </Button>
      </div>
    </Link>
  );
}
