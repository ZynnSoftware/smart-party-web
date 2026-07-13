import { SignInButton } from '@clerk/clerk-react'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export function SignedOutLanding() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-surface-container-lowest">
      <TopBar />
      
      {/* Premium ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 h-[250px] w-[250px] translate-x-1/4 rounded-full bg-primary/20 blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 h-[250px] w-[250px] -translate-x-1/4 rounded-full bg-tertiary/20 blur-[80px]" />
      </div>

      <main className="flex flex-1 flex-col px-6 pb-10 pt-4 [animation:var(--animate-fade-in)]">
        
        {/* Main Central Content */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-tr from-primary to-tertiary shadow-xl">
            <div className="absolute inset-[3px] rounded-[25px] bg-surface-container-lowest/90 backdrop-blur-sm" />
            <Icon name="party" size={48} className="relative z-10 text-primary" />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight text-on-surface sm:text-5xl">
            Smart Party
          </h1>
          <p className="mt-3 max-w-[280px] text-base font-medium text-on-surface-variant">
            O único assistente que você precisa para planejar, calcular e dividir a conta da sua festa.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-[300px]">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low p-4">
              <Icon name="sparkles" size={24} className="mb-2 text-primary" />
              <span className="text-xs font-bold uppercase text-on-surface-variant">IA Integrada</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low p-4">
              <Icon name="wallet" size={24} className="mb-2 text-tertiary" />
              <span className="text-xs font-bold uppercase text-on-surface-variant">Rateio PIX</span>
            </div>
          </div>

        </div>
        
        {/* Single Practical CTA */}
        <div className="mt-auto">
          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <Button size="lg" icon="arrow-right" className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20">
              Começar a organizar
            </Button>
          </SignInButton>
          <p className="mt-4 text-center text-xs font-medium text-on-surface-variant/70">
            Rápido, seguro e gratuito para começar.
          </p>
        </div>

      </main>
    </div>
  )
}
