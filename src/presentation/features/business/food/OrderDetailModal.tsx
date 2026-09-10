import { useState } from 'react'
import { Package, Truck, Wallet, Ban, Calendar, Pencil, ReceiptText, Trash2 } from 'lucide-react'
import type { FoodOrder } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP, DELIVERY_STATUS_MAP, ORDER_TYPE_MAP, FOOD_PAYMENT_METHOD_LABELS } from '../../../type/business/constants'
import { Modal } from '../../../components/core/Modal'
import { useDeliverySummary, useOrderPayments } from '../../../hooks/useFoodQuery'
import { DeliverySummary } from './DeliverySummary'

function formatPaymentDate(value: string): string {
  const normalized = value.includes('T') || value.includes(' ') ? value : `${value}T12:00:00`
  return new Date(normalized).toLocaleDateString('es-CO', { dateStyle: 'medium' })
}

interface OrderDetailModalProps {
  open: boolean
  onClose: () => void
  order: FoodOrder | null
  onPay: (order: FoodOrder) => void
  onCancel: (id: string) => void
  onRegisterDelivery: (order: FoodOrder) => void
  onEdit: (order: FoodOrder) => void
  onDelete?: (order: FoodOrder) => void
}

export function OrderDetailModal({ open, onClose, order, onPay, onCancel, onRegisterDelivery, onEdit, onDelete }: OrderDetailModalProps) {
  const [showDeliverySummary, setShowDeliverySummary] = useState(false)
  const summaryQuery = useDeliverySummary(order?.idOrder)
  const paymentsQuery = useOrderPayments(order?.idOrder)

  if (!order) return null

  const isExpense = order.orderType === 'EXPENSE'
  const paymentConfig = PAYMENT_STATUS_MAP[order.paymentStatus] ?? PAYMENT_STATUS_MAP.PENDING
  const deliveryConfig = DELIVERY_STATUS_MAP[order.deliveryStatus] ?? DELIVERY_STATUS_MAP.NOT_DELIVERED
  const statusConfig = ORDER_STATUS_MAP[order.statusOrder] ?? ORDER_STATUS_MAP.ACTIVE
  const typeConfig = ORDER_TYPE_MAP[order.orderType] ?? ORDER_TYPE_MAP.SALE

  const payments = paymentsQuery.data ?? order.payments ?? []

  const summaryItems = summaryQuery.data?.items ?? []
  const hasDeliveryInfo =
    summaryItems.length > 0 || (order.deliveries?.length ?? 0) > 0 || order.deliveryStatus !== 'NOT_DELIVERED'

  const deliveryRows = summaryItems.length
    ? summaryItems.map((i) => ({
        idOrderItem: i.idOrderItem,
        name: i.productName,
        delivered: i.deliveredQuantity,
        ordered: i.orderedQuantity,
      }))
    : (() => {
        const grouped = new Map<string, { idOrderItem: string; name: string; delivered: number; ordered: number }>()
        order.deliveries?.forEach((delivery) =>
          delivery.items.forEach((item) => {
            const key = item.orderItem.idOrderItem
            const name = item.orderItem.product?.nameProduct ?? item.orderItem.nameProduct ?? 'Producto'
            const entry = grouped.get(key) ?? { idOrderItem: key, name, delivered: 0, ordered: item.orderItem.quantity }
            entry.delivered += item.quantity
            grouped.set(key, entry)
          })
        )
        return Array.from(grouped.values())
      })()

  const deliveredUnits = deliveryRows.reduce((sum, row) => sum + row.delivered, 0)
  const totalUnits = deliveryRows.reduce((sum, row) => sum + row.ordered, 0)

  const canCancel = order.statusOrder === 'ACTIVE' && order.paymentStatus !== 'PAID' && order.deliveryStatus !== 'DELIVERED'
  const canEdit = order.statusOrder === 'ACTIVE' && order.paymentStatus !== 'PAID' && order.deliveryStatus !== 'DELIVERED'

  return (
    <>
      <Modal open={open} onClose={onClose} title={isExpense ? 'Gasto' : `Pedido #${order.idOrder.slice(0, 8)}`}>
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            <div className="bg-secondary rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{isExpense ? 'Tipo' : 'Cliente'}</span>
                <span className="text-sm font-bold text-foreground">
                  {isExpense ? (
                    <span className="inline-flex items-center gap-1.5">
                      <ReceiptText size={14} />
                      {typeConfig.label}
                    </span>
                  ) : (
                    order.customer?.nameCustomer
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Entrega</span>
                <span className="text-sm font-mono text-foreground">
                  {new Date(order.deliveryTime).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              {isExpense && order.description && (
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-sm text-muted-foreground shrink-0">Descripción</span>
                  <span className="text-sm text-foreground text-right">{order.description}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeConfig.bg} ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                {!isExpense && (
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

            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Resumen financiero</p>
              {!isExpense && order.items.length > 0 && (
                <div className="space-y-2 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.product?.nameProduct ?? item.nameProduct ?? item.idProduct}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.quantity} x {formatMoney(item.unitPrice)}
                        </p>
                      </div>
                      <span className="text-sm font-mono font-bold text-foreground shrink-0 ml-2">{formatMoney(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-border pt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-sm font-mono font-bold text-foreground">{formatMoney(order.totalAmount)}</span>
                </div>
                {!isExpense && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pagado</span>
                      <span className="text-sm font-mono font-bold text-emerald-600">{formatMoney(order.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pendiente</span>
                      <span className="text-sm font-mono font-bold text-rose-600">{formatMoney(order.pendingAmount)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {!isExpense && hasDeliveryInfo && deliveryRows.length > 0 && (
              <div className="bg-secondary rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Entrega</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${deliveryConfig.bg} ${deliveryConfig.color}`}>
                    {deliveryConfig.label}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Unidades entregadas</span>
                    <span className="text-sm font-mono font-bold text-foreground">{deliveredUnits} de {totalUnits}</span>
                  </div>
                  <div className="border-t border-border pt-2 space-y-1.5">
                    {deliveryRows.map((row) => (
                      <div key={row.idOrderItem} className="flex justify-between items-center">
                        <span className="text-sm text-foreground">{row.name}</span>
                        <span className="text-xs font-mono font-bold text-muted-foreground">{row.delivered}/{row.ordered}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!isExpense && order.statusOrder === 'ACTIVE' && (
              <div className="space-y-2">
                {order.pendingAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => onPay(order)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-accent text-accent-foreground hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Wallet size={16} />
                    Registrar pago
                  </button>
                )}
                {order.deliveryStatus !== 'DELIVERED' && (
                  <button
                    type="button"
                    onClick={() => onRegisterDelivery(order)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-card border border-border hover:border-primary/50 hover:bg-secondary active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Truck size={16} />
                    Registrar entrega
                  </button>
                )}
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(order)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-card border border-border hover:border-primary/50 hover:bg-secondary active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Pencil size={16} />
                    Editar pedido
                  </button>
                )}
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => onCancel(order.idOrder)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Ban size={16} />
                    Cancelar pedido
                  </button>
                )}
              </div>
            )}

            {!isExpense && order.deliveries && order.deliveries.length > 0 && (
              <div className="bg-secondary rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Entregas</p>
                  <button
                    type="button"
                    onClick={() => setShowDeliverySummary(true)}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Package size={12} /> Ver resumen
                  </button>
                </div>
                <div className="space-y-2">
                  {order.deliveries.map((delivery) => (
                    <div key={delivery.idDelivery} className="flex items-center gap-2">
                      <Truck size={14} className="text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground">
                          {new Date(delivery.deliveredAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                        {delivery.notes && (
                          <p className="text-[10px] text-muted-foreground truncate">{delivery.notes}</p>
                        )}
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${DELIVERY_STATUS_MAP[delivery.status]?.bg} ${DELIVERY_STATUS_MAP[delivery.status]?.color}`}>
                        {DELIVERY_STATUS_MAP[delivery.status]?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {payments.length > 0 && (
              <div className="bg-secondary rounded-2xl p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Pagos</p>
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div key={payment.idPayment} className="flex items-center gap-2">
                      <Wallet size={14} className="text-muted-foreground shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-mono">{formatMoney(payment.amount)}</p>
                        {payment.paymentDate && (
                          <p className="text-[10px] text-primary font-bold">
                            Fecha de pago: {formatPaymentDate(payment.paymentDate)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{FOOD_PAYMENT_METHOD_LABELS[payment.paymentMethod] ?? payment.paymentMethod}</span>
                      {payment.createdAt && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(order.hasRecurringOrder ?? order.recurringOrder?.idRecurringOrder ?? order.idRecurringOrder) && (
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-violet-600" />
                  <span className="text-xs font-bold text-violet-700">Pedido recurrente</span>
                </div>
                <p className="text-[10px] text-violet-600 mt-1">Generado automáticamente por configuración de pedido recurrente</p>
              </div>
            )}

            {!isExpense && !canCancel && onDelete && (
              <div className="border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => onDelete(order)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Trash2 size={16} />
                  Eliminar pedido
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <DeliverySummary
        open={showDeliverySummary}
        onClose={() => setShowDeliverySummary(false)}
        items={summaryQuery.data?.items ?? []}
      />
    </>
  )
}