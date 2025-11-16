import React from 'react';
import { About } from '@/components/pages/About';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Aura Elixir - Premium Luxury Perfume Brand | Our Story',
  description: 'Learn about Aura Elixir - a luxury fragrance brand dedicated to crafting exceptional, high-quality perfumes. Discover our commitment to quality, craftsmanship, and timeless elegance.',
  keywords: 'about Aura Elixir, luxury perfume brand, premium fragrances, perfume craftsmanship, Indian perfume brand',
};

export default function Page() {
  return <About />;
}