import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

// Call at the top of every admin page and server action.
export async function requireAdmin() {
  const db = await createClient();
  const { data } = await db.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email || !adminEmails().includes(email)) redirect("/admin/login");
  return email;
}

export function whatsappLink(number: string, text: string) {
  let digits = number.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("3")) digits = `57${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
