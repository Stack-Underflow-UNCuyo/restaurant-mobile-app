import { formatPrice } from "@/lib/format";

export interface PreviewItem {
  id: string;
  nombre: string;
  precio: number;
  image: string;
}

export default function ItemPreviewCard({ item }: { item: PreviewItem }) {
  return (
    <article className="flex w-32 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs sm:w-36">
      {/* eslint-disable-next-line @next/next/no-img-element -- small bundled placeholder vector, no responsive variants needed */}
      <img src={item.image} alt="" className="h-20 w-full object-cover sm:h-24" />
      <div className="flex flex-col gap-0.5 p-2.5">
        <h3 className="truncate text-theme-xs font-semibold text-gray-800">{item.nombre}</h3>
        <span className="text-theme-xs font-semibold text-brand-500">{formatPrice(item.precio)}</span>
      </div>
    </article>
  );
}
