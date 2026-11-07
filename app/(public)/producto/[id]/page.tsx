import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCart from "@/components/AddToCart";

export const dynamic = "force-dynamic";

export default async function Producto({ params }: PageProps<"/producto/[id]">) {
  const { id } = await params;
  const db = await createClient();
  const { data: p } = await db.from("products").select("*").eq("id", id).maybeSingle();
  if (!p) notFound();

  return (
    <div className="space-y-4">
      {p.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image_url} alt={p.title} className="w-full rounded-xl" />
      )}
      <div>
        <p className="text-sm text-zinc-500">{p.brand}</p>
        <h1 className="text-xl font-semibold">{p.title}</h1>
        {p.price_usd != null && (
          <p className="mt-1">Precio en EE. UU.: <strong>USD {p.price_usd}</strong> · el precio final te lo cotizamos</p>
        )}
      </div>
      <AddToCart item={{ productId: p.id, title: p.title, imageUrl: p.image_url, priceUsd: p.price_usd }} />
    </div>
  );
}
