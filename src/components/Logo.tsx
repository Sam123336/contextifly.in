export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      {/* edges */}
      <g stroke="var(--faint)" strokeWidth="1.5">
        <path d="M16 16 L6 8" />
        <path d="M16 16 L26 9" />
        <path d="M16 16 L8 25" />
        <path d="M16 16 L25 24" />
      </g>
      {/* satellite nodes */}
      <g fill="var(--muted)">
        <circle cx="6" cy="8" r="2.2" />
        <circle cx="26" cy="9" r="2.2" />
        <circle cx="8" cy="25" r="2.2" />
        <circle cx="25" cy="24" r="2.2" />
      </g>
      {/* core */}
      <circle cx="16" cy="16" r="4.4" fill="var(--accent)" />
      <circle cx="16" cy="16" r="1.8" fill="var(--bg)" />
    </svg>
  );
}
