"use client";
import React from 'react';

export function Terms() {
  return (
    <div className="min-h-screen">
      {/* Premium Hero Section - Mobile Optimized */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="mb-4 sm:mb-6 inline-block">
            <span className="text-amber-400 text-xs sm:text-sm font-semibold tracking-widest">LEGAL</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white mb-3 sm:mb-4 leading-tight">
            Terms of Service
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="prose prose-lg max-w-none text-slate-600 dark:text-gray-300">
          <p className="text-sm text-slate-600 dark:text-gray-400 mb-8">
            Last updated: November 16, 2025
          </p>

          {/* Business Information Box */}
          <div className="bg-gradient-to-r from-purple-50 to-amber-50 dark:from-purple-900/30 dark:to-amber-900/30 border-l-4 border-purple-600 p-4 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Business Information</h3>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Business Name:</strong> Aura Elixir</p>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Managed by:</strong> Harshavardhan Shinde</p>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Email:</strong> help@auraelixir.co.in</p>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Phone:</strong> +91 9028709575</p>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Welcome to Aura Elixir
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Aura Elixir's relationship with you in relation to this website.
            </p>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              This website is operated by Aura Elixir. Throughout the site, the terms "we," "us," and "our" refer to Aura Elixir. Aura Elixir offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
            </p>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"). These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
            </p>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Promotional Codes/Discounts
            </h2>
            <p className="text-slate-700 dark:text-gray-200">
              Promotional codes or discounts cannot be combined or used on sale items; they are also not applicable to any Bespoke Products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-amber-50 dark:from-purple-900/30 dark:to-amber-900/30 border-l-4 border-purple-600 p-4 rounded-lg">
              <p className="mb-2 text-slate-700 dark:text-gray-200"><strong>Business Name:</strong> Aura Elixir</p>
              <p className="mb-2 text-slate-700 dark:text-gray-200"><strong>Managed by:</strong> Harshavardhan Shinde</p>
              <p className="mb-2 text-slate-700 dark:text-gray-200"><strong>Email:</strong> help@auraelixir.co.in</p>
              <p className="mb-2 text-slate-700 dark:text-gray-200"><strong>Phone:</strong> +91 9028709575</p>
              <p className="text-slate-700 dark:text-gray-200"><strong>Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
