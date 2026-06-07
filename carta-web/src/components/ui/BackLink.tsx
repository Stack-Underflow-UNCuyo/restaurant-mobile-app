import Link from "next/link";
import ArrowLeftIcon from "@/icons/ArrowLeftIcon";

export default function BackLink({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="Volver"
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${className}`}
    >
      <ArrowLeftIcon className="h-5 w-5" />
    </Link>
  );
}
