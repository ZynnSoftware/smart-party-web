import type { DietaryTag, Restrictions } from '@/types/domain'

export const DIETARY_LABELS: Record<DietaryTag, string> = {
  vegan: 'Vegano',
  vegetarian: 'Vegetariano',
  'gluten-free': 'Sem glúten',
  'lactose-free': 'Sem lactose',
}

/** ptBr labels for the dietary tags that have at least one guest. */
export function activeRestrictionLabels(restrictions: Restrictions): string[] {
  return (Object.keys(DIETARY_LABELS) as DietaryTag[])
    .filter((tag) => restrictions[tag] > 0)
    .map((tag) => DIETARY_LABELS[tag])
}
