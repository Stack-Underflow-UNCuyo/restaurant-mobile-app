import Link from "next/link";
import ItemPreviewCard, { type PreviewItem } from "@/components/preview/ItemPreviewCard";
import SectionLabel from "@/components/ui/SectionLabel";
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

export default function SeccionPreviewRow({ seccion, cartaId, index = 0 }: { seccion: SeccionCarta; cartaId: string; index?: number }) {
  const items = seccion.detallesSeccionCarta
    .map((detalle) => toPreviewItem(detalle, seccion.categoria))
    .filter((item): item is PreviewItem => item !== null);

  if (items.length === 0) return null;

  return (
    <section className="stagger-item flex flex-col gap-3" style={{ animationDelay: `${index * 90}ms` }}>
      <div className="flex items-end justify-between gap-3 border-b border-brand-100 px-4 pb-3 sm:px-6 md:px-8">
        <SectionLabel index={index} title={seccion.nombre ?? "Sección"} />
        <Link
          href={`/seccion/${seccion.id}?cartaId=${cartaId}`}
          className="focus-ring shrink-0 rounded-full px-2 py-1 text-theme-xs font-medium text-brand-500 transition-colors hover:text-brand-600"
        >
          Ver más &gt;
        </Link>
      </div>
      <div className="carousel-scroll no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 sm:px-6 md:px-8">
        {items.map((item, itemIndex) => (
          <ItemPreviewCard key={item.id} item={item} index={itemIndex} />
        ))}
      </div>
    </section>
  );
}
