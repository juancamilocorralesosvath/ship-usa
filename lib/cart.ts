"use client";

import { useSyncExternalStore } from "react";

export interface CartItem {
  productId: string;
  title: string;
  imageUrl: string | null;
  priceUsd: number | null;
  quantity: number;
  variant?: string;
}

const KEY = "encargo-cart";
const listeners = new Set<() => void>();
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: [] };
const EMPTY: CartItem[] = [];

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw !== cache.raw) cache = { raw, items: raw ? (JSON.parse(raw) as CartItem[]) : [] };
    return cache.items;
  } catch {
    return EMPTY;
  }
}

function write(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  listeners.forEach((l) => l());
}

export function addToCart(item: CartItem) {
  const items = read();
  const same = items.find((i) => i.productId === item.productId && i.variant === item.variant);
  write(
    same
      ? items.map((i) => (i === same ? { ...i, quantity: i.quantity + item.quantity } : i))
      : [...items, item],
  );
}

export function removeFromCart(index: number) {
  write(read().filter((_, i) => i !== index));
}

export function clearCart() {
  write([]);
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      window.addEventListener("storage", cb);
      return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", cb);
      };
    },
    read,
    () => EMPTY,
  );
}
