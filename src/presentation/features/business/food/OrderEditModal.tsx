import { useState } from 'react'
import { CalendarClock, PackagePlus, Trash2 } from 'lucide-react'
import type { FoodProduct, FoodCustomer, FoodOrder, UpdateOrderInput } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import { SelectField } from '../../../components/core/SelectField'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'
import { useUpdateFoodOrder } from '../../../hooks/useFoodQuery'

interface OrderEditModalProps {
  open: boolean
  onClose: () => void
  order: FoodOrder | null
  products: FoodProduct[]
  customer: FoodCustomer | null
}

interface EditItemDraft {
  productId: string
  quantity: number
}

function toLocalDateTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function extractErrorMessage(error: unknown): string {
  const data = (error as { response?: { data?: { message?: string | string[] } } })?.response?.data
  if (typeof data?.message === 'string') return data.message
  if (Array.isArray(data?.message)) return data.message.join(', ')
  return 'No se pudo actualizar el pedido'
}

export function OrderEditModal({ open, onClose, order, products, customer }: OrderEditModalProps) {
  const [items, setItems] = useState<EditItemDraft[]>([])
  const [deliveryTime, setDeliveryTime] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const { mutate: updateOrder, isPending } = useUpdateFoodOrder()

  useResetOnOpen(open, () => {
    setItems(
      order?.items.map((item) => ({
        productId: item.product?.idProduct ?? item.idProduct,
        quantity: item.quantity,
      })) ?? []
    )
    setDeliveryTime(order ? toLocalDateTime(order.deliveryTime) : '')
    setLocalError(null)
  })

  const deliveredByProduct = new Map<string, number>()
  order?.deliveries?.forEach((delivery) =>
    delivery.items.forEach((item) => {
      const id = item.orderItem.product?.idProduct ?? item.orderItem.idProduct
      const current = deliveredByProduct.get(id) ?? 0
      deliveredByProduct.set(id, current + item.quantity)
    })
  )
  const hasDeliveredUnits = order?.deliveryStatus !== 'NOT_DELIVERED'

  const getItemPrice = (productId: string) => {
    const custom = customer?.customPrices?.find((cp) => cp.product?.idProduct === productId)
    if (custom) return custom.customPrice
    const base = products.find((p) => p.idProduct === productId)?.basePrice
    if (base !== undefined && base > 0) return base
    return order?.items.find((i) => (i.product?.idProduct ?? i.idProduct) === productId)?.unitPrice ?? 0
  }

  const total = items.reduce((sum, item) => sum + getItemPrice(item.productId) * item.quantity, 0)

  const addItem = () => {
    const usedIds = items.map((i) => i.productId)
    const available = products.find((p) => !usedIds.includes(p.idProduct))
    if (!available) return
    setItems((prev) => [...prev, { productId: available.idProduct, quantity: 1 }])
  }

  const allProductsUsed = products.length > 0 && products.every((p) => items.some((i) => i.productId === p.idProduct))

  const labelFor = (productId: string) =>
    products.find((p) => p.idProduct === productId)?.nameProduct
    ?? order?.items.find((i) => (i.product?.idProduct ?? i.idProduct) === productId)?.product?.nameProduct
    ?? order?.items.find((i) => (i.product?.idProduct ?? i.idProduct) === productId)?.nameProduct
    ?? productId

  const getRowOptions = (currentId: string, idx: number) => {
    const usedElsewhere = items.filter((_, i) => i !== idx).map((i) => i.productId).filter(Boolean)
    const opts = products
      .filter((p) => !usedElsewhere.includes(p.idProduct))
      .map((p) => ({ value: p.idProduct, label: p.nameProduct }))
    if (currentId && !opts.some((o) => o.value === currentId)) {
      return [{ value: currentId, label: labelFor(currentId) }, ...opts]
    }
    return opts
  }

  const updateItemProduct = (index: number, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, productId: value } : item)))
  }

  const updateItemQty = (index: number, qty: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item)))
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!order) return
    const validItems = items.filter((i) => i.productId && i.quantity > 0)
    if (validItems.length === 0) {
      setLocalError('Agrega al menos un producto con cantidad válida')
      return
    }
    if (!deliveryTime) {
      setLocalError('Define la fecha y hora del pedido')
      return
    }
    setLocalError(null)
    const input: UpdateOrderInput = {
      deliveryTime: new Date(deliveryTime).toISOString(),
      items: validItems.map((i) => ({ idProduct: i.productId, quantity: i.quantity })),
    }
    updateOrder(
      { id: order.idOrder, input },
      {
        onSuccess: () => onClose(),
        onError: (error) => setLocalError(extractErrorMessage(error)),
      }
    )
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Editar pedido"
      ctaLabel="Guardar cambios"
      onSubmit={handleSave}
      submitting={isPending}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      <div className="bg-secondary rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Cliente</span>
          <span className="text-sm font-bold text-foreground">{order?.customer?.nameCustomer ?? '—'}</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-wider">Productos</p>
          <button
            type="button"
            onClick={addItem}
            disabled={allProductsUsed}
            className="flex items-center gap-1 px-3 py-1.5 bg-accent text-accent-foreground rounded-xl text-xs font-bold hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <PackagePlus size={13} /> {allProductsUsed ? 'Agotados' : 'Agregar'}
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const price = getItemPrice(item.productId)
            const customPrice = customer?.customPrices?.find((cp) => cp.product?.idProduct === item.productId)
            const delivered = deliveredByProduct.get(item.productId) ?? 0
            return (
              <div key={idx} className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
                <div className="flex-1 min-w-0">
                  <SelectField
                    size="small"
                    placeholder="Producto"
                    options={getRowOptions(item.productId, idx)}
                    value={item.productId || undefined}
                    onChange={(val) => updateItemProduct(idx, val)}
                  />
                  {hasDeliveredUnits && delivered > 0 && (
                    <p className="text-[9px] text-amber-600 mt-0.5">Ya entregado: {delivered} ud.</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Disminuir"
                    onClick={() => updateItemQty(idx, Math.max(Math.max(1, delivered), item.quantity - 1))}
                    disabled={item.quantity <= delivered && hasDeliveredUnits}
                    className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold text-xs hover:bg-secondary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Aumentar"
                    onClick={() => updateItemQty(idx, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs hover:brightness-105 transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono font-bold text-foreground">{formatMoney(price * item.quantity)}</span>
                  {customPrice && (
                    <span className="text-[9px] text-muted-foreground">Custom: {formatMoney(customPrice.customPrice)}</span>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Quitar producto"
                  onClick={() => removeItem(idx)}
                  disabled={hasDeliveredUnits && delivered > 0}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-secondary rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-medium">Total</span>
          <span className="text-2xl font-mono font-bold text-foreground">{formatMoney(total)}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">El servidor recalcula el total con los precios del cliente.</p>
      </div>

      <Field label="Fecha y hora de entrega" required>
        <div className="relative">
          <CalendarClock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className={`${inputCls} pl-9`}
            type="datetime-local"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />
        </div>
      </Field>
    </FormModal>
  )
}