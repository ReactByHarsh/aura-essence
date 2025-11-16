import { Metadata } from 'next';
import { ShippingPolicy } from '@/components/pages/ShippingPolicy';

export const metadata: Metadata = {
  title: 'Shipping Policy | Aura Elixir',
  description: 'Learn about our shipping policy, delivery timeline, nationwide coverage, and tracking information at Aura Elixir.',
};

export default function ShippingPolicyPage() {
  return <ShippingPolicy />;
}
