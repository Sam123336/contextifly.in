export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect width="32" height="32" rx="6" fill="#0B0F17" />
      {/* trace path */}
      <path
        d="M 12 23 L 18 23 L 24 17 L 18 9 L 12 9"
        stroke="#00F0FF"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* nodes */}
      <circle cx="10" cy="23" r="2.5" stroke="#00F0FF" strokeWidth="2" fill="#0B0F17" />
      <circle cx="18" cy="9" r="2" fill="#00F0FF" />
      <circle cx="24" cy="17" r="2" fill="#00F0FF" />
      <rect x="8" y="7" width="4" height="4" fill="#6366F1" />
    </svg>
  );
}
