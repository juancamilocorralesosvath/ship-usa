export interface TripOption {
  id: string;
  traveler: string;
  departs_on: string;
  order_cutoff: string;
}

const input = "w-full rounded-lg border border-zinc-300 px-3 py-2 text-base";

export const travelerName = (t: string) => (t === "papa" ? "Papá" : "Juan Camilo");

export default function ContactFields({ trips }: { trips: TripOption[] }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 font-semibold">Tus datos</legend>
      <input name="customer_name" placeholder="Nombre" required className={input} />
      <input name="whatsapp" placeholder="WhatsApp (ej. 3001234567)" inputMode="tel" required className={input} />
      <input name="city" placeholder="Ciudad" required className={input} />
      {trips.length > 0 && (
        <select name="trip_id" defaultValue="" className={input}>
          <option value="">¿En qué viaje lo quieres? (opcional)</option>
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {travelerName(t.traveler)} — sale {t.departs_on}
            </option>
          ))}
        </select>
      )}
      <textarea name="notes" placeholder="Notas (opcional)" rows={2} className={input} />
      {/* honeypot: people never see this */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
    </fieldset>
  );
}
