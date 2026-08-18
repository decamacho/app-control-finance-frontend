import { useState } from 'react'
import { ChevronDown, LogIn, LogOut } from 'lucide-react'
import type { ParkingEntry } from '../../../../core/domain/entities/parking'
import { parkingFee, type ParkingRates } from '../../../../core/domain/services/parking'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { PARKING_PAYMENT_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { Toggle } from '../../../components/core/Toggle'
import { inputCls } from '../../../components/core/input'
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
  const [entryDate, setEntryDate] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [selectedId, setSelectedId] = useState('')
  const [payments, setPayments] = useState<Record<string, string>>({})

  const selected = active.find((entry) => entry.id === (selectedId || active[0]?.id))
  const exitFee = selected ? parkingFee(selected, rates) : 0
  const paid = PARKING_PAYMENT_OPTIONS.reduce(
    (sum, option) => sum + (Number(payments[option.id]) || 0),
    0,
  )
  const remaining = Math.max(0, exitFee - paid)
  const completed = exitFee > 0 && remaining === 0

  const handleClose = () => {
    setMode('entrada')
    setPlate('')
    setSelectedId('')
    setPayments({})
    onClose()
  }

  const handleSave = () => {
    if (mode === 'entrada') {
      if (!plate.trim()) return
      onRegisterEntry({ plate, vehicleType: 'car', spaceNumber: '-', entryTime: entryDate })
      setPlate('')
    } else {
      if (!selected || !completed) return
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
          <Field label="Fecha de entrada">
            <input
              className={inputCls}
              type="datetime-local"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </Field>
        </>
      ) : (
        <>
          <Field label="Vehículo">
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted rounded-2xl px-4 py-3">No hay vehículos activos</p>
            ) : (
              <div className="relative">
                <select
                  className={inputCls + ' appearance-none pr-8 uppercase'}
                  value={selectedId || active[0]?.id}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  {active.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.plate}
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

          {selected && (
            <div className="mb-5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Medios de pago</p>
              <div className="grid gap-2">
                {PARKING_PAYMENT_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-center gap-3 bg-card border border-border rounded-2xl px-3 py-2">
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-sm font-bold text-foreground flex-1">{option.label}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="$0"
                      className="w-28 bg-input-background border border-border rounded-xl px-3 py-2 text-sm text-right text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground font-mono"
                      value={payments[option.id] ?? ''}
                      onChange={(e) => setPayments((prev) => ({ ...prev, [option.id]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>

              <div
                className={`mt-3 rounded-2xl px-4 py-3 text-sm font-bold flex items-center justify-between ${
                  completed ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}
              >
                <span>{completed ? 'Pago completo' : 'Falta por pagar'}</span>
                <span className="font-mono">{formatMoney(remaining)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </FormModal>
  )
}