import { useEffect } from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Social Hearth confirmation modal: blurred backdrop, floating rounded card. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      role="presentation"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 p-5 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-surface-container-lowest p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.1)]"
      >
        <h2 id="confirm-dialog-title" className="mb-2 text-lg font-bold">
          {title}
        </h2>
        {description && (
          <p className="mb-6 text-sm text-on-surface-variant">{description}</p>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
