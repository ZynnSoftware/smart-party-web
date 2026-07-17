import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-center gap-2 border-t border-outline-variant/20 py-8 text-center">
      <div className="flex items-center gap-2">
        <Logo size={18} />
        <span className="font-display font-bold tracking-tight text-on-surface">reparteaí</span>
      </div>
      <p className="text-xs font-medium text-on-surface-variant/70">
        Planeje, calcule e divida — sem dor de cabeça.
      </p>
      <Link to="/receitas" className="text-xs font-bold text-primary hover:underline">
        Ver receitas por tipo de festa
      </Link>
      <div className="mt-1 flex items-center gap-3 text-xs font-medium text-on-surface-variant/70">
        <Link to="/termos" className="hover:underline hover:text-on-surface-variant">
          Termos de Uso
        </Link>
        <span aria-hidden>·</span>
        <Link to="/privacidade" className="hover:underline hover:text-on-surface-variant">
          Política de Privacidade
        </Link>
      </div>
    </footer>
  )
}
