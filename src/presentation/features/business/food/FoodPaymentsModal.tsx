import { useState } from 'react'
import { Banknote, Smartphone, CreditCard, Receipt, XCircle, CheckCircle2, CalendarDays } from 'lucide-react'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { FormModal } from '../../../components/core/FormModal'
import { useRegisterOrderPayments } from '../../../hooks/useFoodQuery'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'

const PAYMENT_METHODS = [
  { id: 'NEQUI', label: 'Nequi', icon: Smartphone, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
  { id: 'DEVIPLATA', label: 'Deviplata', icon: Smartphone, color: 'text-violet-500', bg: 'bg-violet-50' },
  { id: 'CASH', label: 'Efectivo', icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'BREVE', label: 'Breve', icon: Receipt, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'LLAVE', label: 'Llave', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'OTHER', label: 'Otro', icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-50' },
] as const

interface FoodPaymentsModalProps {
  open: boolean
  onClose: () => void
  idOrder: string
  totalAmount: number
  pendingAmount: number
  orderDate: string
}

function toDateStr(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return toDateStr(date)
}

export function FoodPaymentsModal({ open, onClose, idOrder, totalAmount, pendingAmount, orderDate }: FoodPaymentsModalProps) {
  const [amounts, setAmounts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    PAYMENT_METHODS.forEach((m) => { init[m.id] = 0 })
    return init
  })
  const [localError, setLocalError] = useState<string | null>(null)
  const [paymentDate, setPaymentDate] = useState(() => toDateStr(new Date()))

  const { mutate: registerPayments, isPending } = useRegisterOrderPayments()

  useResetOnOpen(open, () => {
    const resetAmounts: Record<string, number> = {}
    PAYMENT_METHODS.forEach((m) => { resetAmounts[m.id] = 0 })
    setAmounts(resetAmounts)
    setPaymentDate(toDateStr(new Date()))
    setLocalError(null)
  })

  const orderedDay = orderDate ? toDateStr(new Date(`${orderDate}T12:00:00`)) : ''
  const today = toDateStr(new Date())
  const minDate = orderedDay ? addDays(orderedDay, -1) : addDays(today, -1)

  const paid = PAYMENT_METHODS.reduce((sum, m) => sum + amounts[m.id], 0)
  const remaining = Math.max(0, pendingAmount - paid)
  const isComplete = pendingAmount > 0 && remaining === 0

  const handleSave = () => {
    if (paid === 0) {
      setLocalError('Debe ingresar al menos un pago')
      return
    }
    if (paid > pendingAmount) {
      setLocalError('El total no puede superar el pendiente')
      return
    }
    if (paymentDate > today) {
      setLocalError('La fecha de pago no puede ser posterior a hoy')
      return
    }
    if (orderedDay && paymentDate < minDate) {
      setLocalError('La fecha de pago no puede ser más de un día antes de la fecha del pedido')
      return
    }
    setLocalError(null)
    const payments = PAYMENT_METHODS
      .filter((m) => amounts[m.id] > 0)
      .map((m) => ({
        amount: amounts[m.id],
        paymentMethod: m.id,
      }))
    const paymentDateValue = orderedDay && paymentDate === orderedDay ? null : paymentDate
    registerPayments({ idOrder, input: { payments, paymentDate: paymentDateValue } }, { onSuccess: () => onClose() })
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Registrar pagos"
      ctaLabel={isComplete ? 'Confirmar pagos' : 'Agregar pagos'}
      onSubmit={handleSave}
      submitting={isPending}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      <div className="bg-secondary rounded-2xl p-4 mb-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="min-w-0 overflow-hidden">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
            <p className="text-sm font-mono font-bold text-foreground leading-snug break-words">{formatMoney(totalAmount)}</p>
          </div>
          <div className="min-w-0 overflow-hidden">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pagado</p>
            <p className="text-sm font-mono font-bold text-emerald-600 leading-snug break-words">{formatMoney(totalAmount - pendingAmount)}</p>
          </div>
          <div className="min-w-0 overflow-hidden">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pendiente</p>
            <p className="text-sm font-mono font-bold text-rose-600 leading-snug break-words">{formatMoney(pendingAmount)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-secondary rounded-2xl px-4 py-3 mb-4">
        <CalendarDays size={18} className="text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Fecha de pago (opcional)</p>
          <input
            type="date"
            value={paymentDate}
            min={minDate}
            max={today}
            onChange={(e) => setPaymentDate(e.target.value || toDateStr(new Date()))}
            className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid gap-2 mb-4">
        {PAYMENT_METHODS.map((method) => (
          <div key={method.id} className="flex items-center gap-3 bg-card border border-border rounded-2xl px-3 py-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method.bg}`}>
              <method.icon size={18} className={method.color} />
            </div>
            <span className="text-sm font-bold text-foreground flex-1">{method.label}</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="$0"
              className="w-36 bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-right text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground font-mono"
              value={amounts[method.id] || ''}
              onChange={(e) => setAmounts((prev) => ({ ...prev, [method.id]: Math.max(0, Number(e.target.value) || 0) }))}
            />
          </div>
        ))}
      </div>

      {paid > 0 && (
        <div className="bg-secondary rounded-2xl p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Suma de pagos</span>
            <span className="text-sm font-mono font-bold text-foreground">{formatMoney(paid)}</span>
          </div>
          {remaining > 0 && (
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Restante</span>
              <span className="text-sm font-mono font-bold text-rose-600">{formatMoney(remaining)}</span>
            </div>
          )}
        </div>
      )}

      {isComplete && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl px-4 py-3 text-sm font-bold flex items-center justify-center gap-2">
          <CheckCircle2 size={16} />
          Pago completo
        </div>
      )}
    </FormModal>
  )
}
