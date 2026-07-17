import { lazy, Suspense } from 'react'
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

// Lazy-loaded: the recipe catalog's text content is sizeable and irrelevant
// to the authenticated app, so it ships as its own chunk instead of bloating
// every route's initial bundle.
const RecipesListPage = lazy(() =>
  import('./pages/Recipes/RecipesListPage').then((m) => ({ default: m.RecipesListPage })),
)
const RecipeDetailPage = lazy(() =>
  import('./pages/Recipes/RecipeDetailPage').then((m) => ({ default: m.RecipeDetailPage })),
)

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
              <Route
                path="/receitas"
                element={
                  <Suspense fallback={null}>
                    <RecipesListPage />
                  </Suspense>
                }
              />
              <Route
                path="/receitas/:slug"
                element={
                  <Suspense fallback={null}>
                    <RecipeDetailPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<AuthenticatedApp />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
