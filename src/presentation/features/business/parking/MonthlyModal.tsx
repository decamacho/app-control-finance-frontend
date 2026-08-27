import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import type { PaymentMethod } from '../../../../core/domain/entities/api'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { PARKING_PAYMENT_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import { SelectField } from '../../../components/core/SelectField'
import { useActivateMonthly, useCancelMonthly } from '../../../hooks/useParkingQuery'

interface MonthlyModalProps {
  open: boolean
  onClose: () => void
  idTicket: string
  monthlyPrice: number
  isActive: boolean
  vehicleLicensePlate: string
  onActivate?: () => void
  onCancel?: () => void
}

interface PaymentRow {
  method: PaymentMethod
  amount: number
}

export function MonthlyModal({ open, onClose, idTicket, monthlyPrice, isActive, vehicleLicensePlate, onActivate, onCancel }: MonthlyModalProps) {
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('NEQUI')
  const [newPaymentAmount, setNewPaymentAmount] = useState('')
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
    return today.toISOString().slice(0, 10)
  })
  const [localError, setLocalError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: activateMonthly } = useActivateMonthly()
  const { mutate: cancelMonthly } = useCancelMonthly()

  const modeFromProps = isActive ? 'cancel' : 'activate'

  const paid = payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = Math.max(0, monthlyPrice - paid)

  const addPayment = () => {
    const amount = Number(newPaymentAmount)
    if (!amount || amount <= 0) return
    if (monthlyPrice > 0 && paid + amount > monthlyPrice) {
      setLocalError('El pago no puede superar el precio mensual')
      return
    }
    setLocalError(null)
    setPayments((prev) => [...prev, { method: newPaymentMethod, amount }])
    setNewPaymentAmount('')
  }

  const removePayment = (index: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleActivate = async () => {
    if (paid > 0 && paid < monthlyPrice) {
      setLocalError('El total debe ser igual al precio mensual o 0')
      return
    }
    if (paid > monthlyPrice) {
      setLocalError('El total no puede superar el precio mensual')
      return
    }
    setLocalError(null)
    setIsLoading(true)
    const paymentsArray = paid > 0
      ? payments.map((p) => ({ amount: p.amount, paymentMethod: p.method }))
      : undefined
    await new Promise((resolve) => {
      activateMonthly({ idTicket, input: { payments: paymentsArray, startDate } }, { onSuccess: resolve })
    })
    setIsLoading(false)
    onActivate?.()
    onClose()
  }

  const handleCancel = async () => {
    if (!confirm('¿Cancelar mensualidad? Se recalcularán los tickets cubiertos.')) return
    setLocalError(null)
    setIsLoading(true)
    await new Promise((resolve) => {
      cancelMonthly(idTicket, { onSuccess: resolve })
    })
    setIsLoading(false)
    onCancel?.()
    onClose()
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={modeFromProps === 'activate' ? 'Activar mensualidad' : 'Cancelar mensualidad'}
      ctaLabel={modeFromProps === 'activate' ? (monthlyPrice > 0 && remaining === 0 ? 'Activar mensualidad' : 'Activar sin pago') : 'Cancelar mensualidad'}
      onSubmit={modeFromProps === 'activate' ? handleActivate : handleCancel}
      submitting={isLoading}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      {modeFromProps === 'activate' && (
        <div className="mb-5">
          <Field label="Fecha de inicio">
            <input className={inputCls} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
          </Field>
        </div>
      )}

      <div className="bg-secondary rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Vehículo</p>
            <p className="font-mono uppercase font-bold text-foreground">{vehicleLicensePlate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Precio mensual</p>
            <p className="text-xl font-mono font-bold text-foreground">{formatMoney(monthlyPrice)}</p>
          </div>
        </div>

        <p className="text-xs font-bold text-muted-foreground mb-2">Pago(s) registrados</p>
        {payments.length > 0 && (
          <div className="grid gap-2 mb-3">
            {payments.map((p, i) => {
              const label = PARKING_PAYMENT_OPTIONS.find((o) => o.id === p.method)?.label ?? p.method
              return (
                <div key={i} className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
                  <span className="text-sm font-bold text-foreground flex-1">{label}</span>
                  <span className="text-sm font-mono text-foreground">${p.amount.toLocaleString()}</span>
                  <button type="button" onClick={() => removePayment(i)} className="text-rose-500 hover:text-rose-700 text-xs font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">
                    X
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-2 items-stretch">
          <div className="flex-[3]">
            <SelectField
              placeholder="Medio de pago"
              options={PARKING_PAYMENT_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
              value={newPaymentMethod || undefined}
              onChange={(val) => setNewPaymentMethod(val as PaymentMethod)}
            />
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="$0"
            className={inputCls + ' w-20 text-right font-mono'}
            value={newPaymentAmount}
            onChange={(e) => setNewPaymentAmount(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPayment() } }}
          />
          <button
            type="button"
            onClick={addPayment}
            className="w-11 h-11 shrink-0 rounded-xl bg-primary text-white text-lg font-bold hover:brightness-110 transition-all cursor-pointer flex items-center justify-center"
          >
            +
          </button>
        </div>

        {paid > 0 && paid < monthlyPrice && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 text-center mt-3">
            Pago parcial: ${paid.toLocaleString()}. Pendiente: ${remaining.toLocaleString()}.
          </div>
        )}
        {paid === 0 && (
          <p className="bg-amber-50 border border-amber-100 text-amber-700 rounded-xl p-2 text-xs text-center mt-3">
            Pago pendiente.
          </p>
        )}
        {paid >= monthlyPrice && monthlyPrice > 0 && (
          <p className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-2 text-xs text-center mt-3">
            Pago completo.
          </p>
        )}
      </div>

      {modeFromProps === 'cancel' && (
        <>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-rose-500" />
              <div>
                <p className="font-bold text-rose-700">Se cancelará la mensualidad de <span className="font-mono">{vehicleLicensePlate}</span></p>
                <p className="text-sm text-rose-600 mt-1">Se recalcularán retroactivamente los tickets que quedaron en $0 aplicando tarifa normal.</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Esta acción no se puede deshacer. Los días usados se cobrarán a tarifa normal.</p>
        </>
      )}
    </FormModal>
  )
}
