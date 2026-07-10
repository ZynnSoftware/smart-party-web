import type { IconName } from '@/components/ui/Icon'
import type { Appetite } from '@/types/domain'

export interface AppetiteOption {
  appetite: Appetite
  label: string
  hint: string
  icon: IconName
}

export const APPETITE_OPTIONS: AppetiteOption[] = [
  {
    appetite: 'light',
    label: 'Só o essencial',
    hint: 'Comem pouco, sem desperdício',
    icon: 'minus',
  },
  {
    appetite: 'standard',
    label: 'Comem bem',
    hint: 'Consumo de festa, equilibrado',
    icon: 'party',
  },
  {
    appetite: 'generous',
    label: 'Melhor sobrar',
    hint: 'Prefiro que sobre a faltar',
    icon: 'sparkles',
  },
  {
    appetite: 'potluck',
    label: 'Cada um traz algo',
    hint: 'Potluck: todos contribuem',
    icon: 'users',
  },
]

export const DEFAULT_APPETITE: Appetite = 'standard'
