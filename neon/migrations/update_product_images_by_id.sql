-- Quick Update: Replace common.png with 3 unique images per product
-- Run this in your Neon Postgres SQL console

BEGIN;

-- Update all products that currently have common.png to have 3 images
-- Replace these URLs with your actual hosted image URLs

UPDATE public.products 
SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/azure-legend-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/azure-legend-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/azure-legend-3.png'
]
WHERE id = '24f0b897-22e2-4d21-9b40-74fb5e20060e'; -- Azure Legend

UPDATE public.products 
SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/ocean-ember-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/ocean-ember-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/ocean-ember-3.png'
]
WHERE id = '36cfd14a-1b9d-429c-9127-1b1180a5293e'; -- Ocean Ember

UPDATE public.products 
SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/bloom-aura-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/bloom-aura-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/bloom-aura-3.png'
]
WHERE id = '4ab7a961-6781-4e71-a6f6-5614f73fe84b'; -- Bloom Aura

UPDATE public.products 
SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/midnight-noir-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/midnight-noir-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/midnight-noir-3.png'
]
WHERE id = '8bb26a07-3658-4de9-8ae9-2d071bd8be05'; -- Midnight Noir

UPDATE public.products 
SET images = ARRAY[
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/wild-horizon-1.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/wild-horizon-2.png',
  'https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/wild-horizon-3.png'
]
WHERE id = 'e1db11e6-710c-40c9-913e-b021344bd17b'; -- Wild Horizon

-- Verify all products now have 3 images
SELECT 
  name, 
  array_length(images, 1) as image_count,
  images[1] as image_1,
  images[2] as image_2,
  images[3] as image_3
FROM public.products 
ORDER BY name;

COMMIT;
