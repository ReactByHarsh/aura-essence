import { ProductDetail } from '@/components/pages/ProductDetail';
import { getProduct, getProducts } from '@/lib/neon/products';
import type { Product as AppProduct } from '@/types';
import type { Product as NeonProduct } from '@/lib/neon/products';
import type { Metadata } from 'next';

export const revalidate = 120; // Revalidate every 2 minutes

function neonToAppProduct(p: NeonProduct): AppProduct {
  const category = ((): AppProduct['category'] => {
    const v = (p.category || '').toLowerCase();
    return v === 'men' || v === 'women' || v === 'unisex' || v === 'solid' ? v : 'unisex';
  })();

  const type = ((): AppProduct['type'] => {
    const v = (p.type || '').toUpperCase();
    return v === 'EDP' || v === 'EDT' || v === 'EXTRAIT' || v === 'SOLID' ? (v === 'EXTRAIT' ? 'Extrait' : (v as any)) : 'EDP';
  })();

  const sillage = ((): AppProduct['sillage'] => {
    const v = (p.sillage || '').toLowerCase();
    return v === 'soft' || v === 'moderate' || v === 'strong' ? v : 'moderate';
  })();

  const notes = (() => {
    const n = (p as any).notes || {};
    return {
      top: Array.isArray(n.top) ? n.top : [],
      heart: Array.isArray(n.heart) ? n.heart : [],
      base: Array.isArray(n.base) ? n.base : [],
    };
  })();

  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    originalPrice: (p as any).original_price ?? undefined,
    images: p.images,
    category,
    type,
    notes,
    longevity: (p as any).longevity ?? 0,
    sillage,
    rating: p.rating,
    stock: p.stock,
    description: p.description,
    sizes: (p as any).sizes ?? {},
    isNew: (p as any).is_new ?? false,
    isBestSeller: (p as any).is_best_seller ?? false,
    isOnSale: (p as any).is_on_sale ?? false,
  };
}

// Generate dynamic metadata for each product page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found | Aura Elixir',
      description: 'The perfume you are looking for could not be found.',
    };
  }

  const productType = product.type || 'EDP';
  const category = product.category ? ` for ${product.category}` : '';
  const notes = (product as any).notes;
  const topNotes = notes?.top ? notes.top.join(', ') : '';
  
  return {
    title: `${product.name} ${productType} Perfume${category} - Aura Elixir | Buy Online`,
    description: `${product.description || `Buy ${product.name} ${productType} perfume${category} online at Aura Elixir.`} ${topNotes ? `Features notes of ${topNotes}.` : ''} Premium long-lasting fragrance with ${product.stock > 0 ? 'fast shipping' : 'limited availability'}. ₹${product.price}`,
    keywords: `${product.name}, ${product.brand}, ${productType} perfume, ${product.category} fragrance, buy perfume online, Aura Elixir, luxury perfume India, ${topNotes}`,
    openGraph: {
      title: `${product.name} ${productType} Perfume - Aura Elixir`,
      description: product.description || `Discover ${product.name} - a premium ${productType} fragrance from Aura Elixir`,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} ${productType} Perfume - Aura Elixir`,
      description: product.description || `Premium ${productType} fragrance from Aura Elixir`,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const neonProduct = await getProduct(params.id);

  let related: AppProduct[] = [];
  if (neonProduct) {
    try {
      const resp = await getProducts({ category: neonProduct.category }, 1, 4);
      const filtered = (resp.products || []).filter(p => p.id !== neonProduct.id).slice(0, 4);
      related = filtered.map(neonToAppProduct);
    } catch {
      related = [];
    }
  }

  const appProduct: AppProduct | null = neonProduct ? neonToAppProduct(neonProduct) : null;

  return (
    <>
      {/* Product Schema Structured Data */}
      {appProduct && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": appProduct.name,
              "brand": {
                "@type": "Brand",
                "name": appProduct.brand || "Aura Elixir"
              },
              "description": appProduct.description,
              "image": appProduct.images && appProduct.images.length > 0 ? appProduct.images : [],
              "offers": {
                "@type": "Offer",
                "url": `https://auraelixir.co.in/product/${appProduct.id}`,
                "priceCurrency": "INR",
                "price": appProduct.price,
                "availability": appProduct.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Aura Elixir"
                }
              },
              "aggregateRating": appProduct.rating ? {
                "@type": "AggregateRating",
                "ratingValue": appProduct.rating,
                "bestRating": "5",
                "worstRating": "1"
              } : undefined,
              "category": "Perfume & Fragrance"
            })
          }}
        />
      )}
      <ProductDetail
        initialProduct={appProduct}
        initialRelated={related}
        prefetched={!!neonProduct}
      />
    </>
  );
}