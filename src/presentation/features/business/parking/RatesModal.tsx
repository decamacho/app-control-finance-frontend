import { useState } from 'react'
import type { VehicleType } from '../../../../core/domain/entities/parking'
import { type ParkingRates, type RatePeriod } from '../../../../core/domain/services/parking'
import { VEHICLE_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'

const PERIODS: { id: RatePeriod; label: string }[] = [
  { id: 'hora', label: 'Hora' },
  { id: 'noche', label: 'Noche' },
  { id: 'dia', label: 'Día' },
  { id: 'mes', label: 'Mes' },
]

interface RatesModalProps {
  open: boolean
  onClose: () => void
  rates: ParkingRates
  onSave: (rates: ParkingRates) => void
}

export function RatesModal({ open, onClose, rates, onSave }: RatesModalProps) {
  const [draft, setDraft] = useState(rates)
  const [lastRates, setLastRates] = useState(rates)

  if (open && lastRates !== rates) {
    setLastRates(rates)
    setDraft(rates)
  }

  const setRate = (vehicleType: VehicleType, period: RatePeriod, amount: number) => {
    setDraft((current) => ({ ...current, [vehicleType]: { ...current[vehicleType], [period]: amount } }))
  }

  const handleSave = () => {
    onSave(draft)
    onClose()
  }

  return (
    <FormModal open={open} onClose={onClose} title="Tarifas de parqueo" ctaLabel="Guardar tarifas" onSubmit={handleSave}>
      <p className="text-xs text-muted-foreground mb-5">Valor que debe pagar cada vehículo según el periodo (COP).</p>
      {VEHICLE_OPTIONS.map((option) => (
        <div key={option.id} className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <option.Icon size={16} />
            </div>
            <p className="text-sm font-bold text-foreground">{option.label}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PERIODS.map((period) => (
              <Field key={period.id} label={period.label}>
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  value={draft[option.id][period.id]}
                  onChange={(e) => setRate(option.id, period.id, Math.max(0, Number(e.target.value) || 0))}
                />
              </Field>
            ))}
          </div>
        </div>
      ))}
    </FormModal>
  )
}
