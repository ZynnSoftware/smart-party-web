import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import {
  eventsService,
  type CreateEventPayload,
  type UpdateEventPayload,
} from '@/services/events'
import type { Event } from '@/types/domain'

interface WizardContextValue {
  event: Event | null
  isSaving: boolean
  error: string | null
  startDraft: (payload: CreateEventPayload) => Promise<Event>
  patch: (payload: UpdateEventPayload) => Promise<Event | null>
  loadEvent: (id: string) => Promise<Event>
}

const WizardContext = createContext<WizardContextValue | null>(null)

const SAVE_ERROR = 'Não foi possível salvar. Verifique a conexão com a API.'

export function WizardProvider({ children }: PropsWithChildren) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startDraft = useCallback(async (payload: CreateEventPayload) => {
    setIsSaving(true)
    setError(null)
    try {
      const created = await eventsService.create(payload)
      setEvent(created)
      return created
    } catch {
      setError(SAVE_ERROR)
      throw new Error(SAVE_ERROR)
    } finally {
      setIsSaving(false)
    }
  }, [])

  const patch = useCallback(
    async (payload: UpdateEventPayload) => {
      if (!event) return null
      setIsSaving(true)
      setError(null)
      try {
        const updated = await eventsService.update(event.id, payload)
        setEvent(updated)
        return updated
      } catch {
        setError(SAVE_ERROR)
        return null
      } finally {
        setIsSaving(false)
      }
    },
    [event],
  )

  const loadEvent = useCallback(async (id: string) => {
    const loaded = await eventsService.getById(id)
    setEvent(loaded)
    return loaded
  }, [])

  const value = useMemo(
    () => ({ event, isSaving, error, startDraft, patch, loadEvent }),
    [event, isSaving, error, startDraft, patch, loadEvent],
  )

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext)
  if (!context) throw new Error('useWizard must be used within a WizardProvider')
  return context
}
