import { Link } from 'react-router-dom'
import { SignedIn, useUser } from '@clerk/clerk-react'
import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'

/** App top bar: brand (links home) + theme toggle + account. Sticky, blurred. */
export function TopBar() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-4 z-40 w-full px-4 transition-all duration-300">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/70 px-5 py-2.5 shadow-[var(--shadow-card)] backdrop-blur-xl dark:border-white/10 dark:bg-surface-container-lowest/30 xl:max-w-6xl">
        <Link to="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Logo size={22} className="transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display text-lg font-bold tracking-tight text-on-surface">reparteaí</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest transition-all hover:scale-105 active:scale-95"
          >
            <Icon
              name={theme === 'dark' ? 'sun' : 'moon'}
              size={18}
              className="text-on-surface-variant transition-colors group-hover:text-on-surface"
            />
          </button>
          <SignedIn>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              aria-label="Meu Perfil"
              className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest transition-all hover:scale-105 active:scale-95"
            >
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Perfil" 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Icon name="person" size={18} className="text-on-surface-variant group-hover:text-on-surface" />
              )}
            </button>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
