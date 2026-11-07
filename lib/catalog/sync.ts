import { createAdminClient } from "@/lib/supabase/admin";
import { bestBuyProvider } from "./providers/bestbuy";
import { shopifyProvider } from "./providers/shopify";
import type { CatalogProvider, NormalizedProduct } from "./types";

async function upsert(products: NormalizedProduct[]) {
  const db = createAdminClient();
  const rows = products.map((p) => ({
    source: p.source,
    external_id: p.externalId,
    category: p.category,
    title: p.title,
    brand: p.brand,
    image_url: p.imageUrl,
    price_usd: p.priceUsd,
    product_url: p.productUrl,
    is_trending: p.isTrending,
    synced_at: new Date().toISOString(),
  }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db
      .from("products")
      .upsert(rows.slice(i, i + 500), { onConflict: "source,external_id" });
    if (error) throw new Error(error.message);
  }
}

export interface SyncResult {
  provider: string;
  count?: number;
  error?: string;
}

export async function syncCatalog(): Promise<SyncResult[]> {
  const db = createAdminClient();
  const results: SyncResult[] = [];

  const providers: CatalogProvider[] = [];
  if (process.env.BESTBUY_API_KEY) providers.push(bestBuyProvider);

  const { data: sources } = await db.from("catalog_sources").select("*").eq("enabled", true);
  for (const s of sources ?? []) providers.push(shopifyProvider(s.domain, s.brand_name));

  for (const provider of providers) {
    try {
      const products = await provider.fetchProducts();
      await upsert(products);
      results.push({ provider: provider.id, count: products.length });
      if (provider.id.startsWith("shopify:")) {
        await db.from("catalog_sources").update({ last_sync_status: `ok (${products.length})` })
          .eq("domain", provider.id.slice("shopify:".length));
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      results.push({ provider: provider.id, error });
      if (provider.id.startsWith("shopify:")) {
        await db.from("catalog_sources").update({ last_sync_status: `error: ${error}` })
          .eq("domain", provider.id.slice("shopify:".length));
      }
    }
  }
  return results;
}
