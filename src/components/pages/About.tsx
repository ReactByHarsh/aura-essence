"use client";
import React from 'react';

export function About() {
  return (
    <div className="min-h-screen">
      {/* Premium Hero Section - Mobile Optimized */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl py-12 sm:py-0">
          <div className="mb-4 sm:mb-6 inline-block">
            <span className="text-amber-400 text-xs sm:text-sm font-semibold tracking-widest">ABOUT US</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider text-white mb-4 sm:mb-6 leading-tight">
            Aura Élixir
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 sm:p-10 md:p-12">
          <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-gray-300 leading-relaxed">
            Aura Élixir is a luxury fragrance brand dedicated to crafting exceptional, high-quality fragrances that celebrate individuality and elegance. We source only the finest ingredients and work with master perfumers to create distinctive scents that resonate with our discerning clientele. Each fragrance in our collection is meticulously designed to deliver a unique olfactory experience, combining traditional craftsmanship with modern innovation. At Aura Élixir, we believe that fragrance is the ultimate form of personal expression, and we are committed to providing our customers with luxury products that embody sophistication, quality, and timeless elegance.
          </p>
        </div>
      </div>
    </div>
  );
}