import type { ReactNode } from 'react'

type Illustration = 'party' | 'error'

interface EmptyStateProps {
  illustration?: Illustration
  title: string
  description?: string
  action?: ReactNode
}

/** Friendly empty/error placeholder with a lightweight inline illustration. */
export function EmptyState({
  illustration = 'party',
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-surface-container-lowest px-6 py-12 text-center shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
      <div className="mb-4">
        {illustration === 'party' ? <PartyArt /> : <ErrorArt />}
      </div>
      <h2 className="mb-1 text-lg font-bold">{title}</h2>
      {description && (
        <p className="mb-6 max-w-xs text-sm text-on-surface-variant">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

function PartyArt() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="44" className="fill-primary-fixed" />
      {/* Party popper cone */}
      <path d="M30 66 L52 44 L60 52 L38 74 Z" className="fill-primary" />
      <path d="M30 66 L38 74 L26 78 Z" className="fill-[color:var(--color-primary-container)]" />
      {/* Confetti */}
      <circle cx="60" cy="30" r="4" className="fill-tertiary" />
      <circle cx="72" cy="46" r="3" className="fill-primary" />
      <rect x="54" y="52" width="6" height="6" rx="1" className="fill-tertiary-container" transform="rotate(20 57 55)" />
      <path d="M66 60 q6 -4 12 0" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function ErrorArt() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="44" className="fill-error-container" />
      {/* Deflated balloon */}
      <path d="M48 26 C60 26 66 36 62 48 C59 57 50 60 48 60 C46 60 37 57 34 48 C30 36 36 26 48 26 Z" className="fill-error" opacity="0.85" />
      <path d="M48 60 l-3 8 l6 0 z" className="fill-error" />
      <path d="M48 68 q-8 6 0 14" stroke="var(--color-error)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}
