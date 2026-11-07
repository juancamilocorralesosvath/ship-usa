"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CartLink() {
  const count = useCart().reduce((n, i) => n + i.quantity, 0);
  return (
    <Link href="/encargo" className="rounded-full bg-black px-3 py-1 text-sm text-white">
      Mi encargo{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
