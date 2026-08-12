import { useState } from 'react'
import type { VehicleType } from '../../../../core/domain/entities/parking'
import type { ParkingVehicle } from '../../../../core/domain/entities/vehicle'
import { VEHICLE_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import type { RegisterVehicleInput } from '../../../../core/application/register-vehicle'

interface VehicleModalProps {
  open: boolean
  onClose: () => void
  vehicles: ParkingVehicle[]
  onSave: (input: RegisterVehicleInput) => void
}

export function VehicleModal({ open, onClose, vehicles, onSave }: VehicleModalProps) {
  const [plate, setPlate] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('car')

  const handleSave = () => {
    if (!plate.trim()) return
    onSave({ plate, vehicleType })
    setPlate('')
    onClose()
  }

  const vehicleLabel = (type: VehicleType) => VEHICLE_OPTIONS.find((option) => option.id === type)?.label ?? ''

  return (
    <FormModal open={open} onClose={onClose} title="Registrar vehículo" ctaLabel="Registrar vehículo" onSubmit={handleSave}>
      <Field label="Placa">
        <input
          className={inputCls + ' uppercase'}
          placeholder="ABC-123"
          value={plate}
          maxLength={7}
          onChange={(e) => setPlate(e.target.value)}
        />
      </Field>
      <Field label="Tipo de vehículo">
        <div className="grid grid-cols-3 gap-2">
          {VEHICLE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setVehicleType(option.id)}
              className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1.5 ${
                vehicleType === option.id ? 'border-primary bg-secondary text-foreground' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <option.Icon size={20} />
              {option.label}
            </button>
          ))}
        </div>
      </Field>
      {vehicles.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Vehículos registrados</p>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((vehicle) => (
              <span
                key={vehicle.id}
                className="flex items-center gap-1.5 bg-secondary text-foreground px-2.5 py-1 rounded-full text-xs font-bold"
              >
                <span className="font-mono">{vehicle.plate}</span> · {vehicleLabel(vehicle.vehicleType)}
              </span>
            ))}
          </div>
        </div>
      )}
    </FormModal>
  )
}
