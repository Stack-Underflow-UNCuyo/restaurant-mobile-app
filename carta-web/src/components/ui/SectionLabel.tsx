// Motivo editorial repetido en Home, las filas de vista previa y la grilla de
// sección: un numeral grande y desvaído junto al nombre, como en el índice de
// un menú impreso.
export default function SectionLabel({
  index,
  title,
  className = "",
}: {
  index: number;
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      <span aria-hidden className="font-fraunces text-title-sm leading-none text-brand-100 sm:text-title-md">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className="font-fraunces text-theme-xl italic text-gray-800 sm:text-title-sm">{title}</h2>
    </div>
  );
}
