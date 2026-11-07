import type { CatalogProvider, NormalizedProduct } from "../types";

// Best Buy "Recommendations" API: trending products per category.
// Verify auth format and non-commercial terms at developer.bestbuy.com.
const CATEGORIES: { id: string; label: string }[] = [
  { id: "abcat0502000", label: "Laptops" },
  { id: "abcat0204000", label: "Headphones" },
  { id: "abcat0400000", label: "Cameras" },
  { id: "abcat0700000", label: "Video games" },
  { id: "abcat0101000", label: "TVs" },
];

interface BestBuyRecommendation {
  sku: number;
  names?: { title?: string };
  manufacturer?: string;
  images?: { standard?: string };
  prices?: { current?: number };
  links?: { web?: string };
}

export const bestBuyProvider: CatalogProvider = {
  id: "bestbuy",
  async fetchProducts() {
    const key = process.env.BESTBUY_API_KEY;
    if (!key) throw new Error("BESTBUY_API_KEY no configurada");

    const out: NormalizedProduct[] = [];
    for (const cat of CATEGORIES) {
      const url = `https://api.bestbuy.com/v1/products/trendingViewed(categoryId=${cat.id})?apiKey=${key}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Best Buy ${cat.label}: HTTP ${res.status}`);
      const data = (await res.json()) as { results?: BestBuyRecommendation[] };
      for (const r of data.results ?? []) {
        out.push({
          source: "bestbuy",
          externalId: String(r.sku),
          category: "tecnologia",
          title: r.names?.title ?? `SKU ${r.sku}`,
          brand: r.manufacturer ?? null,
          imageUrl: r.images?.standard ?? null,
          priceUsd: r.prices?.current ?? null,
          productUrl: r.links?.web ?? null,
          isTrending: true,
        });
      }
    }
    return out;
  },
};
