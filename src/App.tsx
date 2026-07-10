import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { WizardProvider } from './contexts/WizardContext'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <WizardProvider>
            <AppRoutes />
          </WizardProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
