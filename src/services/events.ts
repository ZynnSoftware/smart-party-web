import { api } from './api'
import type { Event, EventEstimate, EventSummary } from '@/types/domain'

export interface CreateEventPayload {
  name: string
  mood: Event['mood']
  guests: Event['guests']
  restrictions: Event['restrictions']
  budgetCap?: number
}

export type UpdateEventPayload = Partial<
  Pick<
    Event,
    | 'name'
    | 'mood'
    | 'guests'
    | 'restrictions'
    | 'appetite'
    | 'itemOverrides'
    | 'extraItems'
    | 'notes'
    | 'budgetCap'
    | 'splitMethod'
    | 'pixKey'
    | 'payers'
    | 'splitShares'
    | 'payments'
  >
>

async function create(payload: CreateEventPayload): Promise<Event> {
  const { data } = await api.post<Event>('/events', payload)
  return data
}

async function update(id: string, payload: UpdateEventPayload): Promise<Event> {
  const { data } = await api.patch<Event>(`/events/${id}`, payload)
  return data
}

async function getById(id: string): Promise<Event> {
  const { data } = await api.get<Event>(`/events/${id}`)
  return data
}

async function getEstimate(id: string): Promise<EventEstimate> {
  const { data } = await api.get<EventEstimate>(`/events/${id}/estimate`)
  return data
}

async function list(): Promise<EventSummary[]> {
  const { data } = await api.get<EventSummary[]>('/events')
  return data
}

async function remove(id: string): Promise<void> {
  await api.delete(`/events/${id}`)
}

async function finalize(id: string): Promise<Event> {
  const { data } = await api.post<Event>(`/events/${id}/finalize`)
  return data
}

async function toggleChecklist(id: string, itemId: string): Promise<Event> {
  const { data } = await api.patch<Event>(`/events/${id}/checklist`, { itemId })
  return data
}

async function togglePayment(id: string, payerName: string): Promise<Event> {
  const { data } = await api.patch<Event>(`/events/${id}/payments`, { payerName })
  return data
}

export const eventsService = {
  create,
  update,
  getById,
  getEstimate,
  list,
  remove,
  finalize,
  toggleChecklist,
  togglePayment,
}
