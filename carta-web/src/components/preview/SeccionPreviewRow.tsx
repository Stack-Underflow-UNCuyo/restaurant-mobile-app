import Link from "next/link";
import ItemPreviewCard, { type PreviewItem } from "@/components/preview/ItemPreviewCard";
import { imageForItem } from "@/lib/images";
import { isDetalleArticulo, isDetalleMenu } from "@/types/entities";
import type { Categoria, DetalleSeccionCartaItem, SeccionCarta } from "@/types/entities";

function toPreviewItem(detalle: DetalleSeccionCartaItem, categoria?: Categoria): PreviewItem | null {
  if (isDetalleArticulo(detalle)) {
    return {
      id: detalle.id,
      nombre: detalle.articulo.nombre,
      precio: detalle.precio,
      image: imageForItem(detalle.imagenUrl, categoria),
    };
  }
  if (isDetalleMenu(detalle)) {
    return {
      id: detalle.id,
      nombre: detalle.menu.nombre,
      precio: detalle.menu.precio,
      image: imageForItem(detalle.menu.imagenUrl ?? detalle.imagenUrl, categoria),
    };
  }
  return null;
}

export default function SeccionPreviewRow({ seccion, cartaId }: { seccion: SeccionCarta; cartaId: string }) {
  const items = seccion.detallesSeccionCarta
    .map((detalle) => toPreviewItem(detalle, seccion.categoria))
    .filter((item): item is PreviewItem => item !== null);

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3 px-4 sm:px-6">
        <h2 className="text-theme-sm font-semibold text-gray-800">{seccion.nombre}</h2>
        <Link href={`/seccion/${seccion.id}?cartaId=${cartaId}`} className="shrink-0 text-theme-xs font-medium text-brand-500 hover:text-brand-600">
          Ver más &gt;
        </Link>
      </div>
      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 sm:px-6">
        {items.map((item) => (
          <ItemPreviewCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
