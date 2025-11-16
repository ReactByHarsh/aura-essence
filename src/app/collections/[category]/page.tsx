import React from 'react';
import { Collections } from '@/components/pages/Collections';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = params.category;
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
  const descriptions: Record<string, string> = {
    men: 'Explore Aura Elixir\'s premium perfumes for men. Shop luxury EDP, EDT fragrances with woody, fresh, and spicy notes. Long-lasting scents for the modern gentleman.',
    women: 'Discover Aura Elixir\'s exquisite perfumes for women. Premium floral, oriental, and fresh fragrances. Elegant EDP and EDT collections with exceptional longevity.',
    unisex: 'Shop Aura Elixir\'s versatile unisex perfumes. Gender-neutral luxury fragrances for everyone. Premium EDP and EDT collections.',
  };

  const keywords: Record<string, string> = {
    men: 'perfumes for men, men\'s fragrances, luxury perfumes men, EDP for men, EDT men, woody perfumes, fresh fragrances men, spicy perfumes, long lasting perfumes men',
    women: 'perfumes for women, women\'s fragrances, luxury perfumes women, EDP for women, EDT women, floral perfumes, oriental fragrances, elegant perfumes, long lasting perfumes women',
    unisex: 'unisex perfumes, gender neutral fragrances, perfumes for everyone, unisex EDP, versatile fragrances',
  };

  return {
    title: `${categoryTitle} Perfumes & Fragrances - Aura Elixir | Premium ${categoryTitle} EDP & EDT`,
    description: descriptions[category] || `Shop premium ${categoryTitle} perfumes and fragrances at Aura Elixir. Luxury EDP and EDT collections online.`,
    keywords: keywords[category] || `${categoryTitle} perfumes, ${categoryTitle} fragrances, luxury perfumes`,
    openGraph: {
      title: `Premium ${categoryTitle} Perfumes - Aura Elixir`,
      description: descriptions[category] || `Discover luxury ${categoryTitle} fragrances`,
      type: 'website',
    },
  };
}

export default function Page() {
  return <Collections />;
}