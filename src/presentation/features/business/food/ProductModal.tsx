import { useState } from 'react'
import type { FoodProduct, CreateProductInput } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'

interface ProductModalProps {
  open: boolean
  onClose: () => void
  initial?: FoodProduct | null
  onSave: (input: CreateProductInput) => void
}

export function ProductModal({ open, onClose, initial, onSave }: ProductModalProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useResetOnOpen(open, () => {
    if (initial) {
      setName(initial.nameProduct)
      setPrice(String(initial.basePrice))
    } else {
      setName('')
      setPrice('')
    }
    setLocalError(null)
  })

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setLocalError('El nombre es obligatorio')
      return
    }
    const parsed = Number(price)
    if (!parsed || parsed <= 0) {
      setLocalError('El precio debe ser mayor a 0')
      return
    }
    setLocalError(null)
    onSave({ nameProduct: trimmed, basePrice: parsed })
    onClose()
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={initial ? 'Editar producto' : 'Nuevo producto'}
      ctaLabel={initial ? 'Guardar cambios' : 'Crear producto'}
      onSubmit={handleSave}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      <Field label="Nombre del producto" required>
        <input
          className={inputCls}
          placeholder="Ej: Empanada de carne"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field label="Precio base" required>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <input
            className={inputCls + ' pl-8 font-mono'}
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </Field>

      {Number(price) > 0 && (
        <div className="bg-secondary rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Precio</p>
          <p className="text-xl font-mono font-bold text-foreground">{formatMoney(Number(price))}</p>
        </div>
      )}
    </FormModal>
  )
}
