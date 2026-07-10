import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/80 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm transition-all duration-300 ${className}`}
      {...props}
    />
  )
}
