import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function Pedidos() {
  const { data: orders } = await createAdminClient()
    .from("orders").select("*").order("created_at", { ascending: false }).limit(100);
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Pedidos</h1>
      {orders?.length ? (
        <ul className="divide-y rounded-xl border">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/admin/pedidos/${o.id}`} className="flex items-center justify-between p-3">
                <span><strong>{o.code}</strong> · {o.customer_name} · {o.city}</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{o.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aún no hay pedidos.</p>
      )}
    </div>
  );
}
