import ArticuloDetailCard from "@/components/detalle/ArticuloDetailCard";
import ComboDetailCard from "@/components/detalle/ComboDetailCard";
import EmptyState from "@/components/ui/EmptyState";
import { isDetalleArticulo, isDetalleMenu } from "@/types/entities";
import type { Categoria, DetalleSeccionCartaItem } from "@/types/entities";

export default function DetalleSeccionGrid({
  detalles,
  categoria,
}: {
  detalles: DetalleSeccionCartaItem[];
  categoria?: Categoria;
}) {
  if (detalles.length === 0) {
    return <EmptyState message="Todavía no hay platos cargados en esta sección." />;
  }

  const featuredCount = Math.min(2, detalles.length);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
      {detalles.map((detalle, index) => {
        const featured = index < featuredCount;
        if (isDetalleArticulo(detalle)) {
          return <ArticuloDetailCard key={detalle.id} detalle={detalle} categoria={categoria} featured={featured} index={index} />;
        }
        if (isDetalleMenu(detalle)) {
          return <ComboDetailCard key={detalle.id} detalle={detalle} categoria={categoria} featured={featured} index={index} />;
        }
        return null;
      })}
    </div>
  );
}
