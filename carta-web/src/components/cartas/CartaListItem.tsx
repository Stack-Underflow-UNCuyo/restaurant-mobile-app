import Link from "next/link";
import ChevronRightIcon from "@/icons/ChevronRightIcon";
import type { Carta } from "@/types/entities";

export default function CartaListItem({ carta }: { carta: Carta }) {
  return (
    <Link
      href={`/carta/${carta.id}`}
      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-theme-xs transition-colors hover:border-brand-200 hover:bg-brand-25"
    >
      <span className="text-theme-xl font-semibold text-gray-800">{carta.nombre ?? "Carta"}</span>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-brand-500" />
    </Link>
  );
}
