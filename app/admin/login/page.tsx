import { sendMagicLink } from "@/app/actions/admin";

export default async function Login({ searchParams }: PageProps<"/admin/login">) {
  const sent = (await searchParams).sent;
  return (
    <main className="mx-auto w-full max-w-sm flex-1 space-y-4 px-4 py-16">
      <h1 className="text-xl font-semibold">Panel de encargos</h1>
      {sent ? (
        <p>Si tu correo está autorizado, te enviamos un enlace de acceso.</p>
      ) : (
        <form action={sendMagicLink} className="space-y-3">
          <input name="email" type="email" required placeholder="Correo" className="w-full rounded-lg border px-3 py-2" />
          <button className="w-full rounded-lg bg-black py-2 text-white">Enviar enlace</button>
        </form>
      )}
    </main>
  );
}
