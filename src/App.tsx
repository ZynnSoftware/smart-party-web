import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { RequireAuth } from './auth/RequireAuth'
import { JoinEventPage } from './pages/JoinEvent/JoinEventPage'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { WizardProvider } from './contexts/WizardContext'
import { usePageTracking } from './hooks/usePageTracking'

function PageTracker() {
  usePageTracking()
  return null
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <PageTracker />
            <Routes>
              {/* Outside the global auth gate: it handles signed-out visitors
                  itself so the invite link survives the sign-in round trip. */}
              <Route path="/events/:id/join" element={<JoinEventPage />} />
              <Route
                path="*"
                element={
                  <RequireAuth>
                    <WizardProvider>
                      <AppRoutes />
                    </WizardProvider>
                  </RequireAuth>
                }
              />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
