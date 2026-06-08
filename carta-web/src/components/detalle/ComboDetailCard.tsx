import { formatPrice } from "@/lib/format";
import { imageForItem } from "@/lib/images";
import type { Categoria, DetalleSeccionCartaMenu } from "@/types/entities";

export default function ComboDetailCard({
  detalle,
  categoria,
  featured = false,
  index = 0,
}: {
  detalle: DetalleSeccionCartaMenu;
  categoria?: Categoria;
  featured?: boolean;
  index?: number;
}) {
  const { menu } = detalle;
  // El combo prioriza la imagen del Menu (reutilizable entre cartas) y cae al
  // de su propio detalle de sección si no tiene una propia.
  const imagenUrl = menu.imagenUrl ?? detalle.imagenUrl;
  const image = imageForItem(imagenUrl, categoria);

  if (featured) {
    return (
      <article
        style={{ animationDelay: `${index * 70}ms` }}
        className="focus-ring stagger-item group col-span-2 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-theme-sm sm:flex-row"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- la imagen viene del backend o es un placeholder bundleado, sin variantes responsive */}
        <img
          src={image}
          alt={menu.nombre}
          loading="lazy"
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-auto sm:w-2/5"
        />
        <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
          <h3 className="font-fraunces text-theme-xl italic text-gray-800">{menu.nombre}</h3>
          {menu.descripcion && <p className="line-clamp-2 text-theme-sm text-gray-500">{menu.descripcion}</p>}
          {menu.detallesMenu.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {menu.detallesMenu.map((item) => (
                <li key={item.id} className="truncate text-theme-sm text-gray-500">
                  {item.cantidad}× {item.nombre}
                </li>
              ))}
            </ul>
          )}
          <span className="mt-auto pt-2 text-theme-md font-semibold tabular-nums text-brand-500">{formatPrice(menu.precio)}</span>
        </div>
      </article>
    );
  }

  return (
    <article
      style={{ animationDelay: `${index * 70}ms` }}
      className="focus-ring stagger-item group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-theme-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- la imagen viene del backend o es un placeholder bundleado, sin variantes responsive */}
      <img
        src={image}
        alt={menu.nombre}
        loading="lazy"
        className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-32"
      />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-fraunces text-theme-sm italic text-gray-800">{menu.nombre}</h3>
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
        <span className="mt-auto pt-2 text-theme-sm font-semibold tabular-nums text-brand-500">{formatPrice(menu.precio)}</span>
      </div>
    </article>
  );
}
