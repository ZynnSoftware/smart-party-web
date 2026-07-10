import type { Event } from '@/types/domain'

export interface EventStage {
  /** 1-based position of the furthest step the host has reached. */
  index: number
  total: number
  label: string
  isDone: boolean
}

export const STAGE_TOTAL = 5

/**
 * Infers how far along the planning wizard an event is, from the data it already
 * stores — the Event has no explicit step field. Order mirrors the wizard flow:
 * Convidados -> Considerações -> Lista -> Orçamento -> Divisão.
 */
export function eventStage(event: Event): EventStage {
  if (event.finalizedAt) {
    return { index: STAGE_TOTAL, total: STAGE_TOTAL, label: 'Concluído', isDone: true }
  }

  const hasSplit = event.payers.length > 0 || Object.keys(event.splitShares).length > 0
  const hasBudget = event.budgetCap !== null
  const hasItems =
    event.extraItems.length > 0 || Object.keys(event.itemOverrides).length > 0
  const hasNotes = Boolean(event.notes && event.notes.trim())

  if (hasSplit) return { index: 5, total: STAGE_TOTAL, label: 'Divisão', isDone: false }
  if (hasBudget) return { index: 4, total: STAGE_TOTAL, label: 'Orçamento', isDone: false }
  if (hasItems) return { index: 3, total: STAGE_TOTAL, label: 'Lista', isDone: false }
  if (hasNotes) return { index: 2, total: STAGE_TOTAL, label: 'Considerações', isDone: false }
  return { index: 1, total: STAGE_TOTAL, label: 'Convidados', isDone: false }
}
