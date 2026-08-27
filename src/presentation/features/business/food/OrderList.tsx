import { Clock, ChevronRight, RotateCcw } from 'lucide-react'
import type { FoodOrder, FoodProduct } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { ORDER_STATUS_MAP } from '../../../type/business/constants'

interface OrderListProps {
  orders: FoodOrder[]
  products: FoodProduct[]
  onEdit: (order: FoodOrder) => void
}

const PAYMENT_BADGE: Record<string, { label: string; cls: string }> = {
  PAID: { label: 'Pagado', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  PARTIAL: { label: 'Parcial', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  PENDING: { label: 'Pendiente', cls: 'bg-rose-50 text-rose-700 border-rose-100' },
}

export function OrderList({ orders, products, onEdit }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <Clock size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-bold text-foreground">Sin órdenes hoy</p>
        <p className="text-xs text-muted-foreground mt-1">Crea una nueva orden para comenzar</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const config = ORDER_STATUS_MAP[order.status]
        const itemsSummary = order.items
          .map((item) => {
            const product = products.find((p) => p.idProduct === item.idProduct)
            return `${product?.nameProduct ?? 'Prod'} x${item.quantity}`
          })
          .join(', ')

        return (
          <button
            key={order.idOrder}
            type="button"
            onClick={() => onEdit(order)}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 text-left active:scale-[0.99] transition-all hover:border-primary/50 hover:shadow-sm cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-foreground truncate">{order.customerName}</span>
                {order.isRecurring && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-100">
                    <RotateCcw size={9} /> Recurrente
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{itemsSummary}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.bg} ${config.color}`}>
                  {config.label}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${PAYMENT_BADGE[order.paymentStatus]?.cls ?? PAYMENT_BADGE.PENDING.cls}`}>
                  {PAYMENT_BADGE[order.paymentStatus]?.label ?? 'Pendiente'}
                </span>
                {order.notes && (
                  <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{order.notes}</span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-mono font-bold text-foreground">{formatMoney(order.totalAmount)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {new Date(order.deliveryTime).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          </button>
        )
      })}
    </div>
  )
}
