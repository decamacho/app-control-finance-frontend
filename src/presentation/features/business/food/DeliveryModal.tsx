import { useState } from 'react'
import type { FoodOrder } from '../../../../core/domain/entities/food'
import { FormModal } from '../../../components/core/FormModal'
import { useCreateDelivery } from '../../../hooks/useFoodQuery'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'

interface DeliveryModalProps {
  open: boolean
  onClose: () => void
  order: FoodOrder | null
}

interface DeliveryDraft {
  idOrderItem: string
  productName: string
  orderedQuantity: number
  deliveredSoFar: number
  quantityToDeliver: number
}

export function DeliveryModal({ open, onClose, order }: DeliveryModalProps) {
  const [drafts, setDrafts] = useState<DeliveryDraft[]>([])
  const [notes, setNotes] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const { mutate: createDelivery, isPending } = useCreateDelivery()

  useResetOnOpen(open, () => {
    if (order) {
      const deliveredByItem = new Map<string, number>()
      order.deliveries?.forEach((delivery) =>
        delivery.items.forEach((item) =>
          deliveredByItem.set(
            item.orderItem.idOrderItem,
            (deliveredByItem.get(item.orderItem.idOrderItem) ?? 0) + item.quantity
          )
        )
      )
      setDrafts(
        order.items.map((item) => {
          const deliveredSoFar = deliveredByItem.get(item.idOrderItem) ?? 0
          return {
            idOrderItem: item.idOrderItem,
            productName: item.product?.nameProduct ?? item.nameProduct ?? 'Producto',
            orderedQuantity: item.quantity,
            deliveredSoFar,
            quantityToDeliver: Math.max(0, item.quantity - deliveredSoFar),
          }
        })
      )
      setNotes('')
      setLocalError(null)
    }
  })

  const updateDraft = (idOrderItem: string, qty: number) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.idOrderItem === idOrderItem
          ? { ...d, quantityToDeliver: Math.max(0, Math.min(qty, d.orderedQuantity - d.deliveredSoFar)) }
          : d
      )
    )
  }

  const totalToDeliver = drafts.reduce((sum, d) => sum + d.quantityToDeliver, 0)

  const handleSave = () => {
    if (!order) return
    const items = drafts
      .filter((d) => d.quantityToDeliver > 0)
      .map((d) => ({ idOrderItem: d.idOrderItem, quantity: d.quantityToDeliver }))

    if (items.length === 0) {
      setLocalError('Selecciona al menos un item para entregar')
      return
    }

    setLocalError(null)
    createDelivery(
      { idOrder: order.idOrder, input: { items, notes: notes || undefined } },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Registrar entrega"
      ctaLabel={isPending ? 'Registrando...' : 'Confirmar entrega'}
      onSubmit={handleSave}
      submitting={isPending}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      {order && (
        <div className="bg-secondary rounded-2xl p-4 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cliente</span>
            <span className="text-sm font-bold text-foreground">{order.customer?.nameCustomer}</span>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-5">
        {drafts.map((draft) => {
          const remaining = draft.orderedQuantity - draft.deliveredSoFar
          return (
            <div key={draft.idOrderItem} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">{draft.productName}</span>
                <span className="text-xs text-muted-foreground">
                  Pendiente: {remaining}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateDraft(draft.idOrderItem, draft.quantityToDeliver - 1)}
                    disabled={draft.quantityToDeliver <= 0}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold text-sm hover:bg-secondary transition-colors cursor-pointer disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-lg">{draft.quantityToDeliver}</span>
                  <button
                    type="button"
                    onClick={() => updateDraft(draft.idOrderItem, draft.quantityToDeliver + 1)}
                    disabled={draft.quantityToDeliver >= remaining}
                    className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm hover:brightness-105 transition-all cursor-pointer disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <div className="flex-1" />
                <span className="text-sm font-mono font-bold text-foreground">
                  {draft.quantityToDeliver} / {remaining}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-secondary rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total a entregar</span>
          <span className="text-lg font-mono font-bold text-foreground">{totalToDeliver} unidades</span>
        </div>
      </div>

      <div className="mb-5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider block mb-1">Notas de entrega</label>
        <textarea
          className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground resize-none min-h-[60px]"
          placeholder="Ej: Entregado a portería, firma Juan Pérez"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </FormModal>
  )
}
