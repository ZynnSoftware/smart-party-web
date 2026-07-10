import { useCallback, useEffect, useState } from 'react'
import { eventsService } from '@/services/events'
import type { EventEstimate } from '@/types/domain'

interface UseEstimateResult {
  estimate: EventEstimate | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const LOAD_ERROR = 'Não foi possível carregar a estimativa.'

/** Fetches the derived list/budget/split for an event and exposes a refresh. */
export function useEstimate(eventId: string | undefined): UseEstimateResult {
  const [estimate, setEstimate] = useState<EventEstimate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!eventId) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await eventsService.getEstimate(eventId)
      setEstimate(result)
    } catch {
      setError(LOAD_ERROR)
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { estimate, isLoading, error, refresh }
}
