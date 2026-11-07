"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewOrder } from "@/lib/notify/email";

export interface FormState {
  error?: string;
}

const contact = {
  customer_name: z.string().trim().min(2, "Escribe tu nombre").max(80),
  whatsapp: z.string().trim().regex(/^\+?[\d\s-]{7,16}$/, "WhatsApp inválido"),
  city: z.string().trim().min(2, "Escribe tu ciudad").max(60),
  notes: z.string().trim().max(500).optional(),
  trip_id: z.string().uuid().optional().or(z.literal("")),
};

const cartSchema = z.array(
  z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(20),
    variant: z.string().max(80).optional(),
  }),
).min(1, "Tu encargo está vacío").max(30);

const customSchema = z.object({
  ...contact,
  product_name: z.string().trim().min(2, "Dinos qué producto buscas").max(120),
  brand: z.string().trim().max(80).optional(),
  reference: z.string().trim().max(80).optional(),
  variant: z.string().trim().max(120).optional(),
  link: z.string().trim().url("Link inválido").optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional(),
  quantity: z.coerce.number().int().min(1).max(20),
  budget_cop: z.coerce.number().int().min(0).optional().or(z.literal("")),
});

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode = () =>
  Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");

function str(fd: FormData, k: string) {
  const v = fd.get(k);
  return typeof v === "string" && v !== "" ? v : undefined;
}

async function insertOrder(
  base: { customer_name: string; whatsapp: string; city: string; notes?: string; trip_id?: string },
) {
  const db = createAdminClient();
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    const { data, error } = await db
      .from("orders")
      .insert({ ...base, trip_id: base.trip_id || null, code })
      .select("id, code")
      .single();
    if (!error) return data;
    if (error.code !== "23505") throw new Error(error.message);
  }
  throw new Error("No se pudo generar el código del pedido");
}

export async function createCatalogOrder(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "website")) redirect("/"); // honeypot

  const parsed = z.object(contact).safeParse({
    customer_name: str(fd, "customer_name"),
    whatsapp: str(fd, "whatsapp"),
    city: str(fd, "city"),
    notes: str(fd, "notes"),
    trip_id: str(fd, "trip_id"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let items;
  try {
    items = cartSchema.parse(JSON.parse(str(fd, "items") ?? "[]"));
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0].message : "Encargo inválido" };
  }

  const order = await insertOrder(parsed.data);
  const db = createAdminClient();
  const { error } = await db.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      quantity: i.quantity,
      variant: i.variant || null,
    })),
  );
  if (error) return { error: "No pudimos guardar tu encargo, intenta de nuevo" };

  await notifyNewOrder(
    `Nuevo encargo ${order.code}`,
    `${parsed.data.customer_name} (${parsed.data.city}) — WhatsApp ${parsed.data.whatsapp}\n${items.length} producto(s).`,
  );
  redirect(`/encargo/${order.code}/gracias`);
}

const MAX_PHOTOS = 3;
const MAX_BYTES = 5 * 1024 * 1024;

export async function createCustomRequest(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "website")) redirect("/"); // honeypot

  const parsed = customSchema.safeParse(
    Object.fromEntries(
      ["customer_name", "whatsapp", "city", "notes", "trip_id", "product_name", "brand",
        "reference", "variant", "link", "description", "quantity", "budget_cop"]
        .map((k) => [k, str(fd, k)]),
    ),
  );
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const photos = fd.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (photos.length > MAX_PHOTOS) return { error: `Máximo ${MAX_PHOTOS} fotos` };
  for (const p of photos) {
    if (!p.type.startsWith("image/")) return { error: "Solo se permiten imágenes" };
    if (p.size > MAX_BYTES) return { error: "Cada foto debe pesar menos de 5 MB" };
  }

  const d = parsed.data;
  const order = await insertOrder({
    customer_name: d.customer_name,
    whatsapp: d.whatsapp,
    city: d.city,
    notes: d.notes,
    trip_id: d.trip_id || undefined,
  });
  const db = createAdminClient();

  const paths: string[] = [];
  for (const [i, file] of photos.entries()) {
    const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").slice(0, 5) || "jpg";
    const path = `${order.id}/${i}-${Date.now()}.${ext}`;
    const { error } = await db.storage.from("request-photos").upload(path, file, {
      contentType: file.type,
    });
    if (!error) paths.push(path);
  }

  const { error } = await db.from("custom_requests").insert({
    order_id: order.id,
    product_name: d.product_name,
    brand: d.brand || null,
    reference: d.reference || null,
    variant: d.variant || null,
    link: d.link || null,
    description: d.description || null,
    quantity: d.quantity,
    budget_cop: d.budget_cop === "" ? null : (d.budget_cop ?? null),
    photo_paths: paths,
    channel: "form",
  });
  if (error) return { error: "No pudimos guardar tu solicitud, intenta de nuevo" };

  await notifyNewOrder(
    `Nuevo encargo personalizado ${order.code}`,
    `${d.customer_name} (${d.city}) — WhatsApp ${d.whatsapp}\nBusca: ${d.product_name}`,
  );
  redirect(`/encargo/${order.code}/gracias`);
}
