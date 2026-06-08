export default function PlateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 4.5V7M16 25v2.5M27.5 16H25M7 16H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
