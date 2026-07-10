import { describe, expect, it } from 'vitest'
import { formatBRL, formatQuantity } from './money'

describe('formatBRL', () => {
  it('formats a value as Brazilian currency', () => {
    // Non-breaking spaces are used by Intl; normalize before asserting.
    expect(formatBRL(48.33).replace(/ /g, ' ')).toBe('R$ 48,33')
  })

  it('formats zero', () => {
    expect(formatBRL(0).replace(/ /g, ' ')).toBe('R$ 0,00')
  })
})

describe('formatQuantity', () => {
  it('appends the unit and uses pt-BR decimals', () => {
    expect(formatQuantity(4.4, 'kg')).toBe('4,4 kg')
  })
})
