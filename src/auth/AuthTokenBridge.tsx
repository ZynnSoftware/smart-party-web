import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { setTokenProvider } from '@/services/api'

/**
 * The ONLY frontend file that knows Clerk owns the token. Mounted once inside
 * <ClerkProvider>, it wires Clerk's getToken into the vendor-neutral provider
 * that the services layer reads. Swap Clerk out and only this file changes.
 */
export function AuthTokenBridge() {
  const { getToken } = useAuth()

  useEffect(() => {
    setTokenProvider(() => getToken())
  }, [getToken])

  return null
}
