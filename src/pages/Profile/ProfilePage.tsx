import { useEffect, useState } from 'react'
import { useUser, SignOutButton } from '@clerk/clerk-react'
import { TopBar } from '@/components/TopBar'
import { Icon } from '@/components/ui/Icon'
import { useEvents } from '@/hooks/useEvents'
import { getUserProfile } from '@/services/auth'
import { createPortalSession } from '@/services/stripe'
import { formatBRL } from '@/utils/money'
import { useToast } from '@/contexts/ToastContext'
import { useTheme } from '@/contexts/ThemeContext'
import { SubscriptionModal } from '@/components/SubscriptionModal'
export function ProfilePage() {
  const { user } = useUser()
  const { events, isLoading } = useEvents()
  const { showToast } = useToast()
  const { theme, toggleTheme } = useTheme()
  
  const [isPremium, setIsPremium] = useState(false)
  const [isManaging, setIsManaging] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    getUserProfile()
      .then((profile) => setIsPremium(profile.subscriptionStatus === 'active'))
      .catch((err) => console.error('Failed to load user profile', err))
  }, [])

  const handleManageSubscription = async () => {
    if (!isPremium) {
      setIsModalOpen(true)
      return
    }

    setIsManaging(true)
    try {
      const url = await createPortalSession()
      window.location.href = url
    } catch (error: any) {
      if (error.response?.data?.message === 'Nenhuma assinatura encontrada.') {
        showToast('Você ainda não possui uma assinatura.', 'error')
      } else {
        showToast('Erro ao abrir o portal de assinaturas.', 'error')
      }
    } finally {
      setIsManaging(false)
    }
  }

  // Calculate Stats
  const totalEvents = events.length
  const totalGuests = events.reduce((acc, ev) => acc + ev.guests.adults + ev.guests.children, 0)
  const totalBudget = events.reduce((acc, ev) => acc + ev.estimatedTotal, 0)

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-2xl pb-16 [animation:var(--animate-fade-in)]">
        
        {/* Hero Section */}
        <div className="relative rounded-b-[40px] bg-surface-container-lowest px-6 pb-12 pt-8 text-center shadow-sm border-b border-outline-variant/30">
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-5">
              <img 
                src={user?.imageUrl} 
                alt="Profile" 
                className="h-28 w-28 rounded-full border-4 border-surface shadow-xl"
              />
              {isPremium && (
                <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg ring-4 ring-surface">
                  <Icon name="sparkles" size={16} />
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-on-surface">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Convidado VIP'}
            </h1>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">{user?.primaryEmailAddress?.emailAddress}</p>
            
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface/50 px-4 py-1.5 text-sm font-bold tracking-wide text-primary shadow-sm backdrop-blur-md">
              <Icon name={isPremium ? 'sparkles' : 'party'} size={16} />
              {isPremium ? 'ASSINANTE PRO' : 'PLANO GRATUITO'}
            </div>
          </div>
        </div>

        <div className="relative z-20 -mt-8 px-5">
          {/* Responsive Grid Stats */}
          <div className="grid grid-cols-2 gap-3 pb-6 sm:grid-cols-3">
            
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-outline-variant/30 bg-surface-container-lowest p-4 text-center shadow-[var(--shadow-card)]">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container text-tertiary">
                <Icon name="party" size={20} />
              </div>
              <p className="text-2xl font-black text-on-surface sm:text-3xl">{isLoading ? '-' : totalEvents}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant sm:text-[11px]">Festas</p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-[24px] border border-outline-variant/30 bg-surface-container-lowest p-4 text-center shadow-[var(--shadow-card)]">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-secondary">
                <Icon name="users" size={20} />
              </div>
              <p className="text-2xl font-black text-on-surface sm:text-3xl">{isLoading ? '-' : totalGuests}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant sm:text-[11px]">Convidados</p>
            </div>

            <div className="col-span-2 flex flex-col items-center justify-center rounded-[24px] border border-outline-variant/30 bg-surface-container-lowest p-4 text-center shadow-[var(--shadow-card)] sm:col-span-1">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-primary">
                <Icon name="wallet" size={20} />
              </div>
              <p className="text-2xl font-black tracking-tighter text-on-surface sm:text-3xl">{isLoading ? '-' : formatBRL(totalBudget).replace('R$', '').trim()}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant sm:text-[11px]">Gerenciados</p>
            </div>

          </div>

          {/* Settings iOS Style List */}
          <div className="mt-2 flex flex-col gap-3">
            <h2 className="px-3 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/70">Configurações</h2>
            
            <div className="overflow-hidden rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
              
              {/* Theme Toggle Row */}
              <button 
                onClick={toggleTheme}
                className="flex w-full items-center justify-between border-b border-outline-variant/20 px-5 py-4 transition-colors hover:bg-surface-container-low active:bg-surface-container"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant">
                    <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-on-surface">Aparência</p>
                    <p className="text-xs font-medium text-on-surface-variant">{theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</p>
                  </div>
                </div>
                {/* Native-like switch */}
                <div className={`relative flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-primary' : 'bg-surface-variant'}`}>
                  <span className={`absolute h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
              </button>

              {/* Subscription Row */}
              <button 
                onClick={handleManageSubscription}
                disabled={isManaging}
                className="flex w-full items-center justify-between border-b border-outline-variant/20 px-5 py-4 transition-colors hover:bg-surface-container-low active:bg-surface-container disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon name="receipt" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-on-surface">Assinatura</p>
                    <p className="text-xs font-medium text-on-surface-variant">{isPremium ? 'Gerenciar pagamento e fatura' : 'Faça upgrade para ilimitado'}</p>
                  </div>
                </div>
                <Icon name="arrow-right" size={20} className="text-on-surface-variant" />
              </button>

              {/* Sign Out Row */}
              <SignOutButton>
                <button className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-error-container/20 active:bg-error-container/40">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-error/10 text-error">
                      <Icon name="close" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-error">Sair da conta</p>
                      <p className="text-xs font-medium text-error/70">Desconectar do aplicativo</p>
                    </div>
                  </div>
                </button>
              </SignOutButton>

            </div>
          </div>

        </div>
      </main>

      <SubscriptionModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
