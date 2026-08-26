import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  required?: boolean
  children: ReactNode
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold text-muted-foreground tracking-wider mb-2">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </p>
      {children}
    </div>
  )
}
