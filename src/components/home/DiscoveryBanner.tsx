"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DiscoveryBanner() {
    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background with Dark Gradient and overlay */}
            <div className="absolute inset-0 bg-primary-950">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595867275464-921447d2f93d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/80 to-transparent"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-center md:text-left">
                    <span className="inline-block py-1 px-3 border border-accent-500 rounded-full text-accent-400 text-xs font-bold tracking-widest uppercase mb-6 bg-accent-950/30 backdrop-blur-sm">
                        Best Way To Start
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-50 mb-6 leading-tight">
                        Find Your <br />
                        <span className="text-accent-400">Perfect Scent</span>
                    </h2>
                    <p className="text-neutral-300 text-lg mb-8 max-w-xl leading-relaxed">
                        Not sure which fragrance suits you? Experience our curated collection with the Discovery Set.
                        Five premium 2ml samples to test at your leisure.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button
                            size="lg"
                            className="bg-accent-600 hover:bg-accent-500 text-primary-950 font-bold px-8 rounded-none h-14"
                            asChild
                        >
                            <Link href="/product/discovery-set">
                                Buy Discovery Set - ₹999
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-none h-14"
                            asChild
                        >
                            <Link href="/quiz">
                                Take Scent Quiz
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl relative group hover:border-accent-500/30 transition-colors duration-500">
                    {/* Floating Price Tag */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-600 rounded-full flex flex-col items-center justify-center shadow-2xl z-10 animate-pulse-slow">
                        <span className="text-primary-950 font-bold text-xl">₹999</span>
                        <span className="text-primary-900 text-xs line-through">₹1499</span>
                    </div>

                    <h3 className="text-2xl font-serif text-neutral-100 mb-6">Discovery Collection</h3>
                    <ul className="space-y-4 mb-8">
                        {[
                            "5 x 2ml Premium Samples",
                            "Includes ₹500 Voucher",
                            "Free Shipping Included",
                            "Interactive Tasting Guide"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center text-neutral-300">
                                <div className="w-6 h-6 rounded-full bg-accent-900/50 flex items-center justify-center mr-3 text-accent-400">
                                    <Check className="w-3 h-3" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="text-xs text-neutral-500 text-center uppercase tracking-widest border-t border-white/5 pt-4">
                        Limited Stock Available
                    </div>
                </div>
            </div>
        </section>
    );
}
