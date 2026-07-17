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
  | 'new-years'
  | 'wedding'
  | 'graduation'
  | 'family-lunch'
  | 'office-party'
  | 'rooftop'
  | 'game-night'
  | 'picnic'
  | 'halloween'
  | 'secret-santa'

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
  excludedForTags?: DietaryTag[]
  essential: boolean
  defaultUnitPrice: number
}

/** Estimated per-unit market price band, in BRL. Heuristic, not live data. */
export interface PriceRange {
  min: number
  max: number
}

export interface EstimatedItem {
  itemId: string
  name: string
  category: string
  unit: Unit
  quantity: number
  unitPrice: number
  totalPrice: number
  /** Estimated per-unit price band around unitPrice. Optional for older payloads. */
  priceRange?: PriceRange
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
  purchasedItems: string[]
  finalizedAt: string | null
  /** Current invite link token; null when never shared or on a collaborator's view. */
  inviteToken: string | null
  createdAt: string
  updatedAt: string
}

export interface EventCollaborator {
  id: string
  eventId: string
  collaboratorEmail: string
  createdAt: string
}

/** Event enriched with its derived total — returned by the list endpoint. */
export type EventSummary = Event & { estimatedTotal: number }

export interface Payer {
  id?: string
  name: string
  size: number
  drinksAlcohol?: boolean
}

export interface SplitEntry {
  name: string
  size: number
  amount: number
  status: PaymentStatus
  breakdown?: {
    food: number
    alcohol: number
    difference: number
    isFixed: boolean
  }
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
