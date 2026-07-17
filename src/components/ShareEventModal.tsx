import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useCollaborators } from '@/hooks/useCollaborators'
import { useToast } from '@/contexts/ToastContext'

interface ShareEventModalProps {
  eventId: string
  inviteToken: string | null
  onClose: () => void
  onTokenChange: (token: string | null) => void
}

function buildInviteLink(eventId: string, token: string): string {
  return `${window.location.origin}/events/${eventId}/join?token=${token}`
}

/** Lets the owner share a read-only invite link and manage who has access. */
export function ShareEventModal({ eventId, inviteToken, onClose, onTokenChange }: ShareEventModalProps) {
  const { collaborators, isLoading, regenerateLink, removeCollaborator } = useCollaborators(eventId)
  const { showToast } = useToast()
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [confirmRegenerate, setConfirmRegenerate] = useState(false)
  const [collaboratorToRemove, setCollaboratorToRemove] = useState<string | null>(null)

  const handleGenerateOrRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const token = await regenerateLink()
      onTokenChange(token)
    } catch {
      showToast('Erro ao gerar o link de convite')
    } finally {
      setIsRegenerating(false)
      setConfirmRegenerate(false)
    }
  }

  const handleCopy = async () => {
    if (!inviteToken) return
    await navigator.clipboard.writeText(buildInviteLink(eventId, inviteToken))
    showToast('Link copiado!')
  }

  const handleRemove = async (collaboratorId: string) => {
    try {
      await removeCollaborator(collaboratorId)
    } catch {
      showToast('Erro ao remover colaborador')
    } finally {
      setCollaboratorToRemove(null)
    }
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 p-5 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        className="w-full max-w-md rounded-[32px] bg-surface-container-lowest p-6 shadow-[var(--shadow-floating)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface">Compartilhar evento</h2>
          <button onClick={onClose} className="cursor-pointer text-on-surface-variant hover:text-on-surface">
            <Icon name="close" size={20} />
          </button>
        </div>

        <p className="mb-4 text-sm text-on-surface-variant">
          Quem abrir o link precisa entrar com uma conta e passa a ver este evento, sem poder editar.
        </p>

        {inviteToken ? (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3">
            <span className="flex-1 truncate text-sm text-on-surface-variant">
              {buildInviteLink(eventId, inviteToken)}
            </span>
            <button onClick={handleCopy} className="cursor-pointer text-primary hover:text-primary/80" aria-label="Copiar link">
              <Icon name="copy" size={18} />
            </button>
          </div>
        ) : (
          <p className="mb-4 text-sm text-on-surface-variant/70">Nenhum link gerado ainda.</p>
        )}

        <Button
          variant="secondary"
          icon="share"
          loading={isRegenerating}
          onClick={() => (inviteToken ? setConfirmRegenerate(true) : handleGenerateOrRegenerate())}
          className="w-full"
        >
          {inviteToken ? 'Gerar novo link' : 'Gerar link'}
        </Button>

        <div className="mt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Quem pode ver este evento
          </p>
          {isLoading ? (
            <p className="text-sm text-on-surface-variant">Carregando...</p>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-on-surface-variant/70">Ninguém entrou pelo link ainda.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {collaborators.map((collaborator) => (
                <li
                  key={collaborator.id}
                  className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-2.5"
                >
                  <span className="truncate text-sm font-medium text-on-surface">
                    {collaborator.collaboratorEmail}
                  </span>
                  <button
                    onClick={() => setCollaboratorToRemove(collaborator.id)}
                    className="cursor-pointer text-on-surface-variant hover:text-error"
                    aria-label="Remover acesso"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmRegenerate}
        title="Gerar novo link?"
        description="O link atual deixa de funcionar. Quem já tem acesso continua vendo o evento normalmente."
        confirmLabel="Gerar novo link"
        onConfirm={handleGenerateOrRegenerate}
        onCancel={() => setConfirmRegenerate(false)}
      />

      <ConfirmDialog
        open={collaboratorToRemove !== null}
        title="Remover acesso?"
        description="Essa pessoa não vai mais conseguir ver este evento."
        confirmLabel="Remover"
        danger
        onConfirm={() => collaboratorToRemove && handleRemove(collaboratorToRemove)}
        onCancel={() => setCollaboratorToRemove(null)}
      />
    </div>
  )
}
