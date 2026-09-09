import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { FoodProduct, FoodCustomer, CreateOrderInput, RecurringDay } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { RECURRING_DAY_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import { SelectField } from '../../../components/core/SelectField'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'

interface OrderModalProps {
  open: boolean
  onClose: () => void
  products: FoodProduct[]
  customers: FoodCustomer[]
  idBusiness?: string
  onSave: (input: CreateOrderInput) => void
}

interface OrderItemDraft {
  idProduct: string
  quantity: number
  unitPrice?: number
}

function toIsoDeliveryTime(value: string): string {
  if (!value) return new Date().toISOString()
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (match) {
    const delivery = new Date()
    delivery.setHours(Number(match[1]), Number(match[2]), 0, 0)
    return delivery.toISOString()
  }
  return value
}

export function OrderModal({ open, onClose, products, customers, idBusiness, onSave }: OrderModalProps) {
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState<OrderItemDraft[]>([{ idProduct: products[0]?.idProduct ?? '', quantity: 1 }])
  const [deliveryTime, setDeliveryTime] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringDays, setRecurringDays] = useState<RecurringDay[]>([])
  const [recurringStartTime, setRecurringStartTime] = useState('12:00')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useResetOnOpen(open, () => {
    setCustomerId(customers[0]?.idCustomer ?? '')
    setItems([{ idProduct: products[0]?.idProduct ?? '', quantity: 1 }])
    setDeliveryTime('')
    setIsRecurring(false)
    setRecurringDays([])
    setRecurringStartTime('12:00')
    setStartDate('')
    setEndDate('')
    setLocalError(null)
  })

  const selectedCustomer = customers.find((c) => c.idCustomer === customerId)

  const getItemPrice = (idProduct: string, overridePrice?: number) => {
    if (overridePrice && overridePrice > 0) return overridePrice
    const custom = selectedCustomer?.customPrices?.find((cp) => cp.product.idProduct === idProduct)
    if (custom) return custom.customPrice
    return products.find((p) => p.idProduct === idProduct)?.basePrice ?? 0
  }

  const total = items.reduce((sum, item) => sum + getItemPrice(item.idProduct, item.unitPrice) * item.quantity, 0)

  const addItem = () => {
    const usedIds = items.map((i) => i.idProduct)
    const available = products.find((p) => !usedIds.includes(p.idProduct))
    if (!available) return
    setItems((prev) => [...prev, { idProduct: available.idProduct, quantity: 1 }])
  }

  const allProductsUsed = products.length > 0 && products.every((p) => items.some((i) => i.idProduct === p.idProduct))

  const getRowOptions = (currentId: string, idx: number) => {
    const usedElsewhere = items.filter((_, i) => i !== idx).map((i) => i.idProduct).filter(Boolean)
    const opts = products
      .filter((p) => !usedElsewhere.includes(p.idProduct))
      .map((p) => ({ value: p.idProduct, label: p.nameProduct }))
    if (currentId && !opts.some((o) => o.value === currentId)) {
      return [{ value: currentId, label: currentId }, ...opts]
    }
    return opts
  }

  const updateItemProduct = (index: number, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, idProduct: value } : item)))
  }

  const updateItemQty = (index: number, qty: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item)))
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleRecurringDay = (day: RecurringDay) => {
    setRecurringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSave = () => {
    if (!idBusiness) {
      setLocalError('No hay negocio seleccionado')
      return
    }
    if (!customerId) {
      setLocalError('Selecciona un cliente')
      return
    }
    const validItems = items.filter((i) => i.idProduct && i.quantity > 0)
    if (validItems.length === 0) {
      setLocalError('Agrega al menos un producto con cantidad válida')
      return
    }
    if (isRecurring && recurringDays.length === 0) {
      setLocalError('Selecciona al menos un día de la semana')
      return
    }
    if (isRecurring && (!startDate || !endDate)) {
      setLocalError('Define las fechas de inicio y fin')
      return
    }
    setLocalError(null)
    onSave({
      idBusiness,
      idCustomer: customerId,
      deliveryTime: toIsoDeliveryTime(deliveryTime),
      items: validItems.map((i) => ({
        idProduct: i.idProduct,
        quantity: i.quantity,
      })),
      isRecurring: isRecurring || undefined,
      recurringConfig: isRecurring ? {
        recurringDays,
        deliveryTime: recurringStartTime,
        startDate,
        endDate,
      } : undefined,
    })
    onClose()
  }

  const customerOptions = customers.map((c) => ({ value: c.idCustomer, label: c.nameCustomer }))

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Nuevo pedido"
      ctaLabel="Crear pedido"
      onSubmit={handleSave}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      <Field label="Cliente" required>
        <SelectField
          placeholder="Seleccionar cliente"
          options={customerOptions}
          value={customerId || undefined}
          onChange={(val) => setCustomerId(val)}
        />
      </Field>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-wider">Productos</p>
          <button type="button" onClick={addItem} disabled={allProductsUsed} className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus size={12} /> {allProductsUsed ? 'Agotados' : 'Agregar'}
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const price = getItemPrice(item.idProduct, item.unitPrice)
            const customPrice = selectedCustomer?.customPrices?.find((cp) => cp.product?.idProduct === item.idProduct)
            return (
              <div key={idx} className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
                <div className="flex-1">
                  <SelectField
                    size="small"
                    placeholder="Producto"
                    options={getRowOptions(item.idProduct, idx)}
                    value={item.idProduct || undefined}
                    onChange={(val) => updateItemProduct(idx, val)}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Disminuir"
                    onClick={() => updateItemQty(idx, Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold text-xs hover:bg-secondary transition-colors cursor-pointer"
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

                {items.length > 1 && (
                  <button type="button" aria-label="Eliminar" onClick={() => removeItem(idx)} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                )}
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
      </div>

      <Field label="Hora de entrega">
        <input
          className={inputCls}
          type="time"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        />
      </Field>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-wider">Pedido recurrente</p>
          <button
            type="button"
            onClick={() => setIsRecurring(!isRecurring)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${isRecurring ? 'bg-primary' : 'bg-muted'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isRecurring ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {isRecurring && (
          <div className="space-y-3 bg-secondary rounded-2xl p-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">Días de la semana</p>
              <div className="flex gap-1.5">
                {RECURRING_DAY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleRecurringDay(opt.id)}
                    className={`flex-1 py-2 rounded-xl text-[11px] font-bold border-2 transition-all ${
                      recurringDays.includes(opt.id)
                        ? 'border-primary bg-secondary text-foreground'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Hora de entrega recurrente">
              <input
                className={inputCls}
                type="time"
                value={recurringStartTime}
                onChange={(e) => setRecurringStartTime(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Fecha inicio">
                <input
                  className={inputCls}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
              <Field label="Fecha fin">
                <input
                  className={inputCls}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Field>
            </div>
          </div>
        )}
      </div>
    </FormModal>
  )
}
