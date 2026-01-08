"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const personalities = [
    {
        id: 1,
        name: "The CEO",
        role: "Power & Authority",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop",
        link: "/collections/work"
    },
    {
        id: 2,
        name: "The Romantic",
        role: "Passion & Mystery",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop",
        link: "/collections/date-night"
    },
    {
        id: 3,
        name: "The Adventurer",
        role: "Freedom & Spirit",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop",
        link: "/collections/fresh"
    },
    {
        id: 4,
        name: "The Artist",
        role: "Creativity & Soul",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&h=256&auto=format&fit=crop",
        link: "/collections/unique"
    },
    {
        id: 5,
        name: "The Icon",
        role: "Bold & Legendary",
        image: "https://images.unsplash.com/photo-1531384441138-2736e62e0f19?q=80&w=256&h=256&auto=format&fit=crop",
        link: "/collections/party"
    },
    {
        id: 6,
        name: "The Minimalist",
        role: "Clean & Pure",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=256&h=256&auto=format&fit=crop",
        link: "/collections/clean"
    }
];

export function ShopByPersonality() {
    return (
        <section className="py-20 bg-primary-950 border-t border-primary-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <span className="text-accent-500 font-bold tracking-wider text-sm uppercase mb-2 block">Curated For You</span>
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-50">Shop by Personality</h2>
                    </div>
                    <Link href="/quiz" className="hidden sm:flex items-center text-accent-400 hover:text-accent-300 font-medium transition-colors">
                        Take the Scent Quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
                    {personalities.map((item) => (
                        <Link
                            key={item.id}
                            href={item.link}
                            className="flex-shrink-0 group flex flex-col items-center w-40 snap-start"
                        >
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary-800 group-hover:border-accent-500 transition-all duration-300 group-hover:scale-105 mb-4 shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-neutral-100 group-hover:text-accent-400 transition-colors">{item.name}</h3>
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">{item.role}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-4 sm:hidden text-center">
                    <Link href="/quiz" className="flex items-center justify-center text-accent-400 font-medium">
                        Take the Scent Quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
