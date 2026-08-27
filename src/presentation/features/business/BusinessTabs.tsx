import { Car, UtensilsCrossed } from 'lucide-react'
import { Toggle } from '../../components/core/Toggle'

export type BusinessTab = 'parquedero' | 'comidas'

interface BusinessTabsProps {
  value: BusinessTab
  onChange: (tab: BusinessTab) => void
}

export function BusinessTabs({ value, onChange }: BusinessTabsProps) {
  return (
    <Toggle
      tall
      options={[
        { id: 'parquedero', label: 'Parquedero', Icon: Car },
        { id: 'comidas', label: 'Comidas', Icon: UtensilsCrossed },
      ]}
      value={value}
      onChange={(tab) => onChange(tab as BusinessTab)}
    />
  )
}
