import React from 'react';
import { Privacy } from '@/components/pages/Privacy';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Aura Elixir | Data Protection & Security',
  description: 'Read Aura Elixir\'s privacy policy. Learn how we protect your personal data and ensure secure online perfume shopping.',
};

export default function Page() {
  return <Privacy />;
}