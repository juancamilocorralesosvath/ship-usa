import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "@/app/actions/admin";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <>
      <nav className="flex items-center gap-4 border-b px-4 py-3 text-sm">
        <Link href="/admin" className="font-semibold">Pedidos</Link>
        <Link href="/admin/viajes">Viajes</Link>
        <Link href="/admin/productos">Productos</Link>
        <form action={signOut} className="ml-auto"><button className="underline">Salir</button></form>
      </nav>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>
    </>
  );
}
