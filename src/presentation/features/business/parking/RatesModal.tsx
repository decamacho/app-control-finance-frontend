import { useState } from 'react'
import type { VehicleType } from '../../../../core/domain/entities/api'
import { API_VEHICLE_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import { useUpsertParkingRates } from '../../../hooks/useParkingQuery'

const SHIFT_OPTIONS: { id: string; label: string }[] = [
  { id: 'DAY', label: 'Día' },
  { id: 'NIGHT', label: 'Noche' },
  { id: 'HOUR', label: 'Hora' },
  { id: 'MONTHLY', label: 'Mensual' },
]

interface RatesModalProps {
  open: boolean
  onClose: () => void
  idBusiness: string
}

export function RatesModal({ open, onClose, idBusiness }: RatesModalProps) {
  const [draft, setDraft] = useState<Record<string, Record<string, number>>>({
    MOTO: { DAY: 0, NIGHT: 0, HOUR: 0, MONTHLY: 0 },
    CARRO: { DAY: 0, NIGHT: 0, HOUR: 0, MONTHLY: 0 },
    CAMIONETA: { DAY: 0, NIGHT: 0, HOUR: 0, MONTHLY: 0 },
  })
  const [isSaving, setIsSaving] = useState(false)

  const { mutate: upsertRates } = useUpsertParkingRates()

  const setRate = (vehicleType: VehicleType, shiftType: string, amount: number) => {
    setDraft((current) => ({ ...current, [vehicleType]: { ...current[vehicleType], [shiftType]: amount } }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => {
      upsertRates({ idBusiness, body: draft }, { onSuccess: resolve })
    })
    onClose()
    setIsSaving(false)
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Tarifas del parqueadero"
      ctaLabel="Guardar tarifas"
      onSubmit={handleSave}
      submitting={isSaving}
    >
      <p className="text-xs text-muted-foreground mb-5">Valores en COP. Los 3 tipos de vehículo y 4 turnos son obligatorios.</p>
      {API_VEHICLE_OPTIONS.map((option) => (
        <div key={option.id} className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <option.Icon size={16} />
            </div>
            <p className="text-sm font-bold text-foreground">{option.label}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SHIFT_OPTIONS.map((shift) => (
              <Field key={shift.id} label={shift.label} required>
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  step={100}
                  value={draft[option.id][shift.id]}
                  onChange={(e) => setRate(option.id, shift.id, Math.max(0, Number(e.target.value) || 0))}
                />
              </Field>
            ))}
          </div>
        </div>
      ))}
    </FormModal>
  )
}