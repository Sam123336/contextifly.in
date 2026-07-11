export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4d7cff" />
          <stop offset="0.5" stopColor="#9a5bff" />
          <stop offset="1" stopColor="#29e0d4" />
        </linearGradient>
      </defs>
      {/* edges */}
      <g stroke="url(#lg)" strokeWidth="1.6" opacity="0.9">
        <path d="M16 16 L6 8" />
        <path d="M16 16 L26 9" />
        <path d="M16 16 L8 25" />
        <path d="M16 16 L25 24" />
      </g>
      {/* satellite nodes */}
      <g fill="url(#lg)">
        <circle cx="6" cy="8" r="2.4" />
        <circle cx="26" cy="9" r="2.4" />
        <circle cx="8" cy="25" r="2.4" />
        <circle cx="25" cy="24" r="2.4" />
      </g>
      {/* core */}
      <circle cx="16" cy="16" r="4.6" fill="url(#lg)" />
      <circle cx="16" cy="16" r="4.6" fill="#05060b" opacity="0.35" />
      <circle cx="16" cy="16" r="2" fill="#fff" />
    </svg>
  );
}
