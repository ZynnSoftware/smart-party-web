import { useEffect, useState } from 'react'
import { eventsService } from '@/services/events'
import type { EventSummary } from '@/types/domain'

interface UseEventsResult {
  events: EventSummary[]
  isLoading: boolean
  error: string | null
  removeEvent: (id: string) => Promise<void>
}

const LOAD_ERROR = 'Não foi possível carregar seus eventos.'
const DELETE_ERROR = 'Não foi possível excluir o evento.'

/** Loads the saved events (with derived totals) for the list view. */
export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true
    eventsService
      .list()
      .then((data) => {
        if (isActive) setEvents(data)
      })
      .catch(() => {
        if (isActive) setError(LOAD_ERROR)
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })
    return () => {
      isActive = false
    }
  }, [])

  const removeEvent = async (id: string) => {
    const previous = events
    // Optimistic: drop it immediately, roll back if the request fails.
    setEvents((current) => current.filter((event) => event.id !== id))
    try {
      await eventsService.remove(id)
    } catch {
      setEvents(previous)
      setError(DELETE_ERROR)
    }
  }

  return { events, isLoading, error, removeEvent }
}
