import type {
  EstimatedItem,
  Payer,
  PaymentStatus,
  SplitMethod,
  SplitResult,
} from '@/types/domain'

const CENTS = 100

function roundMoney(value: number): number {
  return Math.round(value * CENTS) / CENTS
}

/**
 * Client-side mirror of the API split engine, so amounts react on the very
 * click (persisting happens in the background). MUST stay in lockstep with
 * `smart-party-api/src/engine/split.ts` + `EventsService.resolveAmounts` —
 * same integer-cent math, same remainder distribution, same rounding.
 */
export function splitWeighted(total: number, sizes: number[]): number[] {
  const totalWeight = sizes.reduce((sum, size) => sum + size, 0)
  if (totalWeight <= 0) return sizes.map(() => 0)

  const totalCents = Math.round(total * CENTS)
  const perWeight = Math.floor(totalCents / totalWeight)

  const baseCents = sizes.map((size) => size * perWeight)
  let remainder = totalCents - baseCents.reduce((sum, cents) => sum + cents, 0)

  return baseCents.map((cents) => {
    const extra = remainder > 0 ? 1 : 0
    remainder -= extra
    return (cents + extra) / CENTS
  })
}

/** Alcohol slice of the kept budget — the part only drinkers share in custom mode. */
export function alcoholTotalFromItems(items: EstimatedItem[]): number {
  return items
    .filter((item) => !item.cutByBudget && item.category === 'drink-alcoholic')
    .reduce((sum, item) => sum + item.totalPrice, 0)
}

export interface SplitPreviewInput {
  method: SplitMethod
  payers: Payer[]
  splitShares: Record<string, number>
  payments: Record<string, PaymentStatus>
  keptTotal: number
  alcoholTotal: number
}

export function computeSplitPreview({
  method,
  payers,
  splitShares,
  payments,
  keptTotal,
  alcoholTotal,
}: SplitPreviewInput): SplitResult {
  const amounts = resolveAmounts({ method, payers, splitShares, keptTotal, alcoholTotal })

  const entries = payers.map((payer, index) => ({
    name: payer.name,
    size: payer.size,
    amount: amounts[index]?.amount ?? 0,
    status: payments[payer.name] ?? ('pending' as PaymentStatus),
    breakdown: amounts[index]?.breakdown,
  }))

  const outstanding = entries
    .filter((entry) => entry.status !== 'paid')
    .reduce((sum, entry) => sum + entry.amount, 0)

  return { method, entries, total: keptTotal, outstanding: roundMoney(outstanding) }
}

function resolveAmounts({
  method,
  payers,
  splitShares,
  keptTotal,
  alcoholTotal,
}: Omit<SplitPreviewInput, 'payments'>): Array<{
  amount: number
  breakdown?: { food: number; alcohol: number; difference: number; isFixed: boolean }
}> {
  if (method === 'equal') {
    const amounts = splitWeighted(
      keptTotal,
      payers.map((payer) => payer.size),
    )
    return amounts.map((amount) => ({ amount }))
  }

  // Custom method: smart split (food by size, alcohol among drinkers) + fixed overrides.
  const foodTotal = keptTotal - alcoholTotal
  const foodShares = splitWeighted(
    foodTotal,
    payers.map((payer) => payer.size),
  )
  const alcoholShares = splitWeighted(
    alcoholTotal,
    payers.map((payer) => (payer.drinksAlcohol !== false ? payer.size : 0)),
  )
  const smartShares = payers.map((_, index) => foodShares[index] + alcoholShares[index])

  const finalAmounts = [...smartShares]
  const isFixedArray = payers.map(() => false)
  let flexibleWeight = 0

  payers.forEach((payer, index) => {
    const fixed = splitShares[payer.name]
    if (fixed !== undefined) {
      finalAmounts[index] = fixed
      isFixedArray[index] = true
    } else {
      flexibleWeight += payer.size
    }
  })

  // Whatever the fixed overrides don't cover is redistributed among the rest.
  const currentTotal = finalAmounts.reduce((sum, amount) => sum + amount, 0)
  const difference = keptTotal - currentTotal
  const differenceShares = payers.map(() => 0)

  if (Math.abs(difference) > 0.001 && flexibleWeight > 0) {
    const diffDist = splitWeighted(
      difference,
      payers.map((payer) => (splitShares[payer.name] !== undefined ? 0 : payer.size)),
    )
    payers.forEach((_, index) => {
      finalAmounts[index] += diffDist[index]
      differenceShares[index] = diffDist[index]
    })
  }

  return finalAmounts.map((amount, index) => ({
    amount: roundMoney(amount),
    breakdown: {
      food: roundMoney(foodShares[index]),
      alcohol: roundMoney(alcoholShares[index]),
      difference: roundMoney(differenceShares[index]),
      isFixed: isFixedArray[index],
    },
  }))
}
