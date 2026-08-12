import { useMemo, useState } from 'react'
import { BarChart3, CarFront, ChevronRight, Coins, Plus } from 'lucide-react'
import type { ParkingEntry } from '../../../../core/domain/entities/parking'
import type { ParkingVehicle } from '../../../../core/domain/entities/vehicle'
import { TOTAL_SPACES, parkingFee, type ParkingRates } from '../../../../core/domain/services/parking'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import {
  useParkingEntries,
  useParkingVehicles,
  useRegisterParkingEntry,
  useRegisterParkingExit,
  useRegisterParkingVehicle,
} from '../../../hooks/useParkingQuery'
import { PrimaryButton } from '../../../components/core/PrimaryButton'
import { EntryExitModal } from './EntryExitModal'
import { RatesModal } from './RatesModal'
import { VehicleModal } from './VehicleModal'

const EMPTY_ENTRIES: ParkingEntry[] = []
const EMPTY_VEHICLES: ParkingVehicle[] = []

interface ParquederoSectionProps {
  parkingRates: ParkingRates
  onUpdateRates: (rates: ParkingRates) => void
}

export function ParquederoSection({ parkingRates, onUpdateRates }: ParquederoSectionProps) {
  const entriesQuery = useParkingEntries()
  const vehiclesQuery = useParkingVehicles()
  const registerEntry = useRegisterParkingEntry()
  const registerExit = useRegisterParkingExit()
  const registerVehicle = useRegisterParkingVehicle()
  const [showEntryExit, setShowEntryExit] = useState(false)
  const [showVehicle, setShowVehicle] = useState(false)
  const [showRates, setShowRates] = useState(false)

  const entries = entriesQuery.data ?? EMPTY_ENTRIES
  const vehicles = vehiclesQuery.data ?? EMPTY_VEHICLES

  const active = useMemo(() => entries.filter((entry) => entry.status === 'active'), [entries])
  const completed = useMemo(() => entries.filter((entry) => entry.status === 'completed'), [entries])

  const parkingStats = useMemo(() => {
    const activeFee = active.reduce((sum, entry) => sum + parkingFee(entry, parkingRates), 0)
    const completedAmount = completed.reduce((sum, entry) => sum + (entry.amount ?? 0), 0)
    return {
      total: TOTAL_SPACES,
      occupied: active.length,
      free: TOTAL_SPACES - active.length,
      todayRevenue: completedAmount + activeFee,
      activeFee,
      completedAmount,
      entriesCount: completed.length + active.length,
    }
  }, [active, completed, parkingRates])

  return (
    <div>
      {entriesQuery.isError && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 mb-5">
          No se pudo conectar con el servidor. Verifica que la API esté disponible.
        </p>
      )}

      <div className="hidden md:flex justify-end mb-4">
        <PrimaryButton className="md:w-auto md:px-6" onClick={() => setShowEntryExit(true)}>
          <Plus size={18} />
          Registrar entrada / salida
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-card border border-border rounded-2xl p-3 text-center">
          <p className="text-2xl font-mono font-bold text-foreground">{parkingStats.total}</p>
          <p className="text-xs text-muted-foreground font-bold mt-0.5">Total</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-mono font-bold text-rose-600">{parkingStats.occupied}</p>
          <p className="text-xs text-rose-500 font-bold mt-0.5">Ocupados</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-mono font-bold text-emerald-600">{parkingStats.free}</p>
          <p className="text-xs text-emerald-500 font-bold mt-0.5">Libres</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recaudo de hoy</p>
            <p className="text-2xl font-mono font-bold text-foreground mt-1">{formatMoney(parkingStats.todayRevenue)}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-brand)' }}>
            <BarChart3 size={22} className="text-white" />
          </div>
        </div>
        <div className="flex gap-4 mt-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Activos</p>
            <p className="text-sm font-mono font-bold text-foreground">{formatMoney(parkingStats.activeFee)}</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Completados</p>
            <p className="text-sm font-mono font-bold text-foreground">{formatMoney(parkingStats.completedAmount)}</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Ingresos</p>
            <p className="text-sm font-mono font-bold text-foreground">{parkingStats.entriesCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-2 mb-5 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setShowVehicle(true)}
          className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 text-left active:scale-[0.99] transition-all hover:border-primary/50 hover:shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
            <CarFront size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Registrar vehículo</p>
            <p className="text-xs text-muted-foreground">Placas y tipo de vehículo</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={() => setShowRates(true)}
          className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 text-left active:scale-[0.99] transition-all hover:border-primary/50 hover:shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
            <Coins size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Tarifas</p>
            <p className="text-xs text-muted-foreground">Valor por hora, noche, día y mes</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="sticky bottom-24 md:bottom-4 -mx-5 px-5 pt-3 bg-background/95 backdrop-blur-sm md:hidden">
        <PrimaryButton onClick={() => setShowEntryExit(true)}>
          <Plus size={18} />
          Registrar entrada / salida
        </PrimaryButton>
      </div>

      <EntryExitModal
        open={showEntryExit}
        onClose={() => setShowEntryExit(false)}
        active={active}
        rates={parkingRates}
        onRegisterEntry={registerEntry.mutate}
        onRegisterExit={registerExit.mutate}
      />
      <VehicleModal
        open={showVehicle}
        onClose={() => setShowVehicle(false)}
        vehicles={vehicles}
        onSave={registerVehicle.mutate}
      />
      <RatesModal open={showRates} onClose={() => setShowRates(false)} rates={parkingRates} onSave={onUpdateRates} />
    </div>
  )
}
