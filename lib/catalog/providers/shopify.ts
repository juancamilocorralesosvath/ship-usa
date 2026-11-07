import type { CatalogProvider, NormalizedProduct } from "../types";

interface ShopifyProduct {
  id: number;
  title: string;
  vendor?: string;
  handle: string;
  images?: { src: string }[];
  variants?: { price: string }[];
}

export async function fetchShopifyStore(
  domain: string,
  brandName: string,
): Promise<NormalizedProduct[]> {
  const res = await fetch(`https://${domain}/products.json?limit=250`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${domain}: HTTP ${res.status}`);
  const data = (await res.json()) as { products?: ShopifyProduct[] };
  if (!Array.isArray(data.products)) throw new Error(`${domain}: respuesta sin products`);

  return data.products.map((p) => ({
    source: `shopify:${domain}`,
    externalId: String(p.id),
    category: "ropa",
    title: p.title,
    brand: p.vendor || brandName,
    imageUrl: p.images?.[0]?.src ?? null,
    priceUsd: p.variants?.[0] ? Number(p.variants[0].price) : null,
    productUrl: `https://${domain}/products/${p.handle}`,
    isTrending: false,
  }));
}

export function shopifyProvider(domain: string, brandName: string): CatalogProvider {
  return { id: `shopify:${domain}`, fetchProducts: () => fetchShopifyStore(domain, brandName) };
}
