import CartaListItem from "@/components/cartas/CartaListItem";
import EmptyState from "@/components/ui/EmptyState";
import { RESTAURANT_LOGO } from "@/lib/constants";
import { cartaService } from "@/services/cartaService";
import { empresaService } from "@/services/empresaService";

export default async function HomePage() {
  const [empresa, cartas] = await Promise.all([empresaService.getActive(), cartaService.getAll()]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col md:max-w-3xl">
      <header className="grain relative flex flex-col items-center overflow-hidden bg-gradient-to-br from-brand-700 to-brand-950 px-4 pb-16 pt-14 text-center sm:px-6 sm:pb-20 md:pb-24">
        <h1 className="font-fraunces text-title-sm italic text-white sm:text-title-md md:text-title-lg">{empresa.nombre}</h1>
        <p className="mt-2 font-outfit text-theme-xs uppercase tracking-[0.2em] text-brand-100">Carta digital</p>
      </header>

      <div className="flex flex-col gap-8 px-4 py-8 sm:px-6 md:px-8">
        <div className="relative z-10 -mt-24 flex justify-center sm:-mt-28">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo bundleado, sin variantes responsive */}
          <img
            src={RESTAURANT_LOGO}
            alt={`${empresa.nombre} — logo`}
            loading="eager"
            fetchPriority="high"
            className="h-28 w-28 rounded-full border-4 border-paper-50 shadow-theme-lg sm:h-32 sm:w-32"
          />
        </div>

        <section className="flex flex-col">
          {cartas.length === 0 ? (
            <EmptyState message="Todavía no hay cartas publicadas." />
          ) : (
            cartas.map((carta, index) => <CartaListItem key={carta.id} carta={carta} index={index} />)
          )}
        </section>
      </div>
    </main>
  );
}
