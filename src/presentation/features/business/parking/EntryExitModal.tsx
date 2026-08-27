import { useState, useEffect, useCallback } from 'react'
import { LogIn, LogOut, AlertCircle, Search } from 'lucide-react'
import type { PaymentMethod } from '../../../../core/domain/entities/api'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { PARKING_PAYMENT_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { Toggle } from '../../../components/core/Toggle'
import { inputCls } from '../../../components/core/input'
import { SelectField } from '../../../components/core/SelectField'
import {
  useToggleParkingTicket,
  useParkingRates,
  useRegisterParkingVehicle,
  useRegisterTicketPayments,
} from '../../../hooks/useParkingQuery'
import { getErrorMessage, http } from '../../../../infrastructure/api/http-client'

interface EntryExitModalProps {
  open: boolean
  onClose: () => void
  idBusiness: string
}

interface ActiveTicketResult {
  idTicket: string
  entryTime: string
  exitTime: string | null
  totalAmount: number | null
  paidAmount: string
  paymentStatus: string
  statusTicket: string
}

interface PaymentRow {
  method: PaymentMethod
  amount: number
}

export function EntryExitModal({ open, onClose, idBusiness }: EntryExitModalProps) {
  const [mode, setMode] = useState<'entrada' | 'salida'>('entrada')
  const [plate, setPlate] = useState('')
  const [customTime, setCustomTime] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [selectedTicket, setSelectedTicket] = useState<ActiveTicketResult | null>(null)
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('NEQUI')
  const [newPaymentAmount, setNewPaymentAmount] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [showVehicleRegister, setShowVehicleRegister] = useState(false)
  const [vehicleTypeForRegister, setVehicleTypeForRegister] = useState<'MOTO' | 'CARRO' | 'CAMIONETA'>('MOTO')
  const [isQuerying, setIsQuerying] = useState(false)
  const [modeResolved, setModeResolved] = useState(false)

  const { mutate: toggleTicket } = useToggleParkingTicket()
  const { mutate: registerVehicle } = useRegisterParkingVehicle()
  const { mutate: registerPayments } = useRegisterTicketPayments()
  const { data: ratesData } = useParkingRates(idBusiness)

  const rates = ratesData ?? []

  const normalizedPlate = plate.trim().toUpperCase().replace(/[\s-]+/g, '')

  const queryActiveTicket = useCallback(async (plateStr: string) => {
    if (plateStr.length < 6) {
      setSelectedTicket(null)
      setModeResolved(false)
      return
    }
    setIsQuerying(true)
    try {
      const ticket = await http.get<ActiveTicketResult>(
        `/parking-tickets/active?idBusiness=${idBusiness}&licensePlate=${encodeURIComponent(plateStr)}`
      )
      setSelectedTicket(ticket)
      setMode('salida')
    } catch {
      setSelectedTicket(null)
      setMode('entrada')
    } finally {
      setIsQuerying(false)
      setModeResolved(true)
    }
  }, [idBusiness])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (normalizedPlate.length === 6) {
        queryActiveTicket(normalizedPlate)
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [normalizedPlate, queryActiveTicket])

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode('entrada')
      setPlate('')
      setSelectedTicket(null)
      setPayments([])
      setLocalError(null)
      setShowVehicleRegister(false)
      setIsQuerying(false)
      setModeResolved(false)
    }
  }, [open])

  const getExitFee = () => {
    if (!selectedTicket || !rates.length) return 0
    const vehicleType = 'CARRO'
    const hourRate = rates.find((r) => r.vehicleType === vehicleType && r.shiftType === 'HOUR')?.price ?? 0
    const entry = new Date(selectedTicket.entryTime)
    const now = new Date()
    const hours = Math.max(1, Math.ceil((now.getTime() - entry.getTime()) / (1000 * 60 * 60)))
    return hours * hourRate
  }

  const exitFee = getExitFee()
  const paid = payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = Math.max(0, exitFee - paid)

  const addPayment = () => {
    const amount = Number(newPaymentAmount)
    if (!amount || amount <= 0) return
    if (exitFee > 0 && paid + amount > exitFee) {
      setLocalError('El pago no puede superar el valor a cobrar')
      return
    }
    setLocalError(null)
    setPayments((prev) => [...prev, { method: newPaymentMethod, amount }])
    setNewPaymentAmount('')
  }

  const removePayment = (index: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== index))
  }

  const normalizePlate = (p: string) => p.trim().toUpperCase().replace(/[\s-]+/g, '')

  const handleClose = () => {
    setMode('entrada')
    setPlate('')
    setSelectedTicket(null)
    setPayments([])
    setLocalError(null)
    setShowVehicleRegister(false)
    setIsQuerying(false)
    setModeResolved(false)
    onClose()
  }

  const handleSave = () => {
    if (mode === 'entrada') {
      if (!plate.trim()) return
      setLocalError(null)
      toggleTicket(
        { idBusiness, licensePlate: normalizedPlate, customTime: new Date(customTime).toISOString() },
        {
          onSuccess: () => handleClose(),
          onError: (error) => {
            const msg = getErrorMessage(error)
            if (msg.includes('no esta registrado') || msg.includes('no está registrado')) {
              setShowVehicleRegister(true)
              setLocalError(null)
            } else {
              setLocalError(msg)
            }
          },
        }
      )
    } else {
      if (!selectedTicket) return
      const paymentsArray = payments
        .filter((p) => p.amount > 0)
        .map((p) => ({ amount: p.amount, paymentMethod: p.method }))

      toggleTicket(
        { idBusiness, licensePlate: normalizedPlate },
        {
          onSuccess: () => {
            if (paymentsArray.length > 0) {
              registerPayments(
                { idTicket: selectedTicket.idTicket, input: { payments: paymentsArray } },
                { onSuccess: () => handleClose() },
              )
            } else {
              handleClose()
            }
          },
        },
      )
    }
  }

  const handleRegisterVehicle = () => {
    if (!plate.trim()) return
    const p = normalizePlate(plate)
    registerVehicle(
      { idBusiness, input: { licensePlate: p, vehicleType: vehicleTypeForRegister, ownerName: 'Pendiente', phoneOwner: '0000000000' } },
      { onSuccess: () => { setShowVehicleRegister(false); handleClose() } }
    )
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title={showVehicleRegister ? 'Registrar vehículo' : 'Registrar entrada / salida'}
      ctaLabel={
        showVehicleRegister
          ? 'Registrar vehículo'
          : mode === 'entrada'
            ? 'Registrar entrada'
            : 'Registrar salida'
      }
      onSubmit={showVehicleRegister ? handleRegisterVehicle : handleSave}
    >
      {localError && (
        <div className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      {showVehicleRegister ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">El vehículo no está registrado. Crea el registro rápido:</p>
          <Field label="Placa">
            <input className={inputCls + ' uppercase'} value={plate} readOnly />
          </Field>
          <Field label="Tipo de vehículo">
            <div className="grid grid-cols-3 gap-2">
              {(['MOTO', 'CARRO', 'CAMIONETA'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVehicleTypeForRegister(type)}
                  className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1.5 ${
                    vehicleTypeForRegister === type ? 'border-primary bg-secondary text-foreground' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  <span className="text-lg">{type === 'MOTO' ? '🏍️' : type === 'CARRO' ? '🚗' : '🚙'}</span>
                  {type}
                </button>
              ))}
            </div>
          </Field>
          <p className="text-xs text-muted-foreground mt-2">Se creará con datos mínimos; edítalo luego para completar propietario, teléfono, etc.</p>
        </>
      ) : (
        <>
          <Field label="Placa" required>
            <div className="relative">
              <input
                className={inputCls + ' uppercase pr-10'}
                placeholder="ABC-123"
                value={plate}
                maxLength={7}
                onChange={(e) => setPlate(e.target.value)}
              />
              {isQuerying && (
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-pulse" />
              )}
            </div>
          </Field>

          {selectedTicket && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 mb-3 flex items-start gap-2">
              <Search size={16} className="text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-700">Ticket activo encontrado</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Entrada: {new Date(selectedTicket.entryTime).toLocaleString('es-CO')}
                </p>
              </div>
            </div>
          )}

          {modeResolved && (
            <Field label="Acción">
              <Toggle
                options={[
                  { id: 'entrada', label: 'Entrada', Icon: LogIn },
                  { id: 'salida', label: 'Salida', Icon: LogOut },
                ]}
                value={mode}
                onChange={(v) => setMode(v as 'entrada' | 'salida')}
                disabled
              />
            </Field>
          )}

          {mode === 'entrada' ? (
            <Field label="Fecha de entrada" required>
              <input
                className={inputCls}
                type="datetime-local"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </Field>
          ) : (
            <>
              {selectedTicket && (
                <div className="bg-secondary rounded-2xl p-4 mb-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Valor a cobrar</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {normalizedPlate} · Entrada: {new Date(selectedTicket.entryTime).toLocaleString('es-CO')}
                      </p>
                    </div>
                    <span className="text-2xl font-mono font-bold text-foreground">{formatMoney(exitFee)}</span>
                  </div>
                </div>
              )}

          {selectedTicket && (
            <div className="bg-secondary rounded-2xl p-4 mb-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Valor a cobrar</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {normalizedPlate} · Entrada: {new Date(selectedTicket.entryTime).toLocaleString('es-CO')}
                  </p>
                </div>
                <span className="text-2xl font-mono font-bold text-foreground">{formatMoney(exitFee)}</span>
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

              {paid > 0 && paid < exitFee && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 text-center mt-3">
                  Pago parcial: ${paid.toLocaleString()}. Pendiente: ${remaining.toLocaleString()}.
                </div>
              )}
              {paid === 0 && (
                <p className="bg-amber-50 border border-amber-100 text-amber-700 rounded-xl p-2 text-xs text-center mt-3">
                  Pago pendiente.
                </p>
              )}
              {paid >= exitFee && exitFee > 0 && (
                <p className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-2 text-xs text-center mt-3">
                  Pago completo.
                </p>
              )}
            </div>
          )}
            </>
          )}
        </>
      )}
    </FormModal>
  )
}
