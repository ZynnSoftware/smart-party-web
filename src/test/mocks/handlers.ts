import { http, HttpResponse } from 'msw'
import type { EventEstimate, EventSummary } from '@/types/domain'

const API_URL = 'http://localhost:3000'

export const eventSummaryFixture: EventSummary = {
  id: 'evt-1',
  name: 'Churras de teste',
  ownerEmail: null,
  mood: 'classic-barbecue',
  guests: { adults: 8, children: 2 },
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
  finalizedAt: null,
  estimatedTotal: 254.4,
  createdAt: '2026-07-01T12:00:00.000Z',
  updatedAt: '2026-07-01T12:00:00.000Z',
}

export const estimateFixture: EventEstimate = {
  event: eventSummaryFixture,
  budget: {
    items: [
      {
        itemId: 'picanha',
        name: 'Picanha',
        category: 'meat',
        unit: 'kg',
        quantity: 2.25,
        unitPrice: 90,
        totalPrice: 202.5,
        essential: true,
        cutByBudget: false,
      },
    ],
    keptTotal: 202.5,
    cutTotal: 0,
    withinBudget: true,
  },
  split: {
    method: 'equal',
    entries: [{ name: 'Convidado 1', size: 1, amount: 202.5, status: 'pending' }],
    total: 202.5,
    outstanding: 202.5,
  },
  removedItems: [],
}

export const handlers = [
  http.get(`${API_URL}/events`, () =>
    HttpResponse.json<EventSummary[]>([eventSummaryFixture]),
  ),
  http.get(`${API_URL}/events/:id/estimate`, () =>
    HttpResponse.json<EventEstimate>(estimateFixture),
  ),
  http.delete(`${API_URL}/events/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${API_URL}/events/:id/finalize`, () =>
    HttpResponse.json({
      ...eventSummaryFixture,
      finalizedAt: '2026-07-02T10:00:00.000Z',
    }),
  ),
]
