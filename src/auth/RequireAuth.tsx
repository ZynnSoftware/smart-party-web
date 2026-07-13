import type { PropsWithChildren } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { SkeletonList } from '@/components/ui/Skeleton'
import { SignedOutLanding } from './SignedOutLanding'

/**
 * Authentication gate for the whole app (Phase 1). While Clerk loads, shows a
 * skeleton; signed-out visitors get the inviting landing; signed-in users get
 * the app. Authorization/ownership is still enforced server-side.
 */
export function RequireAuth({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <SkeletonList rows={3} />
      </div>
    )
  }

  if (!isSignedIn) return <SignedOutLanding />

  return <>{children}</>
}
