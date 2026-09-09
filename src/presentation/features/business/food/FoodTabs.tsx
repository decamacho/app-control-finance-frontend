import { ClipboardList, Package, Users } from 'lucide-react'

export type FoodTab = 'pedidos' | 'productos' | 'clientes'

const TABS = [
  { id: 'pedidos', label: 'Pedidos', Icon: ClipboardList },
  { id: 'productos', label: 'Productos', Icon: Package },
  { id: 'clientes', label: 'Clientes', Icon: Users },
] as const

interface FoodTabsProps {
  value: FoodTab
  onChange: (tab: FoodTab) => void
}

export function FoodTabs({ value, onChange }: FoodTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-2xl overflow-x-auto scrollbar-none">
      {TABS.map((tab) => {
        const active = value === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tab.id)}
            className={`flex-none md:flex-1 flex items-center justify-center gap-1.5 px-3.5 md:px-0 py-2 rounded-xl text-[11px] md:text-sm font-bold whitespace-nowrap transition-all ${
              active ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:bg-card/60 hover:text-foreground'
            }`}
          >
            <tab.Icon size={14} className="hidden md:block shrink-0" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}