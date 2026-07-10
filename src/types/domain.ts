export type Mood = 
  | 'classic-barbecue' 
  | 'birthday' 
  | 'intimate' 
  | 'large-event'
  | 'casual-burger'
  | 'happy-hour'
  | 'kids-party'
  | 'brunch'
  | 'pool-party'
  | 'baby-shower'

export type Appetite = 'light' | 'standard' | 'generous' | 'potluck'
export type Unit = 'kg' | 'un' | 'L'
export type ItemCategory =
  | 'meat'
  | 'drink-alcoholic'
  | 'drink-non-alcoholic'
  | 'side'
  | 'bread'
  | 'dessert'
  | 'disposable'
  | 'extra'
export type DietaryTag = 'vegan' | 'vegetarian' | 'gluten-free' | 'lactose-free'
export type SplitMethod = 'equal' | 'custom'
export type PaymentStatus = 'pending' | 'paid'

export interface Guests {
  adults: number
  children: number
  couples?: number
}

export type Restrictions = Record<DietaryTag, number>

export interface ItemOverride {
  quantity?: number
  unitPrice?: number
  removed?: boolean
}

export interface ConsumptionRule {
  itemId: string
  name: string
  category: string
  unit: Unit
  perAdult: number
  dietaryTag?: DietaryTag
  essential: boolean
  defaultUnitPrice: number
}

export interface EstimatedItem {
  itemId: string
  name: string
  category: string
  unit: Unit
  quantity: number
  unitPrice: number
  totalPrice: number
  essential: boolean
  cutByBudget?: boolean
  isCustom?: boolean
}

export interface ExtraItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

export interface Event {
  id: string
  name: string
  ownerEmail: string | null
  mood: Mood
  guests: Guests
  restrictions: Restrictions
  appetite: Appetite
  itemOverrides: Record<string, ItemOverride>
  extraItems: ExtraItem[]
  budgetCap: number | null
  notes: string | null
  splitMethod: SplitMethod
  pixKey: string | null
  payers: Payer[]
  splitShares: Record<string, number>
  payments: Record<string, PaymentStatus>
  finalizedAt: string | null
  createdAt: string
  updatedAt: string
}

/** Event enriched with its derived total — returned by the list endpoint. */
export type EventSummary = Event & { estimatedTotal: number }

export interface Payer {
  name: string
  size: number
}

export interface SplitEntry {
  name: string
  size: number
  amount: number
  status: PaymentStatus
}

export interface SplitResult {
  method: SplitMethod
  entries: SplitEntry[]
  total: number
  outstanding: number
}

export interface BudgetResult {
  items: EstimatedItem[]
  keptTotal: number
  cutTotal: number
  withinBudget: boolean
}

export interface RemovedItem {
  itemId: string
  name: string
}

export interface EventEstimate {
  event: Event
  budget: BudgetResult
  split: SplitResult
  removedItems: RemovedItem[]
}
