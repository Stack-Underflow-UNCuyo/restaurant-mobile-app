export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
      <p className="text-theme-sm text-gray-500">{message}</p>
    </div>
  );
}
