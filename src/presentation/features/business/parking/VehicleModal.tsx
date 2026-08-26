import { useEffect, useState } from 'react'
import type { VehicleType, PaymentMethod } from '../../../../core/domain/entities/api'
import { API_VEHICLE_OPTIONS, VEHICLE_COLORS, PARKING_PAYMENT_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import { useRegisterParkingVehicle, useUpdateParkingVehicle, useToggleParkingTicket, useActivateMonthly, useParkingRates } from '../../../hooks/useParkingQuery'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../query/keys'

interface VehicleModalProps {
  open: boolean
  onClose: () => void
  idBusiness: string
  hasRates?: boolean
  initial?: {
    idVehicle: string
    licensePlate: string
    vehicleType: VehicleType
    ownerName: string
    phoneOwner: string
    emailOwner: string | null
    color: string | null
    brand: string | null
    model: string | null
  } | null
}

const PLATE_PATTERNS: Record<VehicleType, RegExp> = {
  CARRO: /^[A-Z]{3}\d{3}$/,
  CAMIONETA: /^[A-Z]{3}\d{3}$/,
  MOTO: /^[A-Z]{3}\d{2}[A-Z]$/,
}

interface PaymentRow {
  method: PaymentMethod
  amount: number
}

export function VehicleModal({ open, onClose, idBusiness, hasRates = true, initial }: VehicleModalProps) {
  const isEdit = Boolean(initial)
  const queryClient = useQueryClient()
  const [licensePlate, setLicensePlate] = useState(initial?.licensePlate ?? '')
  const [vehicleType, setVehicleType] = useState<VehicleType>(initial?.vehicleType ?? 'MOTO')
  const [ownerName, setOwnerName] = useState(initial?.ownerName ?? '')
  const [phoneOwner, setPhoneOwner] = useState(initial?.phoneOwner ?? '')
  const [emailOwner, setEmailOwner] = useState(initial?.emailOwner ?? '')
  const [color, setColor] = useState(initial?.color ?? '')
  const [brand, setBrand] = useState(initial?.brand ?? '')
  const [model, setModel] = useState(initial?.model ?? '')
  const [localError, setLocalError] = useState<string | null>(null)

  const [activateMonthly, setActivateMonthly] = useState(false)
  const [monthlyStartDate, setMonthlyStartDate] = useState(() => {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  })
  const [monthlyPayments, setMonthlyPayments] = useState<PaymentRow[]>([])
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('NEQUI')
  const [newPaymentAmount, setNewPaymentAmount] = useState('')

  useEffect(() => {
    if (open && initial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLicensePlate(initial.licensePlate ?? '')
      setVehicleType(initial.vehicleType ?? 'MOTO')
      setOwnerName(initial.ownerName ?? '')
      setPhoneOwner(initial.phoneOwner ?? '')
      setEmailOwner(initial.emailOwner ?? '')
      setColor((initial.color ?? '').toLowerCase())
      setBrand(initial.brand ?? '')
      setModel(initial.model ?? '')
      setLocalError(null)
      setActivateMonthly(false)
      const today = new Date()
      setMonthlyStartDate(today.toISOString().slice(0, 10))
      setMonthlyPayments([])
      setNewPaymentMethod('NEQUI')
      setNewPaymentAmount('')
    } else if (open && !initial) {
      setLicensePlate('')
      setVehicleType('MOTO')
      setOwnerName('')
      setPhoneOwner('')
      setEmailOwner('')
      setColor('')
      setBrand('')
      setModel('')
      setLocalError(null)
      setActivateMonthly(false)
      const today = new Date()
      setMonthlyStartDate(today.toISOString().slice(0, 10))
      setMonthlyPayments([])
      setNewPaymentMethod('NEQUI')
      setNewPaymentAmount('')
    }
  }, [open, initial])

  const { mutate: registerVehicle } = useRegisterParkingVehicle()
  const { mutate: updateVehicle } = useUpdateParkingVehicle()
  const { mutate: toggleTicket } = useToggleParkingTicket()
  const { mutate: activateMonthlyMut } = useActivateMonthly()
  const { data: ratesData } = useParkingRates(idBusiness)

  const monthlyPrice = ratesData?.find((r) => r.vehicleType === vehicleType && r.shiftType === 'MONTHLY')?.price ?? 0
  const monthlyPaid = monthlyPayments.reduce((sum, p) => sum + p.amount, 0)
  const monthlyRemaining = Math.max(0, monthlyPrice - monthlyPaid)

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const minDate = oneMonthAgo.toISOString().slice(0, 10)
  const maxDate = new Date().toISOString().slice(0, 10)

  const addPayment = () => {
    const amount = Number(newPaymentAmount)
    if (!amount || amount <= 0) return
    if (monthlyPrice > 0 && monthlyPaid + amount > monthlyPrice) {
      setLocalError('El pago no puede superar el precio mensual')
      return
    }
    setLocalError(null)
    setMonthlyPayments((prev) => [...prev, { method: newPaymentMethod, amount }])
    setNewPaymentAmount('')
  }

  const removePayment = (index: number) => {
    setMonthlyPayments((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const normalizedPlate = licensePlate.trim().toUpperCase().replace(/[\s-]+/g, '')
    if (!normalizedPlate) {
      setLocalError('La placa es obligatoria')
      return false
    }
    const pattern = PLATE_PATTERNS[vehicleType]
    if (!pattern.test(normalizedPlate)) {
      setLocalError(`Formato de placa inválido para ${vehicleType}. Ejemplo: ${vehicleType === 'MOTO' ? 'ABC12H' : 'ABC123'}`)
      return false
    }
    setLocalError(null)
    return true
  }

  const handleSave = () => {
    if (!validate()) return
    if (!hasRates) {
      setLocalError('Configure las tarifas primero para poder registrar vehículos.')
      return
    }

    const input = {
      licensePlate: licensePlate.trim().toUpperCase().replace(/[\s-]+/g, ''),
      vehicleType,
      ownerName: ownerName.trim() || 'Sin nombre',
      phoneOwner: phoneOwner.trim() || '0000000000',
      emailOwner: emailOwner.trim() || undefined,
      color: color || undefined,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
    }

    if (isEdit && initial) {
      updateVehicle({ idBusiness, idVehicle: initial.idVehicle, patch: input })
      onClose()
      return
    }

    registerVehicle(
      { idBusiness, input },
      {
        onSuccess: () => {
          if (activateMonthly) {
            toggleTicket(
              { idBusiness, licensePlate: input.licensePlate },
              {
                onSuccess: (ticket) => {
                  const payments = monthlyPayments.length > 0
                    ? monthlyPayments.map((p) => ({ amount: p.amount, paymentMethod: p.method }))
                    : undefined
                  activateMonthlyMut(
                    {
                      idTicket: ticket.idTicket,
                      input: { payments, startDate: monthlyStartDate },
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: queryKeys.parking.vehicles(idBusiness) })
                        onClose()
                      },
                    },
                  )
                },
                onError: () => onClose(),
              },
            )
          } else {
            onClose()
          }
        },
      },
    )
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar vehículo' : 'Registrar vehículo'}
      ctaLabel={isEdit ? 'Guardar cambios' : activateMonthly ? 'Crear y activar mensualidad' : 'Registrar vehículo'}
      onSubmit={handleSave}
    >
      {localError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{localError}</p>
      )}

      {!isEdit && !hasRates && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm mb-5 text-amber-700">
          No hay tarifas configuradas. Ve a Tarifas para definir precios antes de registrar vehículos.
        </div>
      )}

      <Field label="Placa" required>
        <input
          className={inputCls + ' uppercase'}
          placeholder="ABC-123"
          value={licensePlate}
          maxLength={12}
          readOnly={isEdit}
          onChange={(e) => { if (!isEdit) setLicensePlate(e.target.value) }}
        />
      </Field>

      <Field label="Tipo de vehículo" required>
        <div className="grid grid-cols-3 gap-2">
          {API_VEHICLE_OPTIONS.map((option) => {
            const selected = vehicleType === option.id
            return (
              <button
                key={option.id}
                type="button"
                disabled={isEdit}
                onClick={() => { if (!isEdit) setVehicleType(option.id) }}
                className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1.5 ${
                  isEdit
                    ? `opacity-60 cursor-not-allowed ${selected ? 'border-primary bg-secondary text-foreground' : 'border-border text-muted-foreground'}`
                    : `cursor-pointer ${selected ? 'border-primary bg-secondary text-foreground' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'}`
                }`}
              >
                <option.Icon size={20} />
                {option.label}
              </button>
            )
          })}
        </div>
      </Field>

      <Field label="Color">
        <div className="flex flex-wrap gap-2.5">
          {VEHICLE_COLORS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-label={option.label}
              onClick={() => setColor(option.id === color ? '' : option.id)}
              className={`w-9 h-9 rounded-full transition-all cursor-pointer ${
                color === option.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: option.value }}
            />
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Marca">
          <input className={inputCls} placeholder="Renault" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </Field>
        <Field label="Modelo">
          <input className={inputCls} placeholder="2020" inputMode="numeric" value={model} onChange={(e) => setModel(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Teléfono">
          <input className={inputCls} type="tel" placeholder="300 000 0000" inputMode="tel" value={phoneOwner} onChange={(e) => setPhoneOwner(e.target.value)} />
        </Field>
        <Field label="Correo">
          <input className={inputCls} type="email" placeholder="correo@ejemplo.com" value={emailOwner} onChange={(e) => setEmailOwner(e.target.value)} />
        </Field>
      </div>

      <Field label="Propietario">
        <input className={inputCls} placeholder="Juan Pérez" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
      </Field>

      {!isEdit && (
        <>
          <div className="border-t border-border pt-4 mt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activateMonthly}
                onChange={(e) => setActivateMonthly(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
              />
              <div>
                <p className="text-sm font-bold text-foreground">Activar mensualidad</p>
                <p className="text-xs text-muted-foreground">Requiere registro previo de entrada</p>
              </div>
            </label>
          </div>

          {activateMonthly && (
            <div className="bg-secondary rounded-2xl p-4 mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-muted-foreground">Precio mensual</p>
                <p className="text-lg font-mono font-bold text-foreground">${monthlyPrice.toLocaleString()}</p>
              </div>

              <Field label="Fecha de inicio">
                <input
                  className={inputCls}
                  type="date"
                  value={monthlyStartDate}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setMonthlyStartDate(e.target.value)}
                />
              </Field>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">Pago(s) registrados</p>
                {monthlyPayments.length > 0 && (
                  <div className="grid gap-2 mb-3">
                    {monthlyPayments.map((p, i) => {
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
                    <select
                      className={inputCls + ' flex-[3] appearance-none cursor-pointer'}
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value as PaymentMethod)}
                    >
                      <option value="" disabled>Medio de pago</option>
                      {PARKING_PAYMENT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
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
              </div>

              {monthlyPaid > 0 && monthlyPaid < monthlyPrice && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 text-center">
                  Pago parcial: ${monthlyPaid.toLocaleString()}. Pendiente: ${monthlyRemaining.toLocaleString()}.
                </div>
              )}
              {monthlyPaid === 0 && (
                <p className="bg-amber-50 border border-amber-100 text-amber-700 rounded-xl p-2 text-xs text-center">
                  Pago pendiente.
                </p>
              )}
              {monthlyPaid >= monthlyPrice && monthlyPrice > 0 && (
                <p className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-2 text-xs text-center">
                  Pago completo.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </FormModal>
  )
}
