import { SignInButton } from '@clerk/clerk-react'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { moodImage, moodLabel } from '@/utils/moods'

const STEPS = [
  {
    icon: 'party',
    title: 'Escolha o clima',
    description:
      'Churrasco, aniversário, pool party... diga o estilo e quantos convidados vêm.',
  },
  {
    icon: 'sparkles',
    title: 'A lista se monta sozinha',
    description:
      'Quantidades, preços e orçamento calculados na hora — com IA para os pedidos especiais.',
  },
  {
    icon: 'key',
    title: 'Divida no Pix',
    description:
      'Rateio justo entre pessoas e casais, cobrança pronta para mandar no WhatsApp.',
  },
] as const

const FEATURES = [
  {
    icon: 'sparkles',
    title: 'IA integrada',
    description: 'Escreva "minha sogra é vegana" e a lista se adapta sozinha.',
  },
  {
    icon: 'wallet',
    title: 'Orçamento inteligente',
    description: 'Estourou o teto? Cortamos os supérfluos e protegemos o essencial.',
  },
  {
    icon: 'users',
    title: 'Rateio justo',
    description: 'Casais, quem não bebe, valores fixos — cada um paga o que faz sentido.',
  },
  {
    icon: 'receipt',
    title: 'Preços de mercado',
    description: 'Cada item mostra a faixa estimada de preço para você não cair em cilada.',
  },
] as const

