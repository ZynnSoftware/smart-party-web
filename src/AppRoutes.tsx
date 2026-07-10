import { Navigate, Route, Routes } from 'react-router-dom'
import { EventsListPage } from '@/pages/Events/EventsListPage'
import { WizardLayout } from '@/pages/Wizard/WizardLayout'
import { MoodStep } from '@/pages/Wizard/steps/MoodStep'
import { GuestsStep } from '@/pages/Wizard/steps/GuestsStep'
import { NotesStep } from '@/pages/Wizard/steps/NotesStep'
import { ItemsStep } from '@/pages/Wizard/steps/ItemsStep'
import { BudgetStep } from '@/pages/Wizard/steps/BudgetStep'
import { SplitStep } from '@/pages/Wizard/steps/SplitStep/index'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EventsListPage />} />
      <Route element={<WizardLayout />}>
        <Route path="/new" element={<MoodStep />} />
        <Route path="/events/:id/guests" element={<GuestsStep />} />
        <Route path="/events/:id/notes" element={<NotesStep />} />
        <Route path="/events/:id/items" element={<ItemsStep />} />
        <Route path="/events/:id/budget" element={<BudgetStep />} />
        <Route path="/events/:id/split" element={<SplitStep />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

