import Link from "next/link";
import ArrowLeftIcon from "@/icons/ArrowLeftIcon";

export default function BackLink({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="Volver"
      className={`focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-[color,background-color,box-shadow] ${className}`}
    >
      <ArrowLeftIcon className="h-5 w-5" />
    </Link>
  );
}
