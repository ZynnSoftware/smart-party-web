import { describe, expect, it } from 'vitest'
import type { Event } from '@/types/domain'
import { eventStage } from './eventStage'

const baseEvent: Event = {
  id: 'evt-1',
  name: 'Festa',
  ownerEmail: null,
  mood: 'classic-barbecue',
  guests: { adults: 8, children: 0 },
  restrictions: { vegan: 0, vegetarian: 0, 'gluten-free': 0, 'lactose-free': 0 },
  appetite: 'standard',
  itemOverrides: {},
  extraItems: [],
  budgetCap: null,
  notes: null,
  splitMethod: 'equal',
  pixKey: null,
  payers: [],
  splitShares: {},
  payments: {},
  purchasedItems: [],
  finalizedAt: null,
  inviteToken: null,
  createdAt: '2026-07-01T12:00:00.000Z',
  updatedAt: '2026-07-01T12:00:00.000Z',
}

describe('eventStage', () => {
  it('starts at Convidados for a freshly created event', () => {
    expect(eventStage(baseEvent)).toMatchObject({ index: 1, label: 'Convidados', isDone: false })
  })

  it('advances to Considerações once notes are filled', () => {
    expect(eventStage({ ...baseEvent, notes: 'Bastante gelo' })).toMatchObject({
      index: 2,
      label: 'Considerações',
    })
  })

  it('advances to Lista when items are customized', () => {
    expect(eventStage({ ...baseEvent, itemOverrides: { picanha: { quantity: 3 } } })).toMatchObject({
      index: 3,
      label: 'Lista',
    })
  })

  it('advances to Orçamento when a budget cap is set', () => {
    expect(eventStage({ ...baseEvent, budgetCap: 500 })).toMatchObject({
      index: 4,
      label: 'Orçamento',
    })
  })

  it('advances to Divisão once there are payers', () => {
    expect(eventStage({ ...baseEvent, payers: [{ name: 'Ana', size: 1 }] })).toMatchObject({
      index: 5,
      label: 'Divisão',
    })
  })

  it('reports done when the event is finalized', () => {
    expect(
      eventStage({ ...baseEvent, finalizedAt: '2026-07-05T12:00:00.000Z' }),
    ).toMatchObject({ index: 5, label: 'Concluído', isDone: true })
  })

  it('uses the furthest reached step, not the earliest', () => {
    expect(
      eventStage({ ...baseEvent, notes: 'oi', budgetCap: 300 }),
    ).toMatchObject({ index: 4, label: 'Orçamento' })
  })
})
