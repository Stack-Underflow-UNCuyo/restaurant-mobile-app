import Link from "next/link";
import { imageForItem } from "@/lib/images";
import type { SeccionCarta } from "@/types/entities";

export default function SeccionCard({
  seccion,
  cartaId,
  featured = false,
  index = 0,
}: {
  seccion: SeccionCarta;
  cartaId: string;
  featured?: boolean;
  index?: number;
}) {
  const image = imageForItem(seccion.imagenUrl, seccion.categoria);

  if (featured) {
    return (
      <Link
        href={`/seccion/${seccion.id}?cartaId=${cartaId}`}
        style={{ animationDelay: `${index * 70}ms` }}
        className="focus-ring stagger-item group relative col-span-2 flex h-48 flex-col justify-end overflow-hidden rounded-2xl shadow-theme-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-theme-md sm:h-60"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- la imagen viene del backend o es un placeholder bundleado, sin variantes responsive */}
        <img
          src={image}
          alt={seccion.nombre}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-900/25 to-transparent" />
        <div className="relative flex flex-col gap-2 p-4 sm:p-5">
          {seccion.categoria && (
            <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-theme-xs font-medium text-white backdrop-blur-sm">
              {seccion.categoria.nombre}
            </span>
          )}
          <span className="font-fraunces text-title-sm italic text-white drop-shadow-sm sm:text-title-md">{seccion.nombre}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/seccion/${seccion.id}?cartaId=${cartaId}`}
      style={{ animationDelay: `${index * 70}ms` }}
      className="focus-ring stagger-item group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs transition-[transform,border-color,background-color,box-shadow] hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-25 hover:shadow-theme-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- la imagen viene del backend o es un placeholder bundleado, sin variantes responsive */}
      <img
        src={image}
        alt={seccion.nombre}
        loading="lazy"
        className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="flex flex-col gap-2 p-4">
        {seccion.categoria && (
          <span className="w-fit rounded-full bg-brand-50 px-2.5 py-1 text-theme-xs font-medium text-brand-600">
            {seccion.categoria.nombre}
          </span>
        )}
        <span className="font-fraunces text-theme-sm italic text-gray-800">{seccion.nombre}</span>
      </div>
    </Link>
  );
}
