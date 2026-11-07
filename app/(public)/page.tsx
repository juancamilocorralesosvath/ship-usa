import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { travelerName } from "@/components/ContactFields";

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: trip } = await db
    .from("trips")
    .select("*")
    .gte("order_cutoff", today)
    .order("departs_on")
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-zinc-100 p-5">
        {trip ? (
          <>
            <p className="text-sm text-zinc-600">Próximo viaje · {travelerName(trip.traveler)}</p>
            <p className="text-xl font-semibold">Sale el {trip.departs_on}</p>
            <p>Encarga a más tardar el <strong>{trip.order_cutoff}</strong></p>
            {trip.notes && <p className="mt-1 text-sm text-zinc-600">{trip.notes}</p>}
          </>
        ) : (
          <p>Aún no hay un viaje programado. Puedes dejar tu encargo y te avisamos.</p>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/catalogo?categoria=ropa" className="rounded-2xl border p-6 text-center font-semibold">Ropa</Link>
        <Link href="/catalogo?categoria=tecnologia" className="rounded-2xl border p-6 text-center font-semibold">Tecnología</Link>
      </div>

      <Link href="/encargo-personalizado" className="block rounded-2xl bg-black p-4 text-center font-semibold text-white">
        No encuentro lo que busco
      </Link>
    </div>
  );
}
