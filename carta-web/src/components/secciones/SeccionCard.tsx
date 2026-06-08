import Link from "next/link";
import { imageForItem } from "@/lib/images";
import type { SeccionCarta } from "@/types/entities";

export default function SeccionCard({ seccion, cartaId }: { seccion: SeccionCarta; cartaId: string }) {
  return (
    <Link
      href={`/seccion/${seccion.id}?cartaId=${cartaId}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs transition-colors hover:border-brand-200 hover:bg-brand-25"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- la imagen viene del backend o es un placeholder bundleado, sin variantes responsive */}
      <img src={imageForItem(seccion.imagenUrl, seccion.categoria)} alt="" className="h-28 w-full object-cover" />
      <div className="flex flex-col gap-3 p-4">
        {seccion.categoria && (
          <span className="w-fit rounded-full bg-brand-50 px-2.5 py-1 text-theme-xs font-medium text-brand-600">
            {seccion.categoria.nombre}
          </span>
        )}
        <span className="text-theme-sm font-semibold text-gray-800">{seccion.nombre}</span>
      </div>
    </Link>
  );
}
