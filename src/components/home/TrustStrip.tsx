"use client";
import React from 'react';
import { Clock, Globe, Leaf, RefreshCcw } from 'lucide-react';

const trustItems = [
    { icon: Clock, text: "Long Lasting (12+ Hrs)" },
    { icon: Globe, text: "Imported French Oils" },
    { icon: Leaf, text: "Cruelty-Free & Vegan" },
    { icon: RefreshCcw, text: "Easy 7-Day Returns" }
];

export function TrustStrip() {
    return (
        <div className="bg-primary-900 border-y border-accent-800/30 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {trustItems.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-12 h-12 rounded-full border border-accent-600/50 flex items-center justify-center mb-3 group-hover:bg-accent-600/10 transition-colors">
                                <item.icon className="h-6 w-6 text-accent-400" />
                            </div>
                            <span className="text-neutral-300 text-sm font-medium uppercase tracking-wide">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
