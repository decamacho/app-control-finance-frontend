import type { ReactNode } from 'react'
import { Wallet } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Wallet size={22} className="text-white" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">Wallet IA</span>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  )
}