import { LogIn, LogOut } from 'lucide-react'
import type { ParkingEntry } from '../../../../core/domain/entities/parking'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { Modal } from '../../../components/core/Modal'
import { VEHICLE_COLORS } from '../../../type/business/constants'
import type { VehicleListItem } from './VehicleList'

interface VehicleDetailModalProps {
  open: boolean
  onClose: () => void
  vehicle: VehicleListItem | null
  entries: ParkingEntry[]
}

export function VehicleDetailModal({ open, onClose, vehicle, entries }: VehicleDetailModalProps) {
  if (!vehicle) return null

  const vehicleEntries = entries
    .filter((entry) => entry.plate === vehicle.plate)
    .sort((a, b) => b.entryTime.localeCompare(a.entryTime))

  const totalRevenue = vehicleEntries.reduce((sum, entry) => sum + (entry.amount ?? 0), 0)
  const color = VEHICLE_COLORS.find((option) => option.id === vehicle.color)

  return (
    <Modal open={open} onClose={onClose} title="Detalle del vehículo">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <p className="font-mono uppercase font-bold text-foreground">{vehicle.plate}</p>
          <p className="text-xs text-muted-foreground truncate">
            {[vehicle.brand, vehicle.model].filter(Boolean).join(' · ') || 'Información incompleta'}
          </p>
        </div>
        {color && (
          <span className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: color.value }} title={color.label} />
        )}
        {vehicle.monthly && (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 text-xs font-bold flex-shrink-0">
            Mensualidad
          </span>
        )}
      </div>

      {vehicleEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground bg-muted rounded-2xl px-4 py-3">Sin ingresos ni salidas registrados</p>
      ) : (
        <div className="space-y-0">
          {vehicleEntries.map((entry) => (
            <div key={entry.id} className="relative pl-6 pb-5 border-l-2 border-border">
              <span className="absolute left-0 top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary" />
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <LogIn size={15} className="text-primary" />
                Ingreso · {entry.entryTime}
              </div>
              {entry.status === 'completed' && entry.exitTime ? (
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 mt-1.5">
                  <LogOut size={15} />
                  Salida · {entry.exitTime}
                  {entry.amount != null && (
                    <span className="ml-auto font-mono text-foreground">{formatMoney(entry.amount)}</span>
                  )}
                </div>
              ) : (
                <span className="inline-block mt-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-0.5 text-xs font-bold">
                  En parqueadero
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground font-bold">
          {vehicleEntries.length} {vehicleEntries.length === 1 ? 'registro' : 'registros'}
        </p>
        <p className="text-sm text-muted-foreground font-bold">
          Recaudo <span className="font-mono text-foreground">{formatMoney(totalRevenue)}</span>
        </p>
      </div>
    </Modal>
  )
}