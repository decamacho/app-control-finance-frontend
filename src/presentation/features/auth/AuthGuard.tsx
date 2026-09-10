import { Loader2 } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useSession } from '../../hooks/useAuth'
import { getAccessToken, restoreSession } from '../../../infrastructure/api/http-client'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [restored, setRestored] = useState(() => Boolean(getAccessToken()))

  useEffect(() => {
    if (getAccessToken()) return
    restoreSession().finally(() => setRestored(true))
  }, [])

  const { data: user, isLoading } = useSession()
  const hasToken = Boolean(getAccessToken())

  if (!restored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!hasToken) return <Navigate to="/login" replace />

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}