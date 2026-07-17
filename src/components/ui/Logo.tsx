import { useId } from 'react'

interface LogoProps {
  size?: number
  className?: string
}

/**
 * reparteaí symbol: the two circles + slash of a "%" sign, reimagined as two
 * halves joined by a gradient stroke — the rateio (split) concept without a caption.
 * See smart-party-brand-guide.html for the full brand rationale.
 */
export function Logo({ size = 22, className }: LogoProps) {
  const gradientId = useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="30" y1="6" x2="10" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B3290F" />
          <stop offset="1" stopColor="#F2A93B" />
        </linearGradient>
      </defs>
      <g transform="translate(3,2)">
        <circle cx="11" cy="10" r="5.5" fill="none" stroke="#B3290F" strokeWidth="3.5" />
        <circle cx="28" cy="30" r="5.5" fill="none" stroke="#F2A93B" strokeWidth="3.5" />
        <line
          x1="30"
          y1="6"
          x2="8"
          y2="33"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
