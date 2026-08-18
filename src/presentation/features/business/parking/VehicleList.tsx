import { useMemo, useState } from 'react'
import { Bike, CalendarX, Car, List, Pencil, Trash2, Truck } from 'lucide-react'
import type { ParkingVehicle } from '../../../../core/domain/entities/vehicle'
import { VEHICLE_COLORS, VEHICLE_FILTER_OPTIONS } from '../../../type/business/constants'
import type { VehicleFormData } from './VehicleModal'

export type VehicleListItem = ParkingVehicle & Partial<VehicleFormData>

interface VehicleListProps {
  vehicles: VehicleListItem[]
  onEdit: (vehicle: VehicleListItem) => void
  onDetail: (vehicle: VehicleListItem) => void
  onDelete: (vehicle: VehicleListItem) => void
  onCancelMonthly: (vehicle: VehicleListItem) => void
}

const TYPE_ICONS = { car: Car, motorcycle: Bike, truck: Truck } as const

export function VehicleList({ vehicles, onEdit, onDetail, onDelete, onCancelMonthly }: VehicleListProps) {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(
    () => (filter === 'all' ? vehicles : vehicles.filter((v) => v.vehicleType === filter)),
    [vehicles, filter],
  )

  if (vehicles.length === 0) {
    return <p className="text-sm text-muted-foreground bg-muted rounded-2xl px-4 py-3">No hay vehículos registrados</p>
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {VEHICLE_FILTER_OPTIONS.map((option) => {
          const active = filter === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer ${
                active ? 'border-primary bg-secondary text-foreground' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {filtered.map((vehicle) => {
          const Icon = TYPE_ICONS[vehicle.vehicleType] ?? Car
          const color = VEHICLE_COLORS.find((option) => option.id === vehicle.color)
          return (
            <div key={vehicle.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono uppercase font-bold text-foreground">{vehicle.plate}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[vehicle.brand, vehicle.model].filter(Boolean).join(' · ') || 'Información incompleta'}
                  </p>
                </div>
                {color && (
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    title={color.label}
                    style={{ backgroundColor: color.value }}
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {vehicle.monthly && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 text-xs font-bold">
                    Mensualidad{vehicle.monthlyDate ? ` · ${vehicle.monthlyDate}` : ''}
                  </span>
                )}
                {vehicle.phone && (
                  <span className="bg-secondary text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-bold">
                    {vehicle.phone}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => onDetail(vehicle)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold text-primary hover:bg-secondary transition-colors cursor-pointer"
                >
                  <List size={14} />
                  Detalle
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(vehicle)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Pencil size={14} />
                  Editar
                </button>
                {vehicle.monthly && (
                  <button
                    type="button"
                    onClick={() => onCancelMonthly(vehicle)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <CalendarX size={14} />
                    Cancelar mensualidad
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Eliminar"
                  onClick={() => onDelete(vehicle)}
                  className="ml-auto flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}