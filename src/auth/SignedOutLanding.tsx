import { SignInButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Seo } from '@/components/Seo'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { moodImage, moodLabel } from '@/utils/moods'
import { HomeCalculator } from './HomeCalculator'
import { HomeRecipesStrip } from './HomeRecipesStrip'

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'reparteaí',
  url: 'https://www.reparteai.com.br',
  description:
    'Planejador de festas com IA: lista de compras automática, orçamento inteligente e divisão da conta no Pix.',
  logo: 'https://www.reparteai.com.br/favicon.svg',
}

const FAQ_ITEMS = [
  {
    question: 'Preciso pagar para começar a usar o reparteaí?',
    answer:
      'Não. O primeiro evento é gratuito e não pede cartão de crédito. Você paga só se quiser criar mais eventos depois do primeiro.',
  },
  {
    question: 'Como funciona a divisão da conta entre os convidados?',
    answer:
      'O reparteaí calcula o valor de cada convidado com base no consumo estimado (adultos e crianças contam diferente) e gera a cobrança para enviar direto no Pix, com rateio igual ou personalizado.',
  },
  {
    question: 'A lista de compras é gerada automaticamente?',
    answer:
      'Sim. Você escolhe o clima da festa (churrasco, aniversário, pool party etc.), informa o número de convidados e restrições alimentares, e o sistema monta a lista com quantidades e preços estimados.',
  },
  {
    question: 'O que acontece se eu definir um orçamento máximo?',
    answer:
      'O reparteaí reprioriza a lista automaticamente, cortando primeiro os itens não essenciais para manter o total dentro do orçamento definido.',
  },
] as const

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

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
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-background">
      <Seo
        title="reparteaí — a festa perfeita começa com um plano"
        description="Lista de compras, orçamento e divisão da conta calculados em segundos. Você só se preocupa em receber bem."
        path="/"
        jsonLd={[ORGANIZATION_JSON_LD, FAQ_JSON_LD]}
      />
      <TopBar />

      {/* Ambient brand glow, both themes. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-clip">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute top-[35%] left-[-12%] h-[380px] w-[380px] rounded-full bg-tertiary-container/15 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[15%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[90px]" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 [animation:var(--animate-fade-in)]">
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
                href="#calculadora"
                className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-base font-bold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface sm:w-auto"
              >
                Calcular minha festa
                <Icon name="chevron-down" size={18} />
              </a>
            </div>

            <p
              className="mt-5 text-sm font-medium text-on-surface-variant/70 [animation:var(--animate-rise)]"
              style={{ animationDelay: '320ms', animationFillMode: 'backwards' }}
            >
              Primeiro evento grátis · Sem cartão de crédito
            </p>

            <p
              className="mt-3 text-xs font-medium text-on-surface-variant/60 [animation:var(--animate-rise)]"
              style={{ animationDelay: '340ms', animationFillMode: 'backwards' }}
            >
              Ao continuar, você concorda com os{' '}
              <Link to="/termos" className="font-bold underline hover:text-on-surface-variant">
                Termos de Uso
              </Link>{' '}
              e a{' '}
              <Link to="/privacidade" className="font-bold underline hover:text-on-surface-variant">
                Política de Privacidade
              </Link>
              .
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
                fetchPriority="high"
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

        <HomeCalculator />

        {/* ─── Como funciona ─── */}
        <section id="como-funciona" className="scroll-mt-24 pb-20">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Como funciona
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
              Gostou da estimativa? Ela é só o começo.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
              Aquele valor vira lista de compras, orçamento e cobrança no Pix — em três passos, sem
              planilha e sem "quanto ficou pra cada um?".
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
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Por trás do cálculo
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
              Mais que uma lista de compras
            </h2>
            <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
              Em cada um desses passos tem uma inteligência cuidando dos detalhes que dão trabalho.
            </p>
          </div>

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

        <HomeRecipesStrip />

        {/* ─── Perguntas frequentes ─── */}
        <section className="pb-20">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Ficou alguma dúvida?
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
              Perguntas frequentes
            </h2>
            <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
              O que os anfitriões costumam perguntar antes de criar o primeiro evento.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-4">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm"
              >
                <h3 className="font-extrabold tracking-tight text-on-surface">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA final ─── */}
        <section className="pb-16">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary to-primary-container shadow-[var(--shadow-floating)]">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-black/10 blur-2xl" />

            <div className="relative grid items-center gap-10 p-10 sm:p-14 lg:grid-cols-[1.2fr_1fr]">
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-on-primary">
                  <Icon name="party" size={14} />
                  Última etapa
                </span>
                <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-on-primary sm:text-4xl">
                  Pronto para a próxima festa?
                </h2>
                <p className="mx-auto mt-4 max-w-md font-medium text-on-primary/85 lg:mx-0">
                  Você já viu quanto custa e como funciona. Falta só criar o evento — leva menos de
                  um minuto.
                </p>

                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <button
                      type="button"
                      className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-background px-8 text-lg font-bold text-on-surface shadow-xl transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
                    >
                      Criar meu evento grátis
                      <Icon name="arrow-right" size={20} className="text-primary" />
                    </button>
                  </SignInButton>
                  <p className="text-sm font-medium text-on-primary/75">
                    Sem cartão de crédito
                  </p>
                </div>
              </div>

              {/* What the host walks away with, in the product-chip style of the hero. */}
              <ul className="mx-auto flex w-full max-w-sm flex-col gap-3">
                {[
                  { icon: 'receipt', text: 'Lista de compras completa, com quantidades' },
                  { icon: 'wallet', text: 'Orçamento dentro do teto que você definir' },
                  { icon: 'users', text: 'Conta dividida e cobrança pronta no Pix' },
                ].map(({ icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3.5 backdrop-blur-sm"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/90 text-primary">
                      <Icon name={icon as IconName} size={18} />
                    </span>
                    <p className="text-sm font-bold text-on-primary">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
