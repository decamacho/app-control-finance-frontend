import { useState } from 'react'
import { ChevronDown, LogIn, LogOut } from 'lucide-react'
import type { ParkingEntry, VehicleType } from '../../../../core/domain/entities/parking'
import { parkingFee, type ParkingRates } from '../../../../core/domain/services/parking'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { VEHICLE_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import { Toggle } from '../../../components/core/Toggle'
import type { RegisterParkingEntryInput as RegisterEntryInput } from '../../../../core/application/register-parking-entry'

interface EntryExitModalProps {
  open: boolean
  onClose: () => void
  active: ParkingEntry[]
  rates: ParkingRates
  onRegisterEntry: (input: RegisterEntryInput) => void
  onRegisterExit: (entryId: string) => void
}

export function EntryExitModal({ open, onClose, active, rates, onRegisterEntry, onRegisterExit }: EntryExitModalProps) {
  const [mode, setMode] = useState<'entrada' | 'salida'>('entrada')
  const [plate, setPlate] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('car')
  const [spaceNumber, setSpaceNumber] = useState('')
  const [entryTime, setEntryTime] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  const [selectedId, setSelectedId] = useState('')

  const selected = active.find((entry) => entry.id === (selectedId || active[0]?.id))
  const exitFee = selected ? parkingFee(selected, rates) : 0

  const handleClose = () => {
    setMode('entrada')
    setPlate('')
    setSpaceNumber('')
    setSelectedId('')
    onClose()
  }

  const handleSave = () => {
    if (mode === 'entrada') {
      if (!plate.trim() || !spaceNumber.trim()) return
      onRegisterEntry({ plate, vehicleType, spaceNumber, entryTime })
      setPlate('')
      setSpaceNumber('')
    } else {
      if (!selected) return
      onRegisterExit(selected.id)
    }
    handleClose()
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title="Registrar entrada / salida"
      ctaLabel={mode === 'entrada' ? 'Registrar entrada' : 'Registrar salida'}
      onSubmit={handleSave}
    >
      <Field label="Acción">
        <Toggle
          options={[
            { id: 'entrada', label: 'Entrada', Icon: LogIn },
            { id: 'salida', label: 'Salida', Icon: LogOut },
          ]}
          value={mode}
          onChange={(v) => setMode(v as 'entrada' | 'salida')}
        />
      </Field>

      {mode === 'entrada' ? (
        <>
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
            <p className="text-xs text-muted-foreground mt-2 font-mono">Tarifa: {formatMoney(rates[vehicleType].hora)}/hora</p>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Espacio #">
              <input
                className={inputCls}
                type="number"
                placeholder="1"
                min={1}
                max={20}
                value={spaceNumber}
                onChange={(e) => setSpaceNumber(e.target.value)}
              />
            </Field>
            <Field label="Hora entrada">
              <input className={inputCls} type="time" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} />
            </Field>
          </div>
        </>
      ) : (
        <>
          <Field label="Vehículo">
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted rounded-2xl px-4 py-3">No hay vehículos activos</p>
            ) : (
              <div className="relative">
                <select
                  className={inputCls + ' appearance-none pr-8'}
                  value={selectedId || active[0]?.id}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  {active.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.plate} · Espacio {entry.spaceNumber}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            )}
          </Field>
          {selected && (
            <div className="bg-secondary rounded-2xl p-4 mb-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Valor a cobrar</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {selected.plate} · Desde {selected.entryTime}
                  </p>
                </div>
                <span className="text-2xl font-mono font-bold text-foreground">{formatMoney(exitFee)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </FormModal>
  )
}
