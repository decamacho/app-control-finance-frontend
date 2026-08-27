import { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import type { FoodOrder, FoodProduct, UpdateOrderInput, OrderStatus } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { ORDER_STATUS_MAP } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'

interface OrderEditModalProps {
  open: boolean
  onClose: () => void
  order: FoodOrder | null
  products: FoodProduct[]
  onSave: (id: string, input: UpdateOrderInput) => void
  onPay: (order: FoodOrder) => void
}

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'PREPARING', 'DELIVERED', 'CANCELLED']

export function OrderEditModal({ open, onClose, order, products, onSave, onPay }: OrderEditModalProps) {
  const [status, setStatus] = useState<OrderStatus>('PENDING')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (open && order) {
      setStatus(order.status)
      setNotes(order.notes)
    }
  }, [open, order])

  const handleSave = () => {
    if (!order) return
    onSave(order.idOrder, { status, notes })
    onClose()
  }

  const paymentStatusLabel = (s: string) => s === 'PAID' ? 'Pagado' : s === 'PARTIAL' ? 'Parcial' : 'Pendiente'
  const paymentStatusColor = (s: string) => s === 'PAID' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : s === 'PARTIAL' ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-rose-700 bg-rose-50 border-rose-100'

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Editar orden"
      ctaLabel="Guardar cambios"
      onSubmit={handleSave}
    >
      {order && (
        <>
          <div className="bg-secondary rounded-2xl p-4 mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Cliente</span>
              <span className="text-sm font-bold text-foreground">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-mono font-bold text-foreground">{formatMoney(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Pagado</span>
              <span className="text-sm font-mono font-bold text-emerald-600">{formatMoney(order.paidAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Pendiente</span>
              <span className="text-sm font-mono font-bold text-rose-600">{formatMoney(order.pendingAmount)}</span>
            </div>

            <div className="border-t border-border pt-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Estado de pago</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${paymentStatusColor(order.paymentStatus)}`}>
                  {paymentStatusLabel(order.paymentStatus)}
                </span>
              </div>
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
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground mb-1">Productos:</p>
              {order.items.map((item, idx) => {
                const product = products.find((p) => p.idProduct === item.idProduct)
                return (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-foreground">{product?.nameProduct ?? item.idProduct} x{item.quantity}</span>
                    <span className="font-mono text-muted-foreground">{formatMoney((item.unitPrice ?? 0) * item.quantity)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <Field label="Estado">
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const config = ORDER_STATUS_MAP[s]
                const active = status === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold border-2 transition-all text-center ${
                      active ? `border-primary ${config.bg} ${config.color}` : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {config.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Notas">
            <textarea
              className={inputCls + ' resize-none min-h-[60px]'}
              placeholder="Notas de la orden..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
        </>
      )}
    </FormModal>
  )
}
