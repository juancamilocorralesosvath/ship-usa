import { createAdminClient } from "@/lib/supabase/admin";
import { saveTrip, toggleTrip } from "@/app/actions/admin";
import { travelerName } from "@/components/ContactFields";

export const dynamic = "force-dynamic";

const input = "rounded-lg border px-2 py-1";

export default async function Viajes() {
  const { data: trips } = await createAdminClient().from("trips").select("*").order("departs_on", { ascending: false });
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Viajes</h1>
      <form action={saveTrip} className="grid gap-3 rounded-xl border p-3 sm:grid-cols-2">
        <select name="traveler" className={input}><option value="juan_camilo">Juan Camilo</option><option value="papa">Papá</option></select>
        <label className="text-sm">Sale <input name="departs_on" type="date" required className={input} /></label>
        <label className="text-sm">Regresa <input name="returns_on" type="date" className={input} /></label>
        <label className="text-sm">Fecha límite <input name="order_cutoff" type="date" required className={input} /></label>
        <input name="notes" placeholder="Notas" className={`${input} sm:col-span-2`} />
        <label className="text-sm"><input name="published" type="checkbox" /> Publicado</label>
        <button className="rounded-lg bg-black px-3 py-1 text-white">Crear viaje</button>
      </form>
      <ul className="divide-y rounded-xl border">
        {trips?.map((t) => (
          <li key={t.id} className="flex items-center justify-between p-3 text-sm">
            <span>{travelerName(t.traveler)} · {t.departs_on} · límite {t.order_cutoff}</span>
            <form action={toggleTrip}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="published" value={String(t.published)} />
              <button className="underline">{t.published ? "Despublicar" : "Publicar"}</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
