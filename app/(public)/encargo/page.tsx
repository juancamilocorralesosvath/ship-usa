import CartForm from "@/components/CartForm";
import { upcomingTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function Encargo() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Mi encargo</h1>
      <CartForm trips={await upcomingTrips()} />
    </div>
  );
}
