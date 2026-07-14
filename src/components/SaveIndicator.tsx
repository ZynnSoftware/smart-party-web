import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useWizard } from '@/contexts/WizardContext'

const SAVED_BADGE_VISIBLE_MS = 1600

type IndicatorState = 'idle' | 'saving' | 'saved'

/**
 * Floating pill showing the wizard autosave status. Every quantity tweak fires
 * a PATCH; without feedback, a slow network reads as a frozen app. "Salvando…"
 * appears while a request is in flight and "Salvo" lingers briefly after.
 */
export function SaveIndicator() {
  const { isSaving, error } = useWizard()
  const [state, setState] = useState<IndicatorState>('idle')
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isSaving) {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      setState('saving')
      return
    }

    // Only celebrate transitions out of an actual save, never on mount.
    setState((current) => (current === 'saving' && !error ? 'saved' : 'idle'))
  }, [isSaving, error])

  useEffect(() => {
    if (state !== 'saved') return
    hideTimer.current = setTimeout(() => setState('idle'), SAVED_BADGE_VISIBLE_MS)
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [state])

  if (state === 'idle') return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-5 top-20 z-50 flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-lowest/90 px-4 py-2 text-sm font-semibold shadow-[var(--shadow-card)] backdrop-blur-md [animation:var(--animate-pop-in)]"
    >
      {state === 'saving' ? (
        <>
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="text-on-surface-variant">Salvando…</span>
        </>
      ) : (
        <>
          <Icon name="check" size={16} className="text-tertiary" />
          <span className="text-on-surface">Salvo</span>
        </>
      )}
    </div>
  )
}
