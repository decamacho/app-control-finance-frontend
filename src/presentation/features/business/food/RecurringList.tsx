import { RotateCcw, Pause, Play, Calendar } from 'lucide-react'
import type { RecurringOrder, FoodProduct } from '../../../../core/domain/entities/food'
import { RECURRING_DAY_LABELS } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'

interface RecurringListProps {
  recurring: RecurringOrder[]
  products: FoodProduct[]
  onToggle: (idOrder: string, idRecurringOrder: string, active: boolean) => void
}

export function RecurringList({ recurring, products, onToggle }: RecurringListProps) {
  if (recurring.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <RotateCcw size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-bold text-foreground">Sin pedidos recurrentes</p>
        <p className="text-xs text-muted-foreground mt-1">Crea uno para automatizar pedidos</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {recurring.map((rec) => {
        const itemsSummary = rec.fixedItems
          .map((item) => {
            const product = products.find((p) => p.idProduct === item.productId)
            return `${product?.nameProduct ?? item.productName ?? 'Prod'} x${item.quantity}`
          })
          .join(', ')

        const total = rec.fixedItems.reduce((sum, item) => {
          return sum + (item.customPrice ?? products.find((p) => p.idProduct === item.productId)?.basePrice ?? 0) * item.quantity
        }, 0)

        const daysLabel = rec.recurringDays.map((d) => RECURRING_DAY_LABELS[d]).join(', ')

        return (
          <div
            key={rec.idRecurringOrder}
            className={`bg-card border rounded-2xl p-4 transition-all ${rec.isActive ? 'border-border' : 'border-border opacity-60'}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <RotateCcw size={16} className={rec.isActive ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{rec.customer?.nameCustomer}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{itemsSummary}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    rec.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    {rec.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar size={10} />
                    {daysLabel}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {rec.deliveryTime}
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground">{formatMoney(total)}/pedido</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {rec.startDate} → {rec.endDate}
                </div>
              </div>
              <button
                type="button"
                aria-label={rec.isActive ? 'Pausar recurrente' : 'Activar recurrente'}
                onClick={() => onToggle(rec.idRecurringOrder, rec.idRecurringOrder, !rec.isActive)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  rec.isActive
                    ? 'text-amber-600 hover:bg-amber-50'
                    : 'text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {rec.isActive ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
