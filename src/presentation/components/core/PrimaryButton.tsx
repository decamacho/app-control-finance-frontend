import type { ButtonHTMLAttributes } from 'react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline'
}

export function PrimaryButton({ variant = 'solid', className, children, ...props }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
        variant === 'solid'
          ? 'bg-primary text-primary-foreground hover:brightness-105 active:scale-[0.99]'
          : 'border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary'
      } ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
