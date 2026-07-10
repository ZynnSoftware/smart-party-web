import { createContext, useCallback, useContext, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'

type ToastVariant = 'success' | 'error'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION = 2_600
const VARIANT_ICON: Record<ToastVariant, IconName> = {
  success: 'check',
  error: 'close',
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, message, variant }])
      window.setTimeout(
        () => setToasts((current) => current.filter((toast) => toast.id !== id)),
        TOAST_DURATION,
      )
    },
    [],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-[var(--shadow-floating)] [animation:var(--animate-rise)] ${
              toast.variant === 'error'
                ? 'bg-error text-on-error'
                : 'bg-on-surface text-surface'
            }`}
          >
            <Icon name={VARIANT_ICON[toast.variant]} size={16} />
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
