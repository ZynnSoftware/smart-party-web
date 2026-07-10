import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { useTheme } from '@/contexts/ThemeContext'

/** App top bar: brand (links home) + theme toggle. Sticky, blurred. */
export function TopBar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-4 z-40 w-full px-4 transition-all duration-300">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between rounded-full border border-outline-variant/30 bg-surface-container-lowest/70 px-5 py-2.5 shadow-[var(--shadow-card)] backdrop-blur-xl dark:border-white/10 dark:bg-surface-container-lowest/30">
        <Link to="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Icon name="party" size={22} className="text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="text-lg font-medium tracking-tight text-on-surface">Smart Party</span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition duration-300 hover:bg-surface-container hover:text-on-surface"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>
      </div>
    </header>
  )
}
