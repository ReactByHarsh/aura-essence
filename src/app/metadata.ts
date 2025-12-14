import type { Metadata } from 'next';

const baseUrl = 'https://auraelixir.co.in';

export const siteMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Aura Elixir - Premium Luxury Perfumes & Inspired Fragrances Online India',
    template: '%s | Aura Elixir',
  },
  description: 'Shop Aura Elixir - India\'s trusted destination for premium inspired perfumes and luxury fragrances. Discover long-lasting EDP & EDT for men & women. Free shipping on orders above ₹399. Best perfume combos starting ₹369.',
  keywords: [
    'Aura Elixir',
    'aura elixir perfumes',
    'search elixir',
    'elixir perfumes',
    'aura elixir india',
    'luxury perfumes india',
    'inspired perfumes',
    'premium fragrances',
    'perfumes for men',
    'perfumes for women',
    'unisex perfumes',
    'EDP perfumes',
    'EDT fragrances',
    'long lasting perfume',
    'buy perfume online india',
    'best perfumes india',
    'affordable luxury perfumes',
    'designer inspired fragrances',
    'perfume combos',
    'gift perfumes',
    'niche perfumes india',
    'aura elixir perfume price',
    'Arabian Aromas',
    'Bella Vita',
    'Adil Qadri',
    'Celestial',
    'Ajmal',
  ],
  authors: [{ name: 'Aura Elixir', url: baseUrl }],
  creator: 'Aura Elixir',
  publisher: 'Aura Elixir',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: baseUrl,
    siteName: 'Aura Elixir',
    title: 'Aura Elixir - Premium Luxury Perfumes & Fragrances Online India',
    description: 'Shop Aura Elixir for premium inspired perfumes and luxury fragrances. Long-lasting EDP & EDT for men, women & unisex. Free shipping on orders above ₹399.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Aura Elixir - Premium Luxury Perfumes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Elixir - Premium Luxury Perfumes India',
    description: 'Discover Aura Elixir\'s collection of luxury inspired perfumes. Long-lasting fragrances for men & women. Free shipping above ₹399.',
    images: [`${baseUrl}/og-image.png`],
    creator: '@auraelixir',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    google: '-8xZG3mirtcSKtuYwTfpcStCESWEpCA8VtoyzsU2DXE',
    // yandex: 'your-yandex-verification-code',
  },
  category: 'shopping',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

// Structured Data Schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'Aura Elixir',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/perfume-logo.png`,
    width: 512,
    height: 512,
  },
  description: 'Aura Elixir - India\'s premium destination for luxury inspired perfumes and fragrances for men, women, and unisex preferences.',
  foundingDate: '2024',
  founders: [
    {
      '@type': 'Person',
      name: 'Aura Elixir Team',
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-9028709575',
      contactType: 'customer service',
      email: 'help@auraelixir.co.in',
      availableLanguage: ['English', 'Hindi', 'Marathi'],
      areaServed: 'IN',
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Balaji Colony',
    addressLocality: 'Barshi',
    addressRegion: 'Maharashtra',
    postalCode: '413401',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.instagram.com/auraelixir.in',
    'https://www.facebook.com/auraelixir',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  url: baseUrl,
  name: 'Aura Elixir',
  description: 'Premium luxury perfumes and inspired fragrances online in India',
  publisher: {
    '@id': `${baseUrl}/#organization`,
  },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
  inLanguage: 'en-IN',
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': `${baseUrl}/#store`,
  name: 'Aura Elixir',
  image: `${baseUrl}/perfume-logo.png`,
  priceRange: '₹₹',
  telephone: '+91-9028709575',
  email: 'help@auraelixir.co.in',
  url: baseUrl,
  description: 'Premium luxury inspired perfumes and fragrances store in India. Shop best quality EDP and EDT perfumes for men, women and unisex.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Balaji Colony',
    addressLocality: 'Barshi',
    addressRegion: 'Maharashtra',
    postalCode: '413401',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '18.2346',
    longitude: '75.6958',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:30',
      closes: '18:00',
    },
  ],
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, PhonePe',
  currenciesAccepted: 'INR',
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
