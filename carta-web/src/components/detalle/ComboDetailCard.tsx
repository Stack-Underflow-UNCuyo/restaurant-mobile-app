import { formatPrice } from "@/lib/format";
import { imageForCategoria } from "@/lib/images";
import type { Categoria, DetalleSeccionCartaMenu } from "@/types/entities";

export default function ComboDetailCard({
  detalle,
  categoria,
}: {
  detalle: DetalleSeccionCartaMenu;
  categoria?: Categoria;
}) {
  const { menu } = detalle;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      {/* Ni Menu ni SeccionCarta exponen una imagen propia — se usa el placeholder por categoría (ver lib/images.ts). */}
      {/* eslint-disable-next-line @next/next/no-img-element -- small bundled placeholder vector, no responsive variants needed */}
      <img src={imageForCategoria(categoria)} alt="" className="h-28 w-full object-cover sm:h-32" />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-theme-sm font-semibold text-gray-800">{menu.nombre}</h3>
        {menu.descripcion && <p className="line-clamp-2 text-theme-xs text-gray-500">{menu.descripcion}</p>}
        {menu.detallesMenu.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {menu.detallesMenu.map((item) => (
              <li key={item.id} className="truncate text-theme-xs text-gray-500">
                {item.cantidad}× {item.nombre}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto pt-2 text-theme-sm font-semibold text-brand-500">{formatPrice(menu.precio)}</span>
      </div>
    </article>
  );
}
