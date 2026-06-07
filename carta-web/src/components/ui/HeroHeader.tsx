import BackLink from "@/components/ui/BackLink";

export default function HeroHeader({
  image,
  title,
  backHref,
}: {
  image: string;
  title: string;
  backHref: string;
}) {
  return (
    <header className="relative h-48 w-full overflow-hidden sm:h-60">
      {/* eslint-disable-next-line @next/next/no-img-element -- small bundled placeholder vector, no responsive variants needed */}
      <img src={image} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
        <BackLink href={backHref} className="bg-black/25 text-white backdrop-blur-sm hover:bg-black/40" />
      </div>
      <h1 className="absolute bottom-4 left-4 right-4 text-title-sm font-semibold text-white drop-shadow-sm sm:bottom-6 sm:left-6 sm:right-6 sm:text-title-md">
        {title}
      </h1>
    </header>
  );
}
