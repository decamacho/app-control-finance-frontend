import { Settings, Wallet } from 'lucide-react'
import { NAV, type Tab } from '../../type/navigation/navigation'

interface SidebarProps {
  tab: Tab
  onTabChange: (tab: Tab) => void
}

export function Sidebar({ tab, onTabChange }: SidebarProps) {
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
        {NAV.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onTabChange(id)}
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

      <div className="mt-auto">
        <button
          type="button"
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <Settings size={18} strokeWidth={1.8} />
          Ajustes
        </button>
        <div className="flex items-center gap-3 px-3 py-3 mt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--gradient-brand)' }}
          >
            AR
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">Andrés R.</p>
            <p className="text-xs text-muted-foreground truncate">andres@email.com</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
