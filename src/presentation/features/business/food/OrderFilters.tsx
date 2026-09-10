import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { OrderFilters } from '../../../../core/domain/entities/food'

interface OrderFiltersBarProps {
  filters: OrderFilters
  onChange: (filters: OrderFilters) => void
}

function toDateStr(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function shiftDay(value: string | undefined, days: number): string {
  const base = value || toDateStr(new Date())
  const [y, m, d] = base.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return toDateStr(date)
}

export function OrderFiltersBar({ filters, onChange }: OrderFiltersBarProps) {
  const today = toDateStr(new Date())
  const current = filters.date && filters.date <= today ? filters.date : today
  const canNext = current < today

  const prevDay = () => {
    onChange({ ...filters, date: shiftDay(current, -1) })
  }

  const nextDay = () => {
    if (!canNext) return
    onChange({ ...filters, date: shiftDay(current, 1) })
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-3 mb-4">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Fecha</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Día anterior"
          onClick={prevDay}
          className="w-11 h-11 shrink-0 rounded-2xl bg-secondary flex items-center justify-center text-primary hover:bg-secondary/80 active:scale-[0.98] transition-all cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <input
          type="date"
          max={today}
          value={current}
          onChange={(e) => onChange({ ...filters, date: e.target.value || undefined })}
          className="flex-1 min-w-0 bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
        />
        <button
          type="button"
          aria-label="Día siguiente"
          onClick={nextDay}
          disabled={!canNext}
          className="w-11 h-11 shrink-0 rounded-2xl bg-secondary flex items-center justify-center text-primary hover:bg-secondary/80 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}