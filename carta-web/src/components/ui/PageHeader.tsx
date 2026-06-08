import BackLink from "@/components/ui/BackLink";

export default function PageHeader({ title, backHref }: { title: string; backHref: string }) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-brand-100 bg-paper-50/90 px-4 py-3 backdrop-blur sm:px-6 md:px-8">
      <BackLink
        href={backHref}
        className="border border-gray-200 bg-white text-gray-600 shadow-theme-xs hover:border-brand-200 hover:text-brand-500"
      />
      <h1 className="truncate font-fraunces text-theme-xl italic text-gray-800">{title}</h1>
    </header>
  );
}
