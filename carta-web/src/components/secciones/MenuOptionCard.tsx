import Link from "next/link";

export default function MenuOptionCard({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col justify-between gap-3 rounded-2xl border border-brand-500 bg-brand-500 p-4 text-white shadow-theme-xs transition-colors hover:bg-brand-600"
    >
      <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-theme-xs font-medium">Vista rápida</span>
      <span className="text-theme-sm font-semibold">Menú</span>
    </Link>
  );
}
