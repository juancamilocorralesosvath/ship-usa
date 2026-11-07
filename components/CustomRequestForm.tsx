"use client";

import { useActionState } from "react";
import { createCustomRequest, type FormState } from "@/app/actions/orders";
import ContactFields, { type TripOption } from "./ContactFields";

const input = "w-full rounded-lg border border-zinc-300 px-3 py-2 text-base";

export default function CustomRequestForm({ trips }: { trips: TripOption[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createCustomRequest, {});
  return (
    <form action={action} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="mb-1 font-semibold">¿Qué buscas?</legend>
        <input name="product_name" placeholder="Nombre del producto" required className={input} />
        <input name="brand" placeholder="Marca" className={input} />
        <input name="reference" placeholder="Referencia / modelo" className={input} />
        <input name="variant" placeholder="Talla, color, capacidad..." className={input} />
        <input name="link" type="url" placeholder="Link (opcional)" className={input} />
        <textarea name="description" placeholder="Descripción" rows={3} className={input} />
        <div className="flex gap-3">
          <input name="quantity" type="number" min={1} max={20} defaultValue={1} className={`${input} w-24`} />
          <input name="budget_cop" type="number" min={0} placeholder="Presupuesto COP (opcional)" className={input} />
        </div>
        <label className="block text-sm">
          Fotos (hasta 3)
          <input name="photos" type="file" accept="image/*" multiple className="mt-1 block w-full" />
        </label>
      </fieldset>
      <ContactFields trips={trips} />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-black py-3 font-semibold text-white disabled:opacity-50">
        {pending ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
}
