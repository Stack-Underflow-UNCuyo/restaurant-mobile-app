import MenuOptionCard from "@/components/secciones/MenuOptionCard";
import SeccionCard from "@/components/secciones/SeccionCard";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { cartaService } from "@/services/cartaService";

export default async function CartaPage({ params }: { params: Promise<{ cartaId: string }> }) {
  const { cartaId } = await params;
  const carta = await cartaService.getById(cartaId);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
      <PageHeader title={carta.nombre ?? "Carta"} backHref="/" />

      <div className="flex flex-col gap-4 px-4 py-6 sm:px-6">
        {carta.seccionesCarta.length === 0 ? (
          <EmptyState message="Todavía no hay secciones cargadas en esta carta." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MenuOptionCard href={`/carta/${cartaId}/menu`} />
            {carta.seccionesCarta.map((seccion) => (
              <SeccionCard key={seccion.id} seccion={seccion} cartaId={cartaId} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
