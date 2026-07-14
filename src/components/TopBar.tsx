import { Link } from 'react-router-dom'
import { SignedIn, useUser } from '@clerk/clerk-react'
import { Icon } from '@/components/ui/Icon'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'

/** App top bar: brand (links home) + theme toggle + account. Sticky, blurred. */
export function TopBar() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-4 z-40 w-full px-4 transition-all duration-300">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between rounded-full border border-outline-variant/30 bg-surface-container-lowest/70 px-5 py-2.5 shadow-[var(--shadow-card)] backdrop-blur-xl dark:border-white/10 dark:bg-surface-container-lowest/30">
        <Link to="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Icon name="party" size={22} className="text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="text-lg font-medium tracking-tight text-on-surface">Smart Party</span>
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
