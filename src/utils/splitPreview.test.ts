import { describe, expect, it } from 'vitest'
import {
  alcoholTotalFromItems,
  computeSplitPreview,
  splitWeighted,
} from './splitPreview'
import type { EstimatedItem, Payer } from '@/types/domain'

const PERSON = 1
const COUPLE = 2

function makePayer(name: string, size = PERSON, drinksAlcohol?: boolean): Payer {
  return { name, size, drinksAlcohol }
}

describe('splitWeighted', () => {
  it('weights a couple as two shares and adds back to the total', () => {
    const shares = splitWeighted(90, [COUPLE, PERSON])
    expect(shares).toEqual([60, 30])
    expect(shares.reduce((sum, share) => sum + share, 0)).toBe(90)
  })

  it('hands remainder cents to the first payers so the sum is exact', () => {
    const shares = splitWeighted(100, [PERSON, PERSON, PERSON])
    expect(shares.reduce((sum, share) => sum + share, 0)).toBe(100)
    const spreadInCents = Math.round((Math.max(...shares) - Math.min(...shares)) * 100)
    expect(spreadInCents).toBeLessThanOrEqual(1)
  })

  it('returns zeros when there is no weight', () => {
    expect(splitWeighted(100, [0, 0])).toEqual([0, 0])
  })
})

describe('alcoholTotalFromItems', () => {
  it('sums only alcoholic drinks that were not cut by the budget', () => {
    const items = [
      { category: 'drink-alcoholic', totalPrice: 40, cutByBudget: false },
      { category: 'drink-alcoholic', totalPrice: 25, cutByBudget: true },
      { category: 'meat', totalPrice: 100, cutByBudget: false },
    ] as EstimatedItem[]
    expect(alcoholTotalFromItems(items)).toBe(40)
  })
})

describe('computeSplitPreview', () => {
  it('splits equally weighted by size', () => {
    const preview = computeSplitPreview({
      method: 'equal',
      payers: [makePayer('Casal', COUPLE), makePayer('Solo')],
      splitShares: {},
      payments: {},
      keptTotal: 90,
      alcoholTotal: 30,
    })
    expect(preview.entries.map((entry) => entry.amount)).toEqual([60, 30])
  })

  it('charges alcohol only to drinkers in custom mode', () => {
    const preview = computeSplitPreview({
      method: 'custom',
      payers: [makePayer('Bebe', PERSON, true), makePayer('Só Refri', PERSON, false)],
      splitShares: {},
      payments: {},
      keptTotal: 100,
      alcoholTotal: 40,
    })
    const [drinker, sober] = preview.entries
    expect(drinker.amount).toBe(70) // 30 food + 40 alcohol
    expect(sober.amount).toBe(30) // food only
    expect(sober.breakdown?.alcohol).toBe(0)
  })

  it('respects a fixed share and redistributes the difference', () => {
    const preview = computeSplitPreview({
      method: 'custom',
      payers: [makePayer('Fixo'), makePayer('Flex A'), makePayer('Flex B')],
      splitShares: { Fixo: 10 },
      payments: {},
      keptTotal: 90,
      alcoholTotal: 0,
    })
    const [fixed, flexA, flexB] = preview.entries
    expect(fixed.amount).toBe(10)
    expect(fixed.breakdown?.isFixed).toBe(true)
    expect(flexA.amount + flexB.amount).toBe(80)
  })

  it('excludes paid entries from the outstanding total', () => {
    const preview = computeSplitPreview({
      method: 'equal',
      payers: [makePayer('Pago'), makePayer('Devendo')],
      splitShares: {},
      payments: { Pago: 'paid' },
      keptTotal: 100,
      alcoholTotal: 0,
    })
    expect(preview.outstanding).toBe(50)
  })
})
