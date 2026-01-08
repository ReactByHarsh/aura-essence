"use client";
import React from 'react';

export function RefundPolicy() {
  return (
    <div className="min-h-screen bg-primary-950 text-neutral-200">
      {/* Premium Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-primary-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/60 via-primary-950 to-primary-950"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-3">
            <div className="h-[1px] w-12 bg-accent-500"></div>
            <span className="text-accent-500 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">POLICIES</span>
            <div className="h-[1px] w-12 bg-accent-500"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-50 mb-3 sm:mb-4 leading-tight font-serif">
            Refund Policy
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="prose prose-lg max-w-none prose-invert text-neutral-400">
          <p className="text-sm text-accent-500 mb-8 font-medium">
            Last updated: January 25, 2025
          </p>

          {/* Business Information Box */}
          <div className="bg-primary-900/30 border-l-2 border-accent-500 p-8 mb-12">
            <h3 className="text-lg font-bold text-neutral-50 mb-3 font-serif">Business Information</h3>
            <div className="space-y-2 text-neutral-300">
              <p className="text-sm"><strong className="text-accent-500 font-medium">Business Name:</strong> Aura Elixir</p>
              <p className="text-sm"><strong className="text-accent-500 font-medium">Managed by:</strong> Harshavardhan Shinde</p>
              <p className="text-sm"><strong className="text-accent-500 font-medium">Email:</strong> help@auraelixir.co.in</p>
              <p className="text-sm"><strong className="text-accent-500 font-medium">Phone:</strong> +91 9028709575</p>
              <p className="text-sm"><strong className="text-accent-500 font-medium">Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">
              Refund Policy
            </h2>
            <p className="text-neutral-400 font-light leading-relaxed">
              At Aura Elixir, we are committed to customer satisfaction. This refund policy outlines the terms and conditions for returns, refunds, and cancellations in accordance with Indian consumer protection laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">
              Return Policy
            </h2>
            <p className="mb-4 text-neutral-400 font-light leading-relaxed">
              We understand that purchasing fragrances online can be challenging. To ensure customer satisfaction, we offer the following return options:
            </p>

            <h3 className="text-lg font-bold text-neutral-200 mb-3 font-serif">Product Categories</h3>
            <ul className="list-disc list-inside space-y-3 mb-6 text-neutral-400 font-light">
              <li><strong>Unopened Products:</strong> Full refunds accepted within 2 days of delivery for unopened, original packaging products</li>
              <li><strong>Trial/Decant Sizes (20ml):</strong> Strictly non-returnable, non-refundable, and non-exchangeable. We recommend decants to test products before purchasing full-size bottles</li>
              <li><strong>Opened or Used Fragrances:</strong> Returns and exchanges are not offered for opened, tested, or used fragrances for health and safety reasons</li>
              <li><strong>Damaged/Defective Products:</strong> Returns accepted for damaged or defective products with proof (unboxing video). Contact us within 2 business days of delivery. When approved, replacement will be provided in 7 days</li>
            </ul>
            {/* ... and so on for other sections */}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">
              Contact & Support
            </h2>
            <div className="bg-primary-900/50 border border-primary-800 p-6">
              <p className="mb-2 text-neutral-300"><strong className="text-accent-500">Email:</strong> help@auraelixir.co.in</p>
              <p className="mb-2 text-neutral-300"><strong className="text-accent-500">Phone:</strong> +91 9028709575</p>
              <p className="mb-2 text-neutral-300"><strong className="text-accent-500">Hours:</strong> Monday - Friday, 11:00 AM - 6:00 PM (IST)</p>
              <p className="text-neutral-300"><strong className="text-accent-500">Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
