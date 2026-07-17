import { useCallback, useEffect, useState } from 'react'
import { eventsService } from '@/services/events'
import type { EventCollaborator } from '@/types/domain'

interface UseCollaboratorsResult {
  collaborators: EventCollaborator[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  regenerateLink: () => Promise<string | null>
  removeCollaborator: (collaboratorId: string) => Promise<void>
}

const LOAD_ERROR = 'Não foi possível carregar os colaboradores.'

/** Fetches who has view access to an event and exposes the sharing actions. */
export function useCollaborators(eventId: string | undefined): UseCollaboratorsResult {
  const [collaborators, setCollaborators] = useState<EventCollaborator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!eventId) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await eventsService.listCollaborators(eventId)
      setCollaborators(result)
    } catch {
      setError(LOAD_ERROR)
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const regenerateLink = useCallback(async (): Promise<string | null> => {
    if (!eventId) return null
    const event = await eventsService.regenerateInviteToken(eventId)
    return event.inviteToken
  }, [eventId])

  const removeCollaborator = useCallback(
    async (collaboratorId: string) => {
      if (!eventId) return
      await eventsService.removeCollaborator(eventId, collaboratorId)
      await refresh()
    },
    [eventId, refresh],
  )

  return { collaborators, isLoading, error, refresh, regenerateLink, removeCollaborator }
}
