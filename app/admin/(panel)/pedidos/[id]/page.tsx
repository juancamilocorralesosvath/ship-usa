import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateOrder } from "@/app/actions/admin";
import { whatsappLink } from "@/lib/admin";

export const dynamic = "force-dynamic";

const STATUSES = ["nuevo", "cotizado", "confirmado", "comprado", "en_camino", "entregado", "cancelado"];

export default async function Pedido({ params }: PageProps<"/admin/pedidos/[id]">) {
  const { id } = await params;
  const db = createAdminClient();
  const { data: order } = await db.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();

  const [{ data: items }, { data: custom }] = await Promise.all([
    db.from("order_items").select("*, products(title, brand, price_usd, product_url)").eq("order_id", id),
    db.from("custom_requests").select("*").eq("order_id", id),
  ]);

  const photos = await Promise.all(
    (custom ?? []).flatMap((c) => c.photo_paths).map(async (path) => {
      const { data } = await db.storage.from("request-photos").createSignedUrl(path, 3600);
      return data?.signedUrl;
    }),
  );

  const wa = whatsappLink(
    order.whatsapp,
    `Hola ${order.customer_name}, soy de Encargos USA. Sobre tu pedido ${order.code}: `
      + (order.quoted_total_cop ? `el total cotizado es $${order.quoted_total_cop.toLocaleString("es-CO")} COP.` : ""),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Pedido {order.code}</h1>
        <p>{order.customer_name} · {order.city} · {order.whatsapp}</p>
        {order.notes && <p className="text-sm text-zinc-600">{order.notes}</p>}
        <a href={wa} target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-lg bg-green-600 px-3 py-1 text-white">
          WhatsApp
        </a>
      </div>

      <form action={updateOrder} className="flex flex-wrap items-end gap-3 rounded-xl border p-3">
        <input type="hidden" name="id" value={order.id} />
        <label className="text-sm">Estado
          <select name="status" defaultValue={order.status} className="block rounded-lg border px-2 py-1">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-sm">Total cotizado (COP)
          <input name="quoted_total_cop" type="number" defaultValue={order.quoted_total_cop ?? ""}
            className="block rounded-lg border px-2 py-1" />
        </label>
        <button className="rounded-lg bg-black px-3 py-1 text-white">Guardar</button>
      </form>

      {items && items.length > 0 && (
        <section>
          <h2 className="font-semibold">Productos</h2>
          <ul className="divide-y rounded-xl border">
            {items.map((i) => (
              <li key={i.id} className="p-3 text-sm">
                x{i.quantity} {i.products?.title}{i.variant ? ` · ${i.variant}` : ""}
                {i.products?.price_usd != null && ` · USD ${i.products.price_usd}`}
                {i.products?.product_url && (
                  <> · <a href={i.products.product_url} target="_blank" rel="noreferrer" className="underline">link</a></>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {custom?.map((c) => (
        <section key={c.id} className="space-y-1 rounded-xl border p-3 text-sm">
          <h2 className="font-semibold">{c.product_name} (x{c.quantity})</h2>
          <p>{[c.brand, c.reference, c.variant].filter(Boolean).join(" · ")}</p>
          {c.description && <p>{c.description}</p>}
          {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="underline">{c.link}</a>}
          {c.budget_cop != null && <p>Presupuesto: ${c.budget_cop.toLocaleString("es-CO")} COP</p>}
        </section>
      ))}

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((url, i) => url && (
            // eslint-disable-next-line @next/next/no-img-element
            <a key={i} href={url} target="_blank" rel="noreferrer"><img src={url} alt="" className="h-32 rounded-lg" /></a>
          ))}
        </div>
      )}
    </div>
  );
}
