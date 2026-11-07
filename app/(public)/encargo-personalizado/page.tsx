import CustomRequestForm from "@/components/CustomRequestForm";
import { upcomingTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function EncargoPersonalizado() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">No encuentro lo que busco</h1>
      <p className="text-sm text-zinc-600">Cuéntanos qué necesitas y lo cotizamos.</p>
      <CustomRequestForm trips={await upcomingTrips()} />
    </div>
  );
}
