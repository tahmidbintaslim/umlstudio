// Brand mark: three connected nodes, i.e. a diagram reduced to its essence.
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--accent, #6366f1)" />
      <path d="M10 11h12M10 11l6 11M22 11l-6 11" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" fill="none" />
      <rect x="6" y="7.5" width="8" height="7" rx="2" fill="#fff" />
      <rect x="18" y="7.5" width="8" height="7" rx="2" fill="#fff" />
      <circle cx="16" cy="22.5" r="4" fill="#fff" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold tracking-tight">
      <LogoMark />
      <span>UML Studio</span>
    </span>
  );
}
