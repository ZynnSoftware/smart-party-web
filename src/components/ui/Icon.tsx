import type { SVGProps } from 'react'

export type IconName =
  | 'trash'
  | 'close'
  | 'check'
  | 'plus'
  | 'minus'
  | 'share'
  | 'copy'
  | 'key'
  | 'users'
  | 'couple'
  | 'person'
  | 'party'
  | 'arrow-right'
  | 'arrow-left'
  | 'sun'
  | 'moon'
  | 'receipt'
  | 'wallet'
  | 'sparkles'
  | 'restore'
  | 'flag'
  | 'edit'
  | 'chevron-down'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

// Each path is drawn on a 24×24 grid and inherits `currentColor`.
const PATHS: Record<IconName, string> = {
  trash:
    'M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7m4 4v6m4-6v6',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 13l4 4L19 7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  share:
    'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13',
  copy: 'M9 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1ZM6 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1',
  key: 'M15 7a4 4 0 1 0-3.87 4L9 13v3H6v3H3v-3l6.13-6.13A4 4 0 0 0 15 7Z',
  users:
    'M17 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM22 20v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11',
  couple:
    'M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1M14 20v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1',
  person:
    'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1',
  party:
    'M3 21l6-2-4-4-2 6ZM9 19l8-8M13 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2ZM19 9l.7 1.3L21 11l-1.3.7L19 13l-.7-1.3L17 11l1.3-.7L19 9Z',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-left': 'M19 12H5M11 18l-6-6 6-6',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 2v2M12 20v2M4 12H2M22 12h-2M5 5 3.5 3.5M20.5 20.5 19 19M19 5l1.5-1.5M3.5 20.5 5 19',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
  receipt:
    'M6 2h12v20l-3-2-3 2-3-2-3 2V2ZM9 7h6M9 11h6M9 15h4',
  wallet:
    'M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0H5a2 2 0 0 0-2 2v0m0-2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5M16 12h.01',
  sparkles:
    'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3ZM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z',
  restore: 'M3 12a9 9 0 1 0 3-6.7M3 4v4h4',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  edit: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  'chevron-down': 'M6 9l6 6 6-6',
}

const FILLED: Partial<Record<IconName, boolean>> = {
  key: true,
  moon: true,
  sparkles: true,
  party: true,
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const isFilled = FILLED[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
