import { useState } from 'react'
import { CalendarClock, Check } from 'lucide-react'
import type { CreateOrderInput, PaymentMethod } from '../../../../core/domain/entities/food'
import { FOOD_PAYMENT_OPTIONS } from '../../../type/business/constants'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'

interface ExpenseModalProps {
  open: boolean
  onClose: () => void
  idBusiness?: string
  submitting?: boolean
  onSave: (input: CreateOrderInput) => void
}

function nowLocalDateTime(): string {
  const now = new Date()
  now.setSeconds(0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export function ExpenseModal({ open, onClose, idBusiness, submitting, onSave }: ExpenseModalProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useResetOnOpen(open, () => {
    setDescription('')
    setAmount('')
    setPaymentMethod('CASH')
    setDeliveryTime(nowLocalDateTime())
    setLocalError(null)
  })

  const totalAmount = Number(amount) || 0

  const handleSave = () => {
    if (!idBusiness) {
      setLocalError('No hay negocio seleccionado')
      return
    }
    if (!description.trim()) {
      setLocalError('Escribe una descripción del gasto')
      return
    }
    if (totalAmount <= 0) {
      setLocalError('El monto debe ser mayor a 0')
      return
    }
    if (!deliveryTime) {
      setLocalError('Define la fecha y hora del gasto')
      return
    }
    setLocalError(null)
    onSave({
      orderType: 'EXPENSE',
      idBusiness,
      deliveryTime: new Date(deliveryTime).toISOString(),
      description: description.trim(),
      totalAmount,
      paymentMethod,
    })
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Nuevo gasto"
      ctaLabel="Registrar gasto"
      onSubmit={handleSave}
      submitting={submitting}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      <Field label="Descripción" required>
        <textarea
          className={inputCls}
          rows={2}
          placeholder="Ej: Cubetas de huevo, café y pan"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Field label="Monto" required>
        <input
          className={inputCls}
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
        />
        {totalAmount > 0 && (
          <p className="text-xs text-muted-foreground mt-1 font-mono">{formatMoney(totalAmount)}</p>
        )}
      </Field>

      <Field label="Método de pago" required>
        <div className="grid grid-cols-3 gap-2">
          {FOOD_PAYMENT_OPTIONS.map((option) => {
            const active = paymentMethod === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                className={`flex items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-[11px] font-bold border-2 transition-all cursor-pointer ${
                  active
                    ? 'border-primary bg-secondary text-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {option.label}
                {active && <Check size={11} />}
              </button>
            )
          })}
        </div>
      </Field>

      <Field label="Fecha y hora" required>
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