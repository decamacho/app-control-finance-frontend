import type { ReactNode } from 'react'
import type { OrderFilters } from '../../../../core/domain/entities/food'
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP, DELIVERY_STATUS_MAP, ORDER_TYPE_MAP } from '../../../type/business/constants'

interface OrderFiltersBarProps {
  filters: OrderFilters
  onChange: (filters: OrderFilters) => void
}

export function OrderFiltersBar({ filters, onChange }: OrderFiltersBarProps) {
  const hasActiveFilters = filters.status || filters.paymentStatus || filters.deliveryStatus || filters.orderType

  return (
    <div className="bg-card border border-border rounded-2xl p-3 mb-4 space-y-3">
      <FilterGroup label="Estado">
        <FilterChip
          label="Todos"
          active={!hasActiveFilters}
          onClick={() => onChange({})}
        />
        {Object.entries(ORDER_TYPE_MAP).map(([key, config]) => (
          <FilterChip
            key={key}
            label={config.label}
            active={filters.orderType === key}
            onClick={() => onChange({ ...filters, orderType: filters.orderType === key ? undefined : key as OrderFilters['orderType'] })}
          />
        ))}
        {Object.entries(ORDER_STATUS_MAP).map(([key, config]) => (
          <FilterChip
            key={key}
            label={config.label}
            active={filters.status === key}
            onClick={() => onChange({ ...filters, status: filters.status === key ? undefined : key })}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Pago">
        {Object.entries(PAYMENT_STATUS_MAP).map(([key, config]) => (
          <FilterChip
            key={key}
            label={config.label}
            active={filters.paymentStatus === key}
            onClick={() => onChange({ ...filters, paymentStatus: filters.paymentStatus === key ? undefined : key })}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Entrega">
        {Object.entries(DELIVERY_STATUS_MAP).map(([key, config]) => (
          <FilterChip
            key={key}
            label={config.label}
            active={filters.deliveryStatus === key}
            onClick={() => onChange({ ...filters, deliveryStatus: filters.deliveryStatus === key ? undefined : key })}
          />
        ))}
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )
}