"use client";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import React, { Suspense } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { ToasterProvider } from '@/components/ui/ToasterProvider';

// Dynamic imports for better code splitting
const Navbar = dynamic(() => import('@/components/layout/Navbar').then(mod => ({ default: mod.Navbar })), {
  ssr: true,
  loading: () => (
    <div className="h-16 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-slate-700/50 shadow-sm flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
    </div>
  )
});

const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })), {
  ssr: true
});

const CartDrawer = dynamic(
  () => import('@/components/commerce/CartDrawer').then(mod => mod.CartDrawer),
  { ssr: false }
);

// Toast container is handled by ToasterProvider

const inter = Inter({ subsets: ['latin'], display: 'swap' });

function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-primary-950 transition-colors duration-200">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Aura Elixir - Premium Luxury Perfumes & Fragrances Online India</title>
        <meta name="description" content="Discover Aura Elixir's exquisite collection of luxury perfumes and fragrances for men and women. Shop premium EDP, EDT, and niche fragrances online in India with fast shipping." />
        <meta name="keywords" content="luxury perfumes, premium fragrances, perfumes for men, perfumes for women, EDP perfume, EDT fragrance, niche perfumes India, buy perfumes online, Aura Elixir, long lasting perfumes, designer fragrances, combo perfume packs" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://auraelixir.co.in/" />
        <meta property="og:title" content="Aura Elixir - Premium Luxury Perfumes & Fragrances Online India" />
        <meta property="og:description" content="Discover Aura Elixir's exquisite collection of luxury perfumes and fragrances for men and women. Shop premium EDP, EDT, and niche fragrances online in India." />
        <meta property="og:image" content="https://auraelixir.co.in/perfume-logo.png" />
        <meta property="og:site_name" content="Aura Elixir" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://auraelixir.co.in/" />
        <meta property="twitter:title" content="Aura Elixir - Premium Luxury Perfumes & Fragrances Online India" />
        <meta property="twitter:description" content="Discover Aura Elixir's exquisite collection of luxury perfumes and fragrances for men and women." />
        <meta property="twitter:image" content="https://auraelixir.co.in/perfume-logo.png" />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Aura Elixir" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Barshi, Maharashtra, India" />
        <meta name="geo.position" content="18.2346;75.6958" />
        <meta name="ICBM" content="18.2346, 75.6958" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://auraelixir.co.in/" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />

        {/* Theme Color */}
        <meta name="theme-color" content="#7c3aed" />

        {/* Verification (add later with actual codes) */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}

        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aura Elixir",
              "url": "https://auraelixir.co.in",
              "logo": "https://auraelixir.co.in/perfume-logo.png",
              "description": "Premium luxury perfumes and fragrances for discerning individuals",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9028709575",
                "contactType": "Customer Service",
                "email": "help@auraelixir.co.in",
                "availableLanguage": ["English", "Hindi"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Balaji Colony",
                "addressLocality": "Barshi",
                "addressRegion": "Maharashtra",
                "postalCode": "413401",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.facebook.com/auraelixir",
                "https://www.instagram.com/auraelixir",
                "https://twitter.com/auraelixir"
              ]
            })
          }}
        />

        {/* Structured Data - Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Aura Elixir",
              "image": "https://auraelixir.co.in/perfume-logo.png",
              "priceRange": "₹₹₹",
              "telephone": "+91-9028709575",
              "email": "help@auraelixir.co.in",
              "url": "https://auraelixir.co.in",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Balaji Colony",
                "addressLocality": "Barshi",
                "addressRegion": "MH",
                "postalCode": "413401",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "18.2346",
                "longitude": "75.6958"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:30",
                "closes": "18:00"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <ToasterProvider>
              <AppContent>{children}</AppContent>
            </ToasterProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
