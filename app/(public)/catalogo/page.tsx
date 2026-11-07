import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Catalogo({ searchParams }: PageProps<"/catalogo">) {
  const sp = await searchParams;
  const categoria = typeof sp.categoria === "string" ? sp.categoria : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const db = await createClient();
  let query = db.from("products").select("id,title,brand,image_url,price_usd,is_trending")
    .order("is_trending", { ascending: false }).order("synced_at", { ascending: false }).limit(60);
  if (categoria === "ropa" || categoria === "tecnologia") query = query.eq("category", categoria);
  if (q) query = query.ilike("title", `%${q.replace(/[%,]/g, " ")}%`);
  const { data: products } = await query;

  return (
    <div className="space-y-4">
      <form className="flex gap-2">
        <select name="categoria" defaultValue={categoria} className="rounded-lg border px-2 py-2">
          <option value="">Todo</option>
          <option value="ropa">Ropa</option>
          <option value="tecnologia">Tecnología</option>
        </select>
        <input name="q" defaultValue={q} placeholder="Buscar" className="min-w-0 flex-1 rounded-lg border px-3 py-2" />
        <button className="rounded-lg bg-black px-4 text-white">Buscar</button>
      </form>

      {products?.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/producto/${p.id}`} className="overflow-hidden rounded-xl border">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.title} className="aspect-square w-full object-cover" />
              ) : (
                <div className="aspect-square bg-zinc-100" />
              )}
              <div className="p-2 text-sm">
                <p className="text-xs text-zinc-500">{p.brand}</p>
                <p className="line-clamp-2 font-medium">{p.title}</p>
                {p.price_usd != null && <p>USD {p.price_usd}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-zinc-600">No encontramos productos. Prueba “No encuentro lo que busco”.</p>
      )}
    </div>
  );
}
