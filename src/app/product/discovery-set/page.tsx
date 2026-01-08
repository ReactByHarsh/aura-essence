"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Star, Check, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types';
import Link from 'next/link';

export default function DiscoverySetPage() {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();
    const [activeImage, setActiveImage] = useState(0);

    const product = {
        id: 'discovery-set',
        name: 'The Royal Discovery Set',
        description: 'Experience our 5 signature scents in premium 2ml glass vials. The perfect way to find your signature scent before committing to a full bottle.',
        price: 999,
        originalPrice: 1999, // Showing a "sale" price standard
        images: [
            '/discovery-set-main.jpg', // Placeholder, using what we have or generic
            '/discovery-open.jpg',
            '/discovery-vials.jpg'
        ],
        features: [
            '5 x 2ml Premium Glass Vials',
            'Includes ₹500 Redeemable Voucher',
            'Unisex Collection (Best Sellers)',
            'Free Shipping Nationwide'
        ]
    };

    const handleAddToCart = () => {
        const fullProduct: Product = {
            id: product.id,
            name: product.name,
            brand: 'Aura Elixir',
            price: product.price,
            images: [product.images[0]],
            category: 'unisex',
            type: 'Discovery Set',
            description: product.description,
            stock: 99,
            rating: 5,
            notes: { top: [], heart: [], base: [] },
            longevity: 8,
            sillage: 'moderate',
            isNew: true
        };

        addItem(fullProduct, quantity, '5ml', { skipReload: true });
    };


    return (
        <div className="min-h-screen bg-primary-950 text-neutral-100 font-sans">
            {/* Breadcrumb */}
            <div className="py-4 px-4 sm:px-6 border-b border-primary-900 bg-primary-950">
                <div className="max-w-7xl mx-auto text-sm text-neutral-400">
                    <Link href="/" className="hover:text-accent-500">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-neutral-200">The Royal Discovery Set</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative aspect-square bg-primary-900 overflow-hidden border border-primary-800">
                            {/* Use a placeholder if actual image not clear, relying on next/image error handling to show alt text if missing or plain div */}
                            <div className="absolute inset-0 flex items-center justify-center bg-primary-900 text-neutral-700">
                                <span className="text-lg">Discovery Set Image</span>
                            </div>
                            {/* 
                 Ideally we would use <Image /> but without confirmed assets, a styled placeholder is safer 
                 Replace with Image when asset is known 
               */}
                            <Image
                                src="/perfume-logo.png"
                                alt="The Royal Discovery Set"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-accent-600 text-primary-950 px-3 py-1 text-xs font-bold tracking-widest uppercase">Best Seller</span>
                            </div>
                        </div>
                        {/* Thumbnails would go here */}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-neutral-50 mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex text-accent-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                </div>
                                <span className="text-neutral-400 text-sm">(128 Reviews)</span>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-medium text-neutral-100">₹{product.price}</span>
                                <span className="text-xl text-neutral-600 line-through">₹{product.originalPrice}</span>
                                <span className="bg-red-900/30 text-red-400 border border-red-900/50 px-2 py-1 text-xs font-bold uppercase">50% OFF</span>
                            </div>

                            <p className="text-lg text-neutral-300 leading-relaxed font-light border-l-2 border-accent-500 pl-4">
                                {product.description}
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="bg-primary-900/30 p-6 border border-primary-900">
                            <h3 className="text-accent-500 font-serif text-lg mb-4">What's Inside</h3>
                            <ul className="space-y-3">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                                        <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-primary-900">
                            <div className="flex items-center bg-primary-900 border border-primary-800 w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-4 hover:text-accent-500 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-4 hover:text-accent-500 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 bg-accent-600 hover:bg-accent-500 text-primary-950 font-bold uppercase tracking-widest py-6 text-sm rounded-none"
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Add to Bag
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-8">
                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                <ShieldCheck className="w-5 h-5 text-accent-500" />
                                <span>100% Authentic</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                <Truck className="w-5 h-5 text-accent-500" />
                                <span>Free Shipping above ₹399</span>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
