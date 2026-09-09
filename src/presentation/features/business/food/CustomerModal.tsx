import { useState } from 'react'
import type { FoodCustomer, FoodProduct, CreateCustomerInput } from '../../../../core/domain/entities/food'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'

interface CustomerModalProps {
  open: boolean
  onClose: () => void
  initial?: FoodCustomer | null
  products: FoodProduct[]
  onSave: (input: CreateCustomerInput) => void
}

export function CustomerModal({ open, onClose, initial, onSave }: CustomerModalProps) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useResetOnOpen(open, () => {
    if (initial) {
      setName(initial.nameCustomer)
      setLocation(initial.locationCustomer)
      setPhone(initial.phoneCustomer)
      setEmail(initial.emailCustomer ?? '')
      setDescription(initial.descriptionCustomer ?? '')
    } else {
      setName('')
      setLocation('')
      setPhone('')
      setEmail('')
      setDescription('')
    }
    setLocalError(null)
  })

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
      emailCustomer: email.trim() || undefined,
      descriptionCustomer: description.trim() || undefined,
    })
    onClose()
  }

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
    </FormModal>
  )
}