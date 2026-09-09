import { Clock, ChevronRight, RotateCcw } from 'lucide-react'
import type { FoodOrder } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP, DELIVERY_STATUS_MAP, ORDER_TYPE_MAP } from '../../../type/business/constants'

interface OrderListProps {
  orders: FoodOrder[]
  onViewDetail: (order: FoodOrder) => void
}

export function OrderList({ orders, onViewDetail }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <Clock size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-bold text-foreground">Sin pedidos</p>
        <p className="text-xs text-muted-foreground mt-1">Crea un nuevo pedido para comenzar</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const typeConfig = ORDER_TYPE_MAP[order.orderType] ?? ORDER_TYPE_MAP.SALE
        const statusConfig = ORDER_STATUS_MAP[order.statusOrder] ?? ORDER_STATUS_MAP.ACTIVE
        const paymentConfig = PAYMENT_STATUS_MAP[order.paymentStatus] ?? PAYMENT_STATUS_MAP.PENDING
        const deliveryConfig = DELIVERY_STATUS_MAP[order.deliveryStatus] ?? DELIVERY_STATUS_MAP.NOT_DELIVERED
        const itemsSummary = order.items.length > 0
          ? order.items
              .map((item) => `${item.product?.nameProduct ?? item.nameProduct ?? 'Prod'} x${item.quantity}`)
              .join(', ')
          : (order.description ?? '')
        const title = order.customer?.nameCustomer ?? (order.orderType === 'EXPENSE' ? order.description ?? 'Gasto' : 'Sin cliente')

        return (
          <button
            key={order.idOrder}
            type="button"
            onClick={() => onViewDetail(order)}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 text-left active:scale-[0.99] transition-all hover:border-primary/50 hover:shadow-sm cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${typeConfig.bg} ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
                <span className="text-sm font-bold text-foreground truncate">{title}</span>
                {order.idRecurringOrder && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-100">
                    <RotateCcw size={9} /> Recurrente
                  </span>
                )}
              </div>
              {itemsSummary && (
                <p className="text-xs text-muted-foreground truncate">{itemsSummary}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                {order.orderType !== 'EXPENSE' && (
                  <>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${paymentConfig.bg} ${paymentConfig.color}`}>
                      {paymentConfig.label}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${deliveryConfig.bg} ${deliveryConfig.color}`}>
                      {deliveryConfig.label}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-mono font-bold text-foreground">{order.orderType === 'EXPENSE' ? `- ${formatMoney(order.totalAmount)}` : formatMoney(order.totalAmount)}</p>
              {order.orderType !== 'EXPENSE' && order.pendingAmount > 0 && (
                <p className="text-[10px] text-rose-500 font-mono mt-0.5">Pend: {formatMoney(order.pendingAmount)}</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {new Date(order.deliveryTime).toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          </button>
        )
      })}
    </div>
  )
}
