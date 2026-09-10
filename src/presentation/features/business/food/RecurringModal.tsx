import { useMemo, useState } from 'react'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import type { FoodProduct, FoodCustomer, RecurringOrder, CreateRecurringInput, RecurringDay } from '../../../../core/domain/entities/food'
import { RECURRING_DAY_OPTIONS } from '../../../type/business/constants'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import { SelectField } from '../../../components/core/SelectField'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'
import { useCustomerPrices } from '../../../hooks/useFoodQuery'

interface RecurringModalProps {
  open: boolean
  onClose: () => void
  products: FoodProduct[]
  customers: FoodCustomer[]
  existingRecurring: RecurringOrder[]
  idBusiness?: string
  submitting?: boolean
  onSave: (input: CreateRecurringInput) => void
}

interface ItemDraft {
  productId: string
  quantity: number
  customPrice?: number
}

export function RecurringModal({ open, onClose, products, customers, existingRecurring, idBusiness, submitting, onSave }: RecurringModalProps) {
  const [customerId, setCustomerId] = useState('')
  const [recurringDays, setRecurringDays] = useState<RecurringDay[]>(['MON', 'WED', 'FRI'])
  const [deliveryTime, setDeliveryTime] = useState('12:00')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [items, setItems] = useState<ItemDraft[]>([{ productId: products[0]?.idProduct ?? '', quantity: 1 }])
  const [localError, setLocalError] = useState<string | null>(null)

  useResetOnOpen(open, () => {
    setCustomerId(customers[0]?.idCustomer ?? '')
    setRecurringDays(['MON', 'WED', 'FRI'])
    setDeliveryTime('12:00')
    setStartDate('')
    setEndDate('')
    setItems([{ productId: products[0]?.idProduct ?? '', quantity: 1 }])
    setLocalError(null)
  })

  const selectedCustomer = customers.find((c) => c.idCustomer === customerId)
  const recurringForCustomer = existingRecurring.find((r) => r.idCustomer === customerId)
  const today = new Date().toISOString().slice(0, 10)

  const pricesQuery = useCustomerPrices(idBusiness, customerId || undefined)
  const customPriceMap = useMemo(() => {
    const prices = pricesQuery.data ?? selectedCustomer?.customPrices ?? []
    return new Map(prices.map((cp) => [cp.product.idProduct, cp.customPrice]))
  }, [pricesQuery.data, selectedCustomer?.customPrices])

  const getItemPrice = (productId: string) => {
    const custom = customPriceMap.get(productId)
    if (custom !== undefined && custom > 0) return custom
    return products.find((p) => p.idProduct === productId)?.basePrice ?? 0
  }

  const total = items.reduce((sum, item) => sum + (item.customPrice ?? getItemPrice(item.productId)) * item.quantity, 0)

  const addItem = () => {
    const usedIds = items.map((i) => i.productId)
    const available = products.find((p) => !usedIds.includes(p.idProduct))
    if (!available) return
    setItems((prev) => [...prev, { productId: available.idProduct, quantity: 1 }])
  }

  const allProductsUsed = products.length > 0 && products.every((p) => items.some((i) => i.productId === p.idProduct))

  const getRowOptions = (currentId: string, idx: number) => {
    const usedElsewhere = items.filter((_, i) => i !== idx).map((i) => i.productId).filter(Boolean)
    const opts = products
      .filter((p) => !usedElsewhere.includes(p.idProduct))
      .map((p) => ({ value: p.idProduct, label: p.nameProduct }))
    if (currentId && !opts.some((o) => o.value === currentId)) {
      return [{ value: currentId, label: currentId }, ...opts]
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

  const toggleDay = (day: RecurringDay) => {
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
    if (recurringForCustomer) {
      setLocalError('Este cliente ya tiene un pedido recurrente, solo puede tener uno')
      return
    }
    if (recurringDays.length === 0) {
      setLocalError('Selecciona al menos un día')
      return
    }
    if (startDate && endDate && startDate > endDate) {
      setLocalError('La fecha de inicio no puede ser mayor a la fecha de fin')
      return
    }
    const validItems = items.filter((i) => i.productId && i.quantity > 0)
    if (validItems.length === 0) {
      setLocalError('Agrega al menos un producto')
      return
    }
    setLocalError(null)
    onSave({
      idBusiness,
      idCustomer: customerId,
      recurringDays,
      deliveryTime,
      startDate,
      endDate,
      fixedItems: validItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        customPrice: i.customPrice,
      })),
    })
  }

  const customerOptions = customers.map((c) => ({ value: c.idCustomer, label: c.nameCustomer }))

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Nuevo pedido recurrente"
      ctaLabel="Crear recurrente"
      onSubmit={handleSave}
      submitting={submitting}
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
        {recurringForCustomer && (
          <p className="flex items-start gap-1.5 mt-2.5 px-3 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>Este cliente ya tiene un pedido recurrente. Solo puede tener uno.</span>
          </p>
        )}
      </Field>

      <div className="mb-5">
        <p className="text-xs font-bold text-muted-foreground tracking-wider mb-2">Días de la semana</p>
        <div className="flex gap-1.5">
          {RECURRING_DAY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleDay(opt.id)}
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

      <Field label="Hora de entrega">
        <input
          className={inputCls}
          type="time"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Field label="Fecha inicio">
          <input
            className={inputCls}
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Field>
        <Field label="Fecha fin">
          <input
            className={inputCls}
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Field>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-wider">Productos</p>
          <button type="button" onClick={addItem} disabled={allProductsUsed} className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus size={12} /> {allProductsUsed ? 'Agotados' : 'Agregar'}
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const price = item.customPrice ?? getItemPrice(item.productId)
            const base = products.find((p) => p.idProduct === item.productId)?.basePrice ?? 0
            const isCustom = price !== base
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
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateItemQty(idx, Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold text-xs hover:bg-secondary transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateItemQty(idx, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs hover:brightness-105 transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col items-end justify-center shrink-0 min-w-0 max-w-[5rem]">
                  <span className="text-xs font-mono font-bold text-foreground truncate w-full text-right">
                    {formatMoney(price * item.quantity)}
                  </span>
                  {isCustom && (
                    <span className="text-[10px] text-primary font-bold truncate w-full text-right">Custom: {formatMoney(price)}</span>
                  )}
                </div>

                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(idx)} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-secondary rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-medium">Total por pedido</span>
          <span className="text-xl font-mono font-bold text-foreground">{formatMoney(total)}</span>
        </div>
      </div>
    </FormModal>
  )
}
