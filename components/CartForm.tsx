"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCatalogOrder, type FormState } from "@/app/actions/orders";
import { removeFromCart, useCart } from "@/lib/cart";
import ContactFields, { type TripOption } from "./ContactFields";

export default function CartForm({ trips }: { trips: TripOption[] }) {
  const items = useCart();
  const [state, action, pending] = useActionState<FormState, FormData>(createCatalogOrder, {});

  if (items.length === 0) {
    return (
      <p>Tu encargo está vacío. <Link href="/catalogo" className="underline">Ver catálogo</Link></p>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <ul className="divide-y rounded-xl border">
        {items.map((i, idx) => (
          <li key={`${i.productId}-${i.variant ?? ""}`} className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium">{i.title}</p>
              <p className="text-zinc-500">
                x{i.quantity}{i.variant ? ` · ${i.variant}` : ""}{i.priceUsd != null ? ` · USD ${i.priceUsd}` : ""}
              </p>
            </div>
            <button type="button" onClick={() => removeFromCart(idx)} className="text-sm text-red-600">Quitar</button>
          </li>
        ))}
      </ul>
      <input type="hidden" name="items" value={JSON.stringify(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity, variant: i.variant })),
      )} />
      <ContactFields trips={trips} />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-black py-3 font-semibold text-white disabled:opacity-50">
        {pending ? "Enviando..." : "Enviar encargo"}
      </button>
      <p className="text-xs text-zinc-500">Te cotizamos por WhatsApp. No pagas nada ahora.</p>
    </form>
  );
}
