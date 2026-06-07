import BackLink from "@/components/ui/BackLink";

export default function PageHeader({ title, backHref }: { title: string; backHref: string }) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-gray-50/90 px-4 py-3 backdrop-blur sm:px-6">
      <BackLink
        href={backHref}
        className="border border-gray-200 bg-white text-gray-600 shadow-theme-xs hover:border-brand-200 hover:text-brand-500"
      />
      <h1 className="truncate text-theme-xl font-semibold text-gray-800">{title}</h1>
    </header>
  );
}
