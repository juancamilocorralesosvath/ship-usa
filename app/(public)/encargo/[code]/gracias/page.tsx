import Link from "next/link";
import ClearCart from "@/components/ClearCart";

export default async function Gracias({ params }: PageProps<"/encargo/[code]/gracias">) {
  const { code } = await params;
  return (
    <div className="space-y-4 text-center">
      <ClearCart />
      <h1 className="text-2xl font-semibold">¡Recibimos tu encargo!</h1>
      <p>Tu código es</p>
      <p className="text-3xl font-bold tracking-widest">{code}</p>
      <p className="text-zinc-600">Te escribimos por WhatsApp con la cotización.</p>
      <Link href="/" className="underline">Volver al inicio</Link>
    </div>
  );
}
