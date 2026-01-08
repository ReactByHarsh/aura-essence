"use client";
import React from 'react';

export function Terms() {
  return (
    <div className="min-h-screen bg-primary-950 text-neutral-200">
      {/* Premium Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-primary-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/60 via-primary-950 to-primary-950"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="h-[1px] w-12 bg-accent-500"></div>
            <span className="text-accent-500 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">LEGAL</span>
            <div className="h-[1px] w-12 bg-accent-500"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-50 mb-8 leading-tight font-serif">
            Terms of Service
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose prose-lg max-w-none prose-invert text-neutral-400">
          <p className="text-sm text-accent-500 mb-8 font-medium">
            Last updated: November 16, 2025
          </p>

          {/* Business Information Box */}
          <div className="bg-primary-900/30 border-l-2 border-accent-500 p-8 mb-12">
            <h3 className="text-lg font-bold text-neutral-50 mb-4 font-serif">Business Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-300">
              <p><strong className="text-accent-500 font-medium">Business Name:</strong> Aura Elixir</p>
              <p><strong className="text-accent-500 font-medium">Managed by:</strong> Harshavardhan Shinde</p>
              <p><strong className="text-accent-500 font-medium">Email:</strong> help@auraelixir.co.in</p>
              <p><strong className="text-accent-500 font-medium">Phone:</strong> +91 9028709575</p>
              <p className="sm:col-span-2"><strong className="text-accent-500 font-medium">Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">
              Welcome to Aura Elixir
            </h2>
            <p className="mb-4 text-neutral-400 font-light leading-relaxed">
              Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Aura Elixir's relationship with you in relation to this website.
            </p>
            <p className="mb-4 text-neutral-400 font-light leading-relaxed">
              This website is operated by Aura Elixir. Throughout the site, the terms "we," "us," and "our" refer to Aura Elixir. Aura Elixir offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
