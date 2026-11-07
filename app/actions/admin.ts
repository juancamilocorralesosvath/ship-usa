"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminEmails, requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { syncCatalog } from "@/lib/catalog/sync";
import { fetchShopifyStore } from "@/lib/catalog/providers/shopify";

const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
};

export async function sendMagicLink(fd: FormData) {
  const email = s(fd, "email").toLowerCase();
  if (adminEmails().includes(email)) {
    const db = await createClient();
    await db.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    });
  }
  // Same response either way so the allowlist isn't revealed.
  redirect("/admin/login?sent=1");
}

export async function signOut() {
  const db = await createClient();
  await db.auth.signOut();
  redirect("/admin/login");
}

export async function updateOrder(fd: FormData) {
  await requireAdmin();
  const total = s(fd, "quoted_total_cop");
  await createAdminClient()
    .from("orders")
    .update({ status: s(fd, "status"), quoted_total_cop: total ? Number(total) : null })
    .eq("id", s(fd, "id"));
  revalidatePath("/admin", "layout");
}

export async function saveTrip(fd: FormData) {
  await requireAdmin();
  await createAdminClient().from("trips").insert({
    traveler: s(fd, "traveler"),
    departs_on: s(fd, "departs_on"),
    returns_on: s(fd, "returns_on") || null,
    order_cutoff: s(fd, "order_cutoff"),
    notes: s(fd, "notes") || null,
    published: fd.get("published") === "on",
  });
  revalidatePath("/admin/viajes");
}

export async function toggleTrip(fd: FormData) {
  await requireAdmin();
  await createAdminClient().from("trips")
    .update({ published: s(fd, "published") !== "true" }).eq("id", s(fd, "id"));
  revalidatePath("/admin/viajes");
}

export async function createProduct(fd: FormData) {
  await requireAdmin();
  const price = s(fd, "price_usd");
  await createAdminClient().from("products").insert({
    source: "manual",
    external_id: crypto.randomUUID(),
    category: s(fd, "category"),
    title: s(fd, "title"),
    brand: s(fd, "brand") || null,
    image_url: s(fd, "image_url") || null,
    price_usd: price ? Number(price) : null,
    product_url: s(fd, "product_url") || null,
  });
  revalidatePath("/admin/productos");
}

export async function toggleProduct(fd: FormData) {
  await requireAdmin();
  await createAdminClient().from("products")
    .update({ active: s(fd, "active") !== "true" }).eq("id", s(fd, "id"));
  revalidatePath("/admin/productos");
}

export async function addSource(fd: FormData) {
  await requireAdmin();
  const domain = s(fd, "domain").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  await createAdminClient().from("catalog_sources")
    .insert({ domain, brand_name: s(fd, "brand_name") || domain });
  revalidatePath("/admin/productos");
}

// A store is only enabled after its products.json answers correctly.
export async function testSource(fd: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = s(fd, "id");
  const { data: src } = await db.from("catalog_sources").select("*").eq("id", id).single();
  if (src) {
    try {
      const items = await fetchShopifyStore(src.domain, src.brand_name);
      await db.from("catalog_sources")
        .update({ enabled: true, last_sync_status: `prueba ok (${items.length})` }).eq("id", id);
    } catch (e) {
      await db.from("catalog_sources").update({
        enabled: false,
        last_sync_status: `error: ${e instanceof Error ? e.message : e}`,
      }).eq("id", id);
    }
  }
  revalidatePath("/admin/productos");
}

export async function toggleSource(fd: FormData) {
  await requireAdmin();
  await createAdminClient().from("catalog_sources")
    .update({ enabled: s(fd, "enabled") !== "true" }).eq("id", s(fd, "id"));
  revalidatePath("/admin/productos");
}

export async function syncNow() {
  await requireAdmin();
  await syncCatalog();
  revalidatePath("/admin/productos");
}
