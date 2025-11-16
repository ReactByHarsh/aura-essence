import { Metadata } from 'next';
import { ShippingPolicy } from '@/components/pages/ShippingPolicy';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy - Aura Elixir | Fast Nationwide Delivery',
  description: 'Aura Elixir shipping policy. Fast perfume delivery across India in 3-6 business days. Secure packaging, nationwide coverage, real-time tracking.',
  keywords: 'perfume delivery India, fast perfume shipping, nationwide perfume delivery, Aura Elixir shipping',
};

export default function ShippingPolicyPage() {
  return <ShippingPolicy />;
}
