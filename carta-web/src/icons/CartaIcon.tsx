export default function CartaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="7" y="4.5" width="18" height="23" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11.5 11H20.5M11.5 16H20.5M11.5 21H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
