interface SkeletonProps {
  className?: string
}

/** Shimmering placeholder block used while data loads. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-container ${className}`}
      aria-hidden="true"
    />
  )
}

/** A few stacked card-shaped skeletons for list/estimate loading states. */
export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="rounded-lg bg-surface-container-lowest p-5 shadow-[var(--shadow-card)]"
        >
          <Skeleton className="mb-2 h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}
