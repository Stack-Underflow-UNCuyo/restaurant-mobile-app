import Link from "next/link";

export default function MenuOptionCard({ href, index = 0 }: { href: string; index?: number }) {
  return (
    <Link
      href={href}
      style={{ animationDelay: `${index * 70}ms` }}
      className="grain focus-ring stagger-item group relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 p-4 text-white shadow-theme-xs transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-theme-md"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/30 font-fraunces text-theme-sm italic">
        ★
      </span>
      <span className="relative flex flex-col gap-0.5">
        <span className="text-theme-xs uppercase tracking-[0.2em] text-brand-100">Vista rápida</span>
        <span className="font-fraunces text-theme-xl italic transition-transform group-hover:translate-x-0.5">Menú</span>
      </span>
    </Link>
  );
}
