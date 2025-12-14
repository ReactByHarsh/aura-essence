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
  const baseUrl = 'https://auraelixir.co.in';

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Aura Elixir",
    "alternateName": ["Aura Elixir India", "Aura Elixir Perfumes", "AuraElixir"],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/perfume-logo.png`,
      "width": 512,
      "height": 512
    },
    "description": "Aura Elixir - India's premium destination for luxury inspired perfumes and fragrances for men, women, and unisex.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9028709575",
      "contactType": "Customer Service",
      "email": "help@auraelixir.co.in",
      "availableLanguage": ["English", "Hindi", "Marathi"],
      "areaServed": "IN"
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
      "https://www.instagram.com/auraelixir.in",
      "https://www.facebook.com/auraelixir"
    ]
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "Aura Elixir",
    "alternateName": "Aura Elixir Perfumes India",
    "description": "Premium luxury inspired perfumes and fragrances online store in India. Shop best quality EDP and EDT perfumes for men, women, and unisex.",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "inLanguage": "en-IN"
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${baseUrl}/#store`,
    "name": "Aura Elixir",
    "image": `${baseUrl}/perfume-logo.png`,
    "priceRange": "₹₹",
    "telephone": "+91-9028709575",
    "email": "help@auraelixir.co.in",
    "url": baseUrl,
    "description": "Premium luxury inspired perfumes and fragrances store in India. Shop best EDP and EDT perfumes for men, women and unisex. Free shipping above ₹399.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Balaji Colony",
      "addressLocality": "Barshi",
      "addressRegion": "Maharashtra",
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
    },
    "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, PhonePe",
    "currenciesAccepted": "INR"
  };

  return (
    <html lang="en">
      <head>
        <title>Aura Elixir - Premium Luxury Perfumes & Inspired Fragrances Online India</title>
        <meta name="description" content="Shop Aura Elixir - India's trusted destination for premium inspired perfumes & luxury fragrances. Long-lasting EDP & EDT for men & women. Free shipping above ₹399. Starting ₹369 only." />
        <meta name="keywords" content="Aura Elixir, aura elixir perfumes, search elixir, elixir perfumes, luxury perfumes, premium fragrances, inspired perfumes, perfumes for men, perfumes for women, unisex perfumes, EDP perfume, EDT fragrance, buy perfumes online india, long lasting perfumes, best perfumes india, aura elixir price, Arabian Aromas, Bella Vita, Adil Qadri, Celestial, Ajmal, branded perfumes, best in class perfumes" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://auraelixir.co.in/" />
        <meta property="og:title" content="Aura Elixir - Premium Luxury Perfumes & Inspired Fragrances Online India" />
        <meta property="og:description" content="Shop Aura Elixir for premium inspired perfumes & luxury fragrances. Long-lasting EDP & EDT for men & women. Free shipping above ₹399." />
        <meta property="og:image" content="https://auraelixir.co.in/perfume-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Aura Elixir" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://auraelixir.co.in/" />
        <meta name="twitter:title" content="Aura Elixir - Premium Luxury Perfumes India" />
        <meta name="twitter:description" content="Shop Aura Elixir for premium inspired perfumes. Long-lasting fragrances for men & women. Free shipping above ₹399." />
        <meta name="twitter:image" content="https://auraelixir.co.in/perfume-logo.png" />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />
        <meta name="author" content="Aura Elixir" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />

        {/* Geo Tags */}
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Barshi, Maharashtra, India" />
        <meta name="geo.position" content="18.2346;75.6958" />
        <meta name="ICBM" content="18.2346, 75.6958" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://auraelixir.co.in/" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme Color */}
        <meta name="theme-color" content="#7c3aed" />
        <meta name="msapplication-TileColor" content="#7c3aed" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://auraelixir.co.in" />

        {/* Verification */}
        <meta name="google-site-verification" content="-8xZG3mirtcSKtuYwTfpcStCESWEpCA8VtoyzsU2DXE" />
        {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}

        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Structured Data - Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
