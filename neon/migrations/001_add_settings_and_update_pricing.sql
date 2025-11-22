-- Migration: Add site settings table and update product pricing
-- This migration adds a settings table for site-wide configuration
-- and updates product pricing to reflect new 20ml pricing

BEGIN;

-- Create settings table for site-wide configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert shipping configuration
INSERT INTO public.site_settings (key, value, description)
VALUES 
  ('shipping_config', 
   '{"free_shipping_threshold": 400, "standard_shipping_charge": 40, "currency": "INR"}'::jsonb,
   'Shipping configuration: free shipping threshold and standard shipping charge'),
  ('cod_charge',
   '{"amount": 49, "currency": "INR"}'::jsonb,
   'Cash on Delivery additional charge'),
  ('default_prices',
   '{"20ml": 269, "50ml": 499, "100ml": 699}'::jsonb,
   'Default product pricing by size in rupees')
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = now();

-- Update all existing products to have proper sizes pricing
UPDATE public.products
SET sizes = jsonb_build_object(
  '20ml', jsonb_build_object('price', 269, 'stock', stock),
  '50ml', jsonb_build_object('price', 499, 'stock', stock),
  '100ml', jsonb_build_object('price', 699, 'stock', stock)
)
WHERE sizes = '{}'::jsonb OR sizes IS NULL;

-- For products that already have sizes, update only the 20ml price if it exists
UPDATE public.products
SET sizes = jsonb_set(
  sizes,
  '{20ml,price}',
  '269'::jsonb,
  true
)
WHERE sizes ? '20ml' AND (sizes->'20ml'->>'price')::numeric != 269;

COMMIT;