export function SignedOutLanding() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background">
      <TopBar />

      {/* Ambient brand glow, both themes. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute top-[35%] left-[-12%] h-[380px] w-[380px] rounded-full bg-tertiary-container/15 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[15%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[90px]" />
      </div>

      <main className="mx-auto max-w-6xl px-6 [animation:var(--animate-fade-in)]">
        {/* ─── Hero ─── */}
        <section className="grid items-center gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary [animation:var(--animate-rise)]">
              <Icon name="sparkles" size={14} />
              Planejador de festas com IA
            </span>

            <h1
              className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-on-surface sm:text-6xl [animation:var(--animate-rise)]"
              style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}
            >
              A festa perfeita{' '}
              <span className="bg-gradient-to-r from-primary to-tertiary-container bg-clip-text text-transparent">
                começa com um plano.
              </span>
            </h1>

            <p
              className="mx-auto mt-5 max-w-md text-lg font-medium text-on-surface-variant lg:mx-0 [animation:var(--animate-rise)]"
              style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}
            >
              Lista de compras, orçamento e divisão da conta calculados em segundos.
              Você só se preocupa em receber bem.
            </p>

            <div
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center [animation:var(--animate-rise)]"
              style={{ animationDelay: '240ms', animationFillMode: 'backwards' }}
            >
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button size="lg" icon="arrow-right" className="h-14 w-full px-8 text-lg font-bold shadow-xl shadow-primary/20 sm:w-auto">
                  Começar grátis
                </Button>
              </SignInButton>
              <a
                href="#como-funciona"
                className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-base font-bold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface sm:w-auto"
              >
                Ver como funciona
                <Icon name="chevron-down" size={18} />
              </a>
            </div>

            <p
              className="mt-5 text-sm font-medium text-on-surface-variant/70 [animation:var(--animate-rise)]"
              style={{ animationDelay: '320ms', animationFillMode: 'backwards' }}
            >
              Primeiro evento grátis · Sem cartão de crédito
            </p>
          </div>

          {/* Floating collage of real product moods. */}
          <div aria-hidden className="relative mx-auto h-[420px] w-full max-w-md select-none lg:h-[500px]">
            <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

            <div className="absolute left-0 top-6 w-[62%] rotate-[-6deg] overflow-hidden rounded-3xl border border-outline-variant/30 shadow-[var(--shadow-floating)] [animation:var(--animate-float)]">
              <img
                src={moodImage('classic-barbecue')}
                alt=""
                width={420}
                height={280}
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-xs font-bold text-on-surface backdrop-blur-sm">
                {moodLabel('classic-barbecue')}
              </span>
            </div>

            <div className="absolute right-0 top-0 w-[46%] rotate-[5deg] overflow-hidden rounded-3xl border border-outline-variant/30 shadow-[var(--shadow-floating)] [animation:var(--animate-float-delayed)]">
              <img
                src={moodImage('pool-party')}
                alt=""
                width={320}
                height={220}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-xs font-bold text-on-surface backdrop-blur-sm">
                {moodLabel('pool-party')}
              </span>
            </div>

            <div className="absolute bottom-10 right-4 w-[52%] rotate-[3deg] overflow-hidden rounded-3xl border border-outline-variant/30 shadow-[var(--shadow-floating)] [animation:var(--animate-float)]" style={{ animationDelay: '0.6s' }}>
              <img
                src={moodImage('birthday')}
                alt=""
                width={360}
                height={240}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-xs font-bold text-on-surface backdrop-blur-sm">
                {moodLabel('birthday')}
              </span>
            </div>

            {/* Product UI chips floating over the collage. */}
            <div className="absolute bottom-24 left-2 flex items-center gap-2.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/90 px-4 py-3 shadow-[var(--shadow-floating)] backdrop-blur-md [animation:var(--animate-float-delayed)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-tertiary-container/20 text-tertiary">
                <Icon name="wallet" size={18} />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Total estimado</p>
                <p className="text-sm font-extrabold tabular-nums text-on-surface">R$ 254,40</p>
              </div>
            </div>

            <div className="absolute right-0 top-[46%] flex items-center gap-2 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/90 px-4 py-2.5 shadow-[var(--shadow-floating)] backdrop-blur-md [animation:var(--animate-float)]" style={{ animationDelay: '1.8s' }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="check" size={16} />
              </span>
              <p className="text-sm font-bold text-on-surface">Pix dividido</p>
            </div>
          </div>
        </section>

        {/* ─── Como funciona ─── */}
        <section id="como-funciona" className="scroll-mt-24 pb-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
              Do convite ao Pix em três passos
            </h2>
            <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
              Sem planilha, sem calculadora, sem "quanto ficou pra cada um?".
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col gap-3 rounded-3xl border border-outline-variant/30 bg-surface-container-lowest/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm"
              >
                <span className="absolute right-5 top-4 text-5xl font-black text-primary/10">
                  {index + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name={step.icon} size={24} />
                </span>
                <h3 className="text-lg font-extrabold tracking-tight text-on-surface">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Recursos ─── */}
        <section className="pb-20">
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-3xl border border-outline-variant/30 bg-surface-container-lowest/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tertiary-container/15 text-tertiary">
                  <Icon name={feature.icon} size={24} />
                </span>
                <div>
                  <h3 className="font-extrabold tracking-tight text-on-surface">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA final ─── */}
        <section className="pb-16">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary to-primary-container p-10 text-center shadow-[var(--shadow-floating)] sm:p-14">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-black/10 blur-2xl" />

            <Icon name="party" size={40} className="mx-auto mb-4 text-on-primary" />
            <h2 className="text-3xl font-black tracking-tight text-on-primary sm:text-4xl">
              Pronto para a próxima festa?
            </h2>
            <p className="mx-auto mt-3 max-w-sm font-medium text-on-primary/85">
              Crie seu primeiro evento em menos de um minuto. É grátis.
            </p>
            <div className="mt-8 flex justify-center">
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <button
                  type="button"
                  className="flex h-14 cursor-pointer items-center gap-2 rounded-full bg-background px-8 text-lg font-bold text-on-surface shadow-xl transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Começar agora
                  <Icon name="arrow-right" size={20} className="text-primary" />
                </button>
              </SignInButton>
            </div>
          </div>
        </section>

        {/* ─── Rodapé ─── */}
        <footer className="flex flex-col items-center gap-2 border-t border-outline-variant/20 py-8 text-center">
          <div className="flex items-center gap-2">
            <Icon name="party" size={18} className="text-primary" />
            <span className="font-bold tracking-tight text-on-surface">Smart Party</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant/70">
            Planeje, calcule e divida — sem dor de cabeça.
          </p>
        </footer>
      </main>
    </div>
  )
}
