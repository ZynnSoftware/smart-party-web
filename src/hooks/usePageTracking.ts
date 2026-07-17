import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { pushPageview } from '@/utils/gtm'

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    pushPageview(location.pathname + location.search)
  }, [location])
}
