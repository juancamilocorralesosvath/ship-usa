import { Resend } from "resend";

export async function notifyNewOrder(subject: string, body: string) {
  const to = (process.env.NOTIFY_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const key = process.env.RESEND_API_KEY;
  if (!key || to.length === 0) {
    console.log(`[email no enviado] ${subject}\n${body}`);
    return;
  }
  try {
    await new Resend(key).emails.send({
      from: "Encargos <onboarding@resend.dev>",
      to,
      subject,
      text: body,
    });
  } catch (e) {
    console.error("Resend falló", e);
  }
}
