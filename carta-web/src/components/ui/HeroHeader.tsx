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
    <header className="relative h-56 w-full overflow-hidden sm:h-72 md:h-80">
      {/* eslint-disable-next-line @next/next/no-img-element -- la imagen viene del backend o es un placeholder bundleado, sin variantes responsive */}
      <img src={image} alt={title} loading="eager" fetchPriority="high" className="h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-800/40 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-radial-[at_50%_120%] from-brand-900/50 via-transparent to-transparent" />
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6 md:left-8 md:top-8">
        <BackLink href={backHref} className="bg-black/25 text-white backdrop-blur-sm hover:bg-black/40" />
      </div>
      <h1 className="absolute bottom-4 left-4 right-4 font-fraunces text-title-sm italic font-semibold text-white drop-shadow-sm sm:bottom-6 sm:left-6 sm:right-6 sm:text-title-md md:left-8 md:right-8 md:text-title-lg">
        {title}
      </h1>
    </header>
  );
}
