import PlateIcon from "@/icons/PlateIcon";

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-100 bg-white px-6 py-14 text-center">
      <PlateIcon aria-hidden className="h-8 w-8 text-brand-200" />
      <p className="font-fraunces text-theme-sm italic text-gray-500">{message}</p>
    </div>
  );
}
