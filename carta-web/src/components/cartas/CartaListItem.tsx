import Link from "next/link";
import CartaIcon from "@/icons/CartaIcon";
import ChevronRightIcon from "@/icons/ChevronRightIcon";
import type { Carta } from "@/types/entities";

export default function CartaListItem({ carta, index }: { carta: Carta; index: number }) {
  return (
    <Link
      href={`/carta/${carta.id}`}
      style={{ animationDelay: `${index * 70}ms` }}
      className="focus-ring stagger-item group flex items-center gap-4 border-b border-brand-100 py-5 transition-transform first:pt-0 last:border-b-0 hover:-translate-y-0.5"
    >
      <CartaIcon aria-hidden className="h-8 w-8 shrink-0 text-brand-200 transition-colors group-hover:text-brand-400 sm:h-9 sm:w-9" />
      <span className="flex-1 font-fraunces text-theme-xl italic text-gray-800 sm:text-title-sm">{carta.nombre ?? "Carta"}</span>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-brand-500 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
