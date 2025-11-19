-- Migration: Add multiple images to products (Neon Postgres)
-- This updates existing products to have 3 images each
-- Replace placeholder URLs with your actual image URLs

BEGIN;

-- Update products with 3 images each (text array format for Neon)
UPDATE public.products SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/azure-legend-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/azure-legend-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/azure-legend-3.png'
] WHERE name = 'Azure Legend';

UPDATE public.products SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/ocean-ember-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/ocean-ember-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/ocean-ember-3.png'
] WHERE name = 'Ocean Ember';

UPDATE public.products SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/bloom-aura-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/bloom-aura-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/bloom-aura-3.png'
] WHERE name = 'Bloom Aura';

UPDATE public.products SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/midnight-noir-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/midnight-noir-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/midnight-noir-3.png'
] WHERE name = 'Midnight Noir';

UPDATE public.products SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/wild-horizon-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/wild-horizon-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/wild-horizon-3.png'
] WHERE name = 'Wild Horizon';

-- Verify the changes
SELECT name, array_length(images, 1) as image_count, images 
FROM public.products 
ORDER BY name;

COMMIT;
