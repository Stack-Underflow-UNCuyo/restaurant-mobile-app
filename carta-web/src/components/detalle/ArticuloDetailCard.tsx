import { formatPrice } from "@/lib/format";
import { imageForCategoria } from "@/lib/images";
import type { Categoria, DetalleSeccionCartaArticuloIndividual } from "@/types/entities";

export default function ArticuloDetailCard({
  detalle,
  categoria,
}: {
  detalle: DetalleSeccionCartaArticuloIndividual;
  categoria?: Categoria;
}) {
  const { articulo } = detalle;
  const descripcion = detalle.descripcion ?? articulo.descripcion;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      {/* Ni Articulo ni SeccionCarta exponen una imagen propia — se usa el placeholder por categoría (ver lib/images.ts). */}
      {/* eslint-disable-next-line @next/next/no-img-element -- small bundled placeholder vector, no responsive variants needed */}
      <img src={imageForCategoria(categoria)} alt="" className="h-28 w-full object-cover sm:h-32" />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-theme-sm font-semibold text-gray-800">{articulo.nombre}</h3>
        {descripcion && <p className="line-clamp-2 text-theme-xs text-gray-500">{descripcion}</p>}
        <span className="mt-auto pt-2 text-theme-sm font-semibold text-brand-500">{formatPrice(detalle.precio)}</span>
      </div>
    </article>
  );
}
