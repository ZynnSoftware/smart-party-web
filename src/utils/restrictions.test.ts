import { describe, expect, it } from 'vitest'
import type { Restrictions } from '@/types/domain'
import { activeRestrictionLabels } from './restrictions'

const NONE: Restrictions = {
  vegan: 0,
  vegetarian: 0,
  'gluten-free': 0,
  'lactose-free': 0,
}

describe('activeRestrictionLabels', () => {
  it('returns an empty array when no restriction has guests', () => {
    expect(activeRestrictionLabels(NONE)).toEqual([])
  })

  it('lists only the tags with at least one guest, as ptBr labels', () => {
    expect(activeRestrictionLabels({ ...NONE, vegan: 2, 'gluten-free': 1 })).toEqual([
      'Vegano',
      'Sem glúten',
    ])
  })
})
