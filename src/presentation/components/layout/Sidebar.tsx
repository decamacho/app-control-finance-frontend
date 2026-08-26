import { Settings, Wallet, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'
import { NAV, type Tab } from '../../type/navigation/navigation'
import { useLogout } from '../../hooks/useAuth'
import { useSession } from '../../hooks/useAuth'

interface SidebarProps {
  tab: Tab
}

export function Sidebar({ tab }: SidebarProps) {
  const navigate = useNavigate()
  const { data: user } = useSession()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate()
  }

  const initials = user
    ? `${user.firstNameUser?.[0] ?? ''}${user.lastNameUser?.[0] ?? ''}`.toUpperCase()
    : 'AR'

  return (
    <nav className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border px-4 py-8 z-(--z-nav)">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--gradient-brand)' }}
        >
          <Wallet size={17} className="text-white" />
        </div>
        <span className="font-bold text-lg text-foreground tracking-tight">Wallet IA</span>
      </div>

      <div className="flex flex-col gap-1">
        {NAV.map(({ id, label, path, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                active ? 'bg-nav-active text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </button>
          )
        })}
      </div>

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <Settings size={18} strokeWidth={1.8} />
          Ajustes
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
        >
          <LogOut size={18} strokeWidth={1.8} />
          Cerrar sesión
        </button>

        <div className="flex items-center gap-3 px-3 py-3 mt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--gradient-brand)' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">
              {user?.firstNameUser ?? 'Andrés'} {user?.lastNameUser ?? 'R.'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.emailUser ?? 'andres@email.com'}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}