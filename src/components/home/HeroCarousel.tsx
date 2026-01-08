"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const slides = [
    {
        id: 1,
        // image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070&auto=format&fit=crop',
        image: '/images/hero/slide1-enhanced.png',
        subtitle: 'ESSENCE OF LUXURY',
        title: 'Discover Your Signature Scent',
        description: 'Experience the art of fine perfumery with our premium collection.',
        cta: 'Shop Now',
        link: '/collections/men',
        theme: 'gold'
    },
    {
        id: 2,
        image: '/images/hero/slide2.png',
        subtitle: 'THE ROYAL COLLECTION',
        title: 'Exquisite Craftsmanship',
        description: 'A tribute to the timeless elegance of rare ingredients.',
        cta: 'Explore Collection',
        link: '/collections/men',
        theme: 'white'
    },
    {
        id: 3,
        image: '/images/hero/slide3.png',
        subtitle: 'AURA OF GOLD',
        title: 'Unforgettable Presence',
        description: 'Leave a lasting impression with every spray.',
        cta: 'Shop Best Sellers',
        link: '/collections/women',
        theme: 'gold'
    }
];

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-primary-950">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Ken Burns Image */}
                    <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'
                        }`}>
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>

                    {/* Overlay Gradient - Adjusted for better text readability without washing out image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-black/20"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <div className={`max-w-4xl transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                            <div className="mb-6 flex items-center justify-center gap-4">
                                <div className="h-[1px] w-12 bg-accent-500"></div>
                                <span className="text-accent-400 tracking-[0.3em] text-sm font-bold uppercase">{slide.subtitle}</span>
                                <div className="h-[1px] w-12 bg-accent-500"></div>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-neutral-50 mb-6 leading-tight">
                                {slide.title}
                            </h1>

                            <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto font-light">
                                {slide.description}
                            </p>

                            <Button
                                size="lg"
                                className={`min-h-[56px] px-10 rounded-none text-base font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 ${slide.theme === 'gold'
                                    ? 'bg-accent-600 text-primary-950 hover:bg-accent-500'
                                    : 'bg-neutral-50 text-primary-950 hover:bg-neutral-200'
                                    }`}
                                asChild
                            >
                                <Link href={slide.link}>
                                    {slide.cta}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 transition-all duration-300 ${index === currentSlide ? 'w-12 bg-accent-500' : 'w-6 bg-neutral-500/50 hover:bg-neutral-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
