import { Route, Routes } from 'react-router-dom'
import { EventsListPage } from '@/pages/Events/EventsListPage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'
import { WizardLayout } from '@/pages/Wizard/WizardLayout'
import { MoodStep } from '@/pages/Wizard/steps/MoodStep'
import { GuestsStep } from '@/pages/Wizard/steps/GuestsStep'
import { NotesStep } from '@/pages/Wizard/steps/NotesStep'
import { ItemsStep } from '@/pages/Wizard/steps/ItemsStep'
import { BudgetStep } from '@/pages/Wizard/steps/BudgetStep'
import { SplitStep } from '@/pages/Wizard/steps/SplitStep/index'
import { SuccessPage } from '@/pages/Success'
import { CancelPage } from '@/pages/Cancel'
import { ProfilePage } from '@/pages/Profile/ProfilePage'
import { EventDashboardPage } from '@/pages/Dashboard/EventDashboardPage'
import { ShoppingModePage } from '@/pages/Shopping/ShoppingModePage'

/** Every path AppRoutes renders behind the auth gate — used to detect unmapped
 * URLs before RequireAuth runs, so a bad link 404s instead of showing the landing. */
export const APP_ROUTE_PATHS = [
  '/',
  '/profile',
  '/success',
  '/cancel',
  '/events/:id/dashboard',
  '/events/:id/shopping',
  '/new',
  '/events/:id/guests',
  '/events/:id/notes',
  '/events/:id/items',
  '/events/:id/budget',
  '/events/:id/split',
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EventsListPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/events/:id/dashboard" element={<EventDashboardPage />} />
      <Route path="/events/:id/shopping" element={<ShoppingModePage />} />
      <Route element={<WizardLayout />}>
        <Route path="/new" element={<MoodStep />} />
        <Route path="/events/:id/guests" element={<GuestsStep />} />
        <Route path="/events/:id/notes" element={<NotesStep />} />
        <Route path="/events/:id/items" element={<ItemsStep />} />
        <Route path="/events/:id/budget" element={<BudgetStep />} />
        <Route path="/events/:id/split" element={<SplitStep />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

