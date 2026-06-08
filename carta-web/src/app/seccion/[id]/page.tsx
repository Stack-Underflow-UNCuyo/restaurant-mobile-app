import DetalleSeccionGrid from "@/components/detalle/DetalleSeccionGrid";
import HeroHeader from "@/components/ui/HeroHeader";
import { imageForItem } from "@/lib/images";
import { seccionCartaService } from "@/services/seccionCartaService";

export default async function SeccionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ cartaId?: string }>;
}) {
  const [{ id }, { cartaId }] = await Promise.all([params, searchParams]);
  const seccion = await seccionCartaService.getById(id);

  // SeccionCartaDto no referencia su Carta — el cartaId llega por query string
  // desde los enlaces que sí lo conocen (vista de secciones y preview de menú).
  const backHref = cartaId ? `/carta/${cartaId}` : "/";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
      <HeroHeader image={imageForItem(seccion.imagenUrl, seccion.categoria)} title={seccion.nombre} backHref={backHref} />

      <div className="px-4 py-6 sm:px-6 md:px-8">
        <DetalleSeccionGrid detalles={seccion.detallesSeccionCarta} categoria={seccion.categoria} />
      </div>
    </main>
  );
}
