import SeccionPreviewRow from "@/components/preview/SeccionPreviewRow";
import EmptyState from "@/components/ui/EmptyState";
import HeroHeader from "@/components/ui/HeroHeader";
import { DEFAULT_HERO_IMAGE } from "@/lib/constants";
import { cartaService } from "@/services/cartaService";

const MAX_PREVIEW_SECCIONES = 4;

export default async function MenuPreviewPage({ params }: { params: Promise<{ cartaId: string }> }) {
  const { cartaId } = await params;
  const carta = await cartaService.getById(cartaId);

  const seccionesConItems = carta.seccionesCarta
    .filter((seccion) => seccion.detallesSeccionCarta.length > 0)
    .slice(0, MAX_PREVIEW_SECCIONES);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
      <HeroHeader image={DEFAULT_HERO_IMAGE} title="Menú" backHref={`/carta/${cartaId}`} />

      <div className="flex flex-col gap-6 py-6">
        {seccionesConItems.length === 0 ? (
          <div className="px-4 sm:px-6">
            <EmptyState message="Todavía no hay platos cargados para mostrar en esta vista previa." />
          </div>
        ) : (
          seccionesConItems.map((seccion) => <SeccionPreviewRow key={seccion.id} seccion={seccion} cartaId={cartaId} />)
        )}
      </div>
    </main>
  );
}
