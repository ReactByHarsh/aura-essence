import React from 'react';
import { Terms } from '@/components/pages/Terms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Aura Elixir | Purchase Terms & Conditions',
  description: 'Review Aura Elixir\'s terms of service. Understand our policies for perfume purchases, returns, exchanges, and customer rights.',
};

export default function Page() {
  return <Terms />;
}