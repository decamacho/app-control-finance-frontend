import { useNavigate } from 'react-router'
import { NAV, type Tab } from '../../type/navigation/navigation'

interface BottomNavProps {
  tab: Tab
}

export function BottomNav({ tab }: BottomNavProps) {
  const navigate = useNavigate()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-(--z-nav)">
      <div className="flex items-center max-w-md mx-auto px-1">
        {NAV.map(({ id, label, path, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-4 relative transition-all ${
                active ? 'text-nav-active' : 'text-muted-foreground'
              }`}
            >
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-nav-active rounded-full" />}
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs font-bold">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}