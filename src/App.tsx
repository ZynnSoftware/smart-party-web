import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, matchPath, Route, Routes, useLocation } from 'react-router-dom'
import { AppRoutes, APP_ROUTE_PATHS } from './AppRoutes'
import { RequireAuth } from './auth/RequireAuth'
import { JoinEventPage } from './pages/JoinEvent/JoinEventPage'
import { NotFoundPage } from './pages/NotFound/NotFoundPage'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { WizardProvider } from './contexts/WizardContext'
import { usePageTracking } from './hooks/usePageTracking'

function PageTracker() {
  usePageTracking()
  return null
}

/** Renders NotFoundPage for unmapped URLs before the auth gate runs, so a bad
 * link 404s for everyone instead of showing the signed-out landing. */
function AuthenticatedApp() {
  const location = useLocation()
  const isKnownRoute = APP_ROUTE_PATHS.some((pattern) => matchPath(pattern, location.pathname))

  if (!isKnownRoute) return <NotFoundPage />

  return (
    <RequireAuth>
      <WizardProvider>
        <AppRoutes />
      </WizardProvider>
    </RequireAuth>
  )
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
              <Route path="*" element={<AuthenticatedApp />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
