import CartaListItem from "@/components/cartas/CartaListItem";
import EmptyState from "@/components/ui/EmptyState";
import { RESTAURANT_LOGO } from "@/lib/constants";
import { cartaService } from "@/services/cartaService";
import { empresaService } from "@/services/empresaService";

export default async function HomePage() {
  const [empresa, cartas] = await Promise.all([empresaService.getActive(), cartaService.getAll()]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col items-center gap-3 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- small bundled placeholder vector, no responsive variants needed */}
        <img src={RESTAURANT_LOGO} alt="" className="h-24 w-24 rounded-full shadow-theme-md" />
        <h1 className="text-title-sm font-semibold text-gray-800 sm:text-title-md">{empresa.nombre}</h1>
      </header>

      <section className="flex flex-col gap-3">
        {cartas.length === 0 ? (
          <EmptyState message="Todavía no hay cartas publicadas." />
        ) : (
          cartas.map((carta) => <CartaListItem key={carta.id} carta={carta} />)
        )}
      </section>
    </main>
  );
}
