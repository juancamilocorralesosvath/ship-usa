"use client";

import { useState } from "react";
import Link from "next/link";
import { addToCart, type CartItem } from "@/lib/cart";

export default function AddToCart({ item }: { item: Omit<CartItem, "quantity" | "variant"> }) {
  const [variant, setVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-3">
      <input value={variant} onChange={(e) => setVariant(e.target.value)}
        placeholder="Talla / color / variante" className="w-full rounded-lg border px-3 py-2" />
      <input type="number" min={1} max={20} value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
        className="w-24 rounded-lg border px-3 py-2" />
      <button
        onClick={() => { addToCart({ ...item, quantity, variant: variant.trim() || undefined }); setAdded(true); }}
        className="block w-full rounded-lg bg-black py-3 font-semibold text-white">
        Agregar al encargo
      </button>
      {added && <p className="text-sm">Agregado. <Link href="/encargo" className="underline">Ver mi encargo</Link></p>}
    </div>
  );
}
