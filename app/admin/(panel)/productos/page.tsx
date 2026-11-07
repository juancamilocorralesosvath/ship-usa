import { createAdminClient } from "@/lib/supabase/admin";
import { addSource, createProduct, syncNow, testSource, toggleProduct, toggleSource } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

const input = "rounded-lg border px-2 py-1";

export default async function Productos() {
  const db = createAdminClient();
  const [{ data: sources }, { data: products }] = await Promise.all([
    db.from("catalog_sources").select("*").order("domain"),
    db.from("products").select("id,title,brand,source,active").order("synced_at", { ascending: false }).limit(100),
  ]);
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Fuentes Shopify</h1>
          <form action={syncNow}><button className="rounded-lg bg-black px-3 py-1 text-white">Sincronizar ahora</button></form>
        </div>
        <form action={addSource} className="flex gap-2">
          <input name="domain" placeholder="tienda.com" required className={`${input} flex-1`} />
          <input name="brand_name" placeholder="Marca" className={input} />
          <button className="rounded-lg border px-3 py-1">Agregar</button>
        </form>
        <ul className="divide-y rounded-xl border">
          {sources?.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-2 p-3 text-sm">
              <span>{s.domain} · {s.enabled ? "activa" : "inactiva"} · {s.last_sync_status ?? "sin probar"}</span>
              <span className="flex gap-3">
                <form action={testSource}><input type="hidden" name="id" value={s.id} /><button className="underline">Probar y activar</button></form>
                <form action={toggleSource}>
                  <input type="hidden" name="id" value={s.id} /><input type="hidden" name="enabled" value={String(s.enabled)} />
                  <button className="underline">{s.enabled ? "Desactivar" : "Activar"}</button>
                </form>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Producto manual</h2>
        <form action={createProduct} className="grid gap-3 rounded-xl border p-3 sm:grid-cols-2">
          <input name="title" placeholder="Título" required className={input} />
          <input name="brand" placeholder="Marca" className={input} />
          <select name="category" className={input}><option value="ropa">Ropa</option><option value="tecnologia">Tecnología</option></select>
          <input name="price_usd" type="number" step="0.01" placeholder="Precio USD" className={input} />
          <input name="image_url" placeholder="URL de imagen" className={input} />
          <input name="product_url" placeholder="URL del producto" className={input} />
          <button className="rounded-lg bg-black px-3 py-1 text-white sm:col-span-2">Crear</button>
        </form>
        <ul className="divide-y rounded-xl border">
          {products?.map((p) => (
            <li key={p.id} className="flex items-center justify-between p-3 text-sm">
              <span className="truncate">{p.title} <span className="text-zinc-500">· {p.brand} · {p.source}</span></span>
              <form action={toggleProduct}>
                <input type="hidden" name="id" value={p.id} /><input type="hidden" name="active" value={String(p.active)} />
                <button className="underline">{p.active ? "Desactivar" : "Activar"}</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
