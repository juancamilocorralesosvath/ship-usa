import { createClient } from "@/lib/supabase/server";
import type { TripOption } from "@/components/ContactFields";

export async function upcomingTrips(): Promise<TripOption[]> {
  const db = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await db
    .from("trips")
    .select("id,traveler,departs_on,order_cutoff")
    .gte("order_cutoff", today)
    .order("departs_on");
  return data ?? [];
}
