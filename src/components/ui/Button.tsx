import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconRight?: IconName
  loading?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
  secondary:
    'bg-surface-container text-on-surface hover:bg-surface-container-high active:scale-[0.97]',
  ghost: 'bg-transparent text-primary hover:bg-primary/10 active:scale-[0.97]',
  danger:
    'bg-error text-on-error shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
}

const SIZE_CLASSES: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${
        isDisabled ? '' : 'cursor-pointer'
      } ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon && <Icon name={icon} size={18} />
      )}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={18} />}
    </button>
  )
}
