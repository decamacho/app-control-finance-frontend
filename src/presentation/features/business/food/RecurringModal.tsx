import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { FoodProduct, FoodCustomer, CreateRecurringInput, RecurringFrequency } from '../../../../core/domain/entities/food'
import { RECURRING_FREQUENCY_OPTIONS } from '../../../type/business/constants'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { SelectField } from '../../../components/core/SelectField'

interface RecurringModalProps {
  open: boolean
  onClose: () => void
  products: FoodProduct[]
  customers: FoodCustomer[]
  onSave: (input: CreateRecurringInput) => void
}

interface ItemDraft {
  idProduct: string
  quantity: number
}

export function RecurringModal({ open, onClose, products, customers, onSave }: RecurringModalProps) {
  const [customerId, setCustomerId] = useState('')
  const [frequency, setFrequency] = useState<RecurringFrequency>('DAILY')
  const [items, setItems] = useState<ItemDraft[]>([{ idProduct: products[0]?.idProduct ?? '', quantity: 1 }])
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setCustomerId(customers[0]?.idCustomer ?? '')
      setFrequency('DAILY')
      setItems([{ idProduct: products[0]?.idProduct ?? '', quantity: 1 }])
      setLocalError(null)
    }
  }, [open, customers, products])

  const selectedCustomer = customers.find((c) => c.idCustomer === customerId)

  const getItemPrice = (idProduct: string) => {
    const custom = selectedCustomer?.customPrices?.find((cp) => cp.idProduct === idProduct)
    if (custom) return custom.customPrice
    return products.find((p) => p.idProduct === idProduct)?.basePrice ?? 0
  }

  const total = items.reduce((sum, item) => sum + getItemPrice(item.idProduct) * item.quantity, 0)

  const addItem = () => {
    const usedIds = items.map((i) => i.idProduct)
    const available = products.find((p) => !usedIds.includes(p.idProduct))
    setItems((prev) => [...prev, { idProduct: available?.idProduct ?? products[0]?.idProduct ?? '', quantity: 1 }])
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

  const handleSave = () => {
    if (!customerId) {
      setLocalError('Selecciona un cliente')
      return
    }
    const validItems = items.filter((i) => i.idProduct && i.quantity > 0)
    if (validItems.length === 0) {
      setLocalError('Agrega al menos un producto')
      return
    }
    setLocalError(null)
    onSave({
      idCustomer: customerId,
      frequency,
      items: validItems.map((i) => ({ idProduct: i.idProduct, quantity: i.quantity })),
    })
    onClose()
  }

  const customerOptions = customers.map((c) => ({ value: c.idCustomer, label: c.nameCustomer }))
  const productOptions = products.map((p) => ({ value: p.idProduct, label: p.nameProduct }))

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Nuevo pedido recurrente"
      ctaLabel="Crear recurrente"
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

      <Field label="Frecuencia">
        <div className="grid grid-cols-2 gap-2">
          {RECURRING_FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFrequency(opt.id)}
              className={`py-3 px-2 rounded-2xl text-xs font-bold border-2 transition-all ${
                frequency === opt.id ? 'border-primary bg-secondary text-foreground' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-wider">Productos</p>
          <button type="button" onClick={addItem} className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
            <Plus size={12} /> Agregar
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const price = getItemPrice(item.idProduct)
            return (
              <div key={idx} className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
                <div className="flex-1">
                  <SelectField
                    size="small"
                    placeholder="Producto"
                    options={productOptions}
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

                <span className="text-xs font-mono font-bold text-foreground w-20 text-right">{formatMoney(price * item.quantity)}</span>

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

      <div className="bg-secondary rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-medium">Total por pedido</span>
          <span className="text-xl font-mono font-bold text-foreground">{formatMoney(total)}</span>
        </div>
      </div>
    </FormModal>
  )
}
