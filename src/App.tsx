import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { RequireAuth } from './auth/RequireAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { WizardProvider } from './contexts/WizardContext'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <RequireAuth>
            <WizardProvider>
              <AppRoutes />
            </WizardProvider>
          </RequireAuth>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
