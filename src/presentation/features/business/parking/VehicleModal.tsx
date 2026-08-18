import { useState } from 'react'
import type { VehicleType } from '../../../../core/domain/entities/parking'
import type { ParkingVehicle } from '../../../../core/domain/entities/vehicle'
import { VEHICLE_COLORS, VEHICLE_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { Switch } from '../../../components/core/Switch'
import { inputCls } from '../../../components/core/input'

export interface VehicleFormData {
  plate: string
  vehicleType: VehicleType
  color?: string
  brand?: string
  model?: string
  phone?: string
  email?: string
  monthly?: boolean
  monthlyDate?: string
}

interface VehicleModalProps {
  open: boolean
  onClose: () => void
  initial?: ParkingVehicle | null
  onSave: (input: VehicleFormData) => void
}

export function VehicleModal({ open, onClose, initial, onSave }: VehicleModalProps) {
  const [plate, setPlate] = useState(initial?.plate ?? '')
  const [vehicleType, setVehicleType] = useState<VehicleType>(initial?.vehicleType ?? 'car')
  const [color, setColor] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [monthly, setMonthly] = useState(false)
  const [monthlyDate, setMonthlyDate] = useState('')

  const handleSave = () => {
    if (!plate.trim()) return
    onSave({
      plate,
      vehicleType,
      color: color || undefined,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      monthly: monthly || undefined,
      monthlyDate: monthly ? monthlyDate || undefined : undefined,
    })
    onClose()
  }

  const isEdit = Boolean(initial)

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar vehículo' : 'Registrar vehículo'}
      ctaLabel={isEdit ? 'Guardar cambios' : 'Registrar vehículo'}
      onSubmit={handleSave}
    >
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
        {color && (
          <p className="text-xs font-bold text-muted-foreground mt-2">
            Color seleccionado: {VEHICLE_COLORS.find((option) => option.id === color)?.label}
          </p>
        )}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Marca">
          <input className={inputCls} placeholder="Renault" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </Field>
        <Field label="Modelo">
          <input
            className={inputCls}
            placeholder="2020"
            inputMode="numeric"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Teléfono">
          <input
            className={inputCls}
            type="tel"
            placeholder="300 000 0000"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
        <Field label="Correo">
          <input
            className={inputCls}
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
      </div>
      <div className="mb-5">
        <Switch checked={monthly} onChange={setMonthly} label="Mensualidad" />
        {monthly && (
          <div className="mt-3">
            <Field label="Fecha inicio mensualidad">
              <input
                className={inputCls}
                type="date"
                value={monthlyDate}
                onChange={(e) => setMonthlyDate(e.target.value)}
              />
            </Field>
          </div>
        )}
      </div>
    </FormModal>
  )
}