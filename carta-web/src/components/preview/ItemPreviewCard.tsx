import { formatPrice } from "@/lib/format";

export interface PreviewItem {
  id: string;
  nombre: string;
  precio: number;
  image: string;
}

export default function ItemPreviewCard({ item, index = 0 }: { item: PreviewItem; index?: number }) {
  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className="focus-ring stagger-item group flex w-32 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-theme-sm sm:w-36"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- la imagen viene del backend o es un placeholder bundleado, sin variantes responsive */}
      <img
        src={item.image}
        alt={item.nombre}
        loading="lazy"
        className="h-20 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-24"
      />
      <div className="flex flex-col gap-0.5 p-2.5">
        <h3 className="truncate font-fraunces text-theme-sm italic text-gray-800">{item.nombre}</h3>
        <span className="text-theme-xs font-semibold tabular-nums text-brand-500">{formatPrice(item.precio)}</span>
      </div>
    </article>
  );
}
