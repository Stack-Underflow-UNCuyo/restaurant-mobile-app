import Link from "next/link";
import type { SeccionCarta } from "@/types/entities";

export default function SeccionCard({ seccion, cartaId }: { seccion: SeccionCarta; cartaId: string }) {
  return (
    <Link
      href={`/seccion/${seccion.id}?cartaId=${cartaId}`}
      className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-xs transition-colors hover:border-brand-200 hover:bg-brand-25"
    >
      {seccion.categoria && (
        <span className="w-fit rounded-full bg-brand-50 px-2.5 py-1 text-theme-xs font-medium text-brand-600">
          {seccion.categoria.nombre}
        </span>
      )}
      <span className="text-theme-sm font-semibold text-gray-800">{seccion.nombre}</span>
    </Link>
  );
}
