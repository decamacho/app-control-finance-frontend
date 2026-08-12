import { Car, ShoppingCart } from 'lucide-react'
import { Toggle } from '../../components/core/Toggle'

export type BusinessTab = 'parquedero' | 'tienda'

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
        { id: 'tienda', label: 'Tienda', Icon: ShoppingCart },
      ]}
      value={value}
      onChange={(tab) => onChange(tab as BusinessTab)}
    />
  )
}
