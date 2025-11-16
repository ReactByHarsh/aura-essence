import React from 'react';
import { Contact } from '@/components/pages/Contact';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Aura Elixir | Customer Support & Inquiries',
  description: 'Get in touch with Aura Elixir. Contact us for perfume inquiries, orders, or customer support. Email: help@auraelixir.co.in | Phone: +91 9028709575',
  keywords: 'contact Aura Elixir, perfume customer support, buy perfumes India, fragrance inquiries',
};

export default function Page() {
  return <Contact />;
}