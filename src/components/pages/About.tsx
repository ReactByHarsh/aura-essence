"use client";
import React from 'react';

export function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Premium Hero Section - Clean */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl py-12 sm:py-0">
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
            <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase">ABOUT US</span>
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight font-serif">
            Aura Élixir
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 md:p-16 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light text-center">
            Aura Élixir is a luxury fragrance brand dedicated to crafting exceptional, high-quality fragrances that celebrate individuality and elegance. We source only the finest ingredients and work with master perfumers to create distinctive scents that resonate with our discerning clientele. Each fragrance in our collection is meticulously designed to deliver a unique olfactory experience, combining traditional craftsmanship with modern innovation. At Aura Élixir, we believe that fragrance is the ultimate form of personal expression, and we are committed to providing our customers with luxury products that embody sophistication, quality, and timeless elegance.
          </p>
        </div>
      </div>
    </div>
  );
}