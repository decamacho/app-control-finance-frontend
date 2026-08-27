import { ClipboardList, Package, Users, RotateCcw } from 'lucide-react'
import { Toggle } from '../../../components/core/Toggle'

export type FoodTab = 'pedidos' | 'productos' | 'clientes' | 'recurrentes'

interface FoodTabsProps {
  value: FoodTab
  onChange: (tab: FoodTab) => void
}

export function FoodTabs({ value, onChange }: FoodTabsProps) {
  return (
    <Toggle
      options={[
        { id: 'pedidos', label: 'Pedidos', Icon: ClipboardList },
        { id: 'productos', label: 'Productos', Icon: Package },
        { id: 'clientes', label: 'Clientes', Icon: Users },
        { id: 'recurrentes', label: 'Recurrentes', Icon: RotateCcw },
      ]}
      value={value}
      onChange={(tab) => onChange(tab as FoodTab)}
    />
  )
}
