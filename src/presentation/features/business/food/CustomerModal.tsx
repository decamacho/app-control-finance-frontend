import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { FoodCustomer, FoodProduct, CreateCustomerInput, ProductCustomPrice } from '../../../../core/domain/entities/food'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { Switch } from '../../../components/core/Switch'
import { inputCls } from '../../../components/core/input'

interface CustomerModalProps {
  open: boolean
  onClose: () => void
  initial?: FoodCustomer | null
  products: FoodProduct[]
  onSave: (input: CreateCustomerInput) => void
}

export function CustomerModal({ open, onClose, initial, products, onSave }: CustomerModalProps) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [customPrices, setCustomPrices] = useState<ProductCustomPrice[]>([])
  const [showCustomPrices, setShowCustomPrices] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (open && initial) {
      setName(initial.nameCustomer)
      setLocation(initial.locationCustomer)
      setPhone(initial.phoneCustomer)
      setEmail(initial.email)
      setDescription(initial.description)
      setCustomPrices(initial.customPrices ?? [])
      setShowCustomPrices((initial.customPrices?.length ?? 0) > 0)
      setLocalError(null)
    } else if (open && !initial) {
      setName('')
      setLocation('')
      setPhone('')
      setEmail('')
      setDescription('')
      setCustomPrices([])
      setShowCustomPrices(false)
      setLocalError(null)
    }
  }, [open, initial])

  const addCustomPrice = () => {
    const usedIds = customPrices.map((cp) => cp.idProduct)
    const available = products.find((p) => !usedIds.includes(p.idProduct))
    if (!available) return
    setCustomPrices((prev) => [...prev, { idProduct: available.idProduct, customPrice: available.basePrice }])
  }

  const updateCustomPrice = (idProduct: string, price: number) => {
    setCustomPrices((prev) => prev.map((cp) => (cp.idProduct === idProduct ? { ...cp, customPrice: price } : cp)))
  }

  const removeCustomPrice = (idProduct: string) => {
    setCustomPrices((prev) => prev.filter((cp) => cp.idProduct !== idProduct))
  }

  const handleSave = () => {
    if (!name.trim()) {
      setLocalError('El nombre es obligatorio')
      return
    }
    if (!phone.trim()) {
      setLocalError('El teléfono es obligatorio')
      return
    }
    setLocalError(null)
    onSave({
      nameCustomer: name.trim(),
      locationCustomer: location.trim(),
      phoneCustomer: phone.trim(),
      email: email.trim(),
      description: description.trim(),
      customPrices,
    })
    onClose()
  }

  const usedIds = customPrices.map((cp) => cp.idProduct)
  const hasAvailable = products.some((p) => !usedIds.includes(p.idProduct))

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={initial ? 'Editar cliente' : 'Nuevo cliente'}
      ctaLabel={initial ? 'Guardar cambios' : 'Crear cliente'}
      onSubmit={handleSave}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      <Field label="Nombre" required>
        <input className={inputCls} placeholder="Ej: Colegio San José" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      <Field label="Ubicación">
        <input className={inputCls} placeholder="Ej: Al frente del colegio" value={location} onChange={(e) => setLocation(e.target.value)} />
      </Field>

      <Field label="Teléfono" required>
        <input className={inputCls} type="tel" placeholder="Ej: 3001234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Field>

      <Field label="Email">
        <input className={inputCls} type="email" placeholder="Ej: compras@colegio.edu.co" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>

      <Field label="Descripción">
        <textarea
          className={inputCls + ' resize-none min-h-[80px]'}
          placeholder="Ej: Cliente recurrente, pide lun-vie. Alergia: gluten"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-muted-foreground tracking-wider">Precios personalizados</p>
          <Switch
            checked={showCustomPrices}
            onChange={(checked) => {
              setShowCustomPrices(checked)
              if (!checked) setCustomPrices([])
            }}
          />
        </div>

        {showCustomPrices && (
          <>
            {hasAvailable && (
              <button
                type="button"
                onClick={addCustomPrice}
                className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 mb-2"
              >
                <Plus size={12} /> Agregar
              </button>
            )}

            {customPrices.length > 0 && (
              <div className="space-y-2">
                {customPrices.map((cp) => {
                  const product = products.find((p) => p.idProduct === cp.idProduct)
                  return (
                    <div key={cp.idProduct} className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
                      <span className="flex-1 text-sm font-bold text-foreground truncate">{product?.nameProduct ?? 'Producto'}</span>
                      <div className="relative w-28">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="w-full bg-input-background border border-border rounded-lg px-2 pl-5 py-1.5 text-xs text-right text-foreground outline-none focus:border-primary transition-colors font-mono"
                          value={cp.customPrice || ''}
                          onChange={(e) => updateCustomPrice(cp.idProduct, Number(e.target.value) || 0)}
                        />
                      </div>
                      <button
                        type="button"
                        aria-label="Eliminar precio personalizado"
                        onClick={() => removeCustomPrice(cp.idProduct)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {customPrices.length === 0 && (
              <p className="text-xs text-muted-foreground italic bg-muted rounded-xl px-3 py-2">Selecciona un producto para asignar precio</p>
            )}
          </>
        )}
      </div>
    </FormModal>
  )
}
