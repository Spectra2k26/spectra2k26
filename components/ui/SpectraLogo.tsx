export default function SpectraLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagon outer */}
      <polygon
        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        fill="none"
      />
      {/* Inner hexagon */}
      <polygon
        points="50,18 78,33.5 78,66.5 50,82 22,66.5 22,33.5"
        fill="url(#logoFill)"
        opacity="0.15"
      />
      {/* S letter path */}
      <path
        d="M38 38 C38 34 42 32 50 32 C58 32 62 35 62 39 C62 43 58 45 50 47 C42 49 38 51 38 56 C38 61 42 64 50 64 C58 64 62 61 62 57"
        stroke="url(#logoGradient)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sparkles */}
      <circle cx="50" cy="50" r="2" fill="#10b981" opacity="0.8" />
      <circle cx="68" cy="30" r="1.5" fill="#f59e0b" opacity="0.9" />
      <circle cx="32" cy="70" r="1.5" fill="#f59e0b" opacity="0.9" />

      <defs>
        <linearGradient id="logoGradient" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="logoFill" x1="22" y1="18" x2="78" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  )
}
