import { LogOut, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useLogout, useSession } from '../../hooks/useAuth'

export function MobileTopbar() {
  const navigate = useNavigate()
  const { data: user } = useSession()
  const logout = useLogout()

  const initials = user
    ? `${user.firstNameUser?.[0] ?? ''}${user.lastNameUser?.[0] ?? ''}`.toUpperCase()
    : 'AR'

  return (
    <div className="md:hidden sticky top-0 z-(--z-nav) bg-card/95 backdrop-blur-md border-b border-border px-5 py-3">
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--gradient-brand)' }}
        >
          <Wallet size={15} className="text-white" />
        </div>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--gradient-brand)' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate leading-tight">
              {user?.firstNameUser ?? 'Andrés'} {user?.lastNameUser ?? 'R.'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.emailUser ?? 'andres@email.com'}</p>
          </div>
        </button>
        <button
          type="button"
          aria-label="Cerrar sesión"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  )
}