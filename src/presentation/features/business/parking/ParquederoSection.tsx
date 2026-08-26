import { useMemo, useState } from 'react'
import { BarChart3, CarFront, ChevronRight, Coins, Info, Plus } from 'lucide-react'
import type { ParkingVehicle, ParkingTicket } from '../../../../core/domain/entities/parking'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import {
  useActiveParkingTickets,
  useParkingTickets,
  useParkingRates,
  useParkingVehicles,
  useDeleteParkingVehicle,
} from '../../../hooks/useParkingQuery'
import { PrimaryButton } from '../../../components/core/PrimaryButton'
import { EntryExitModal } from './EntryExitModal'
import { RatesModal } from './RatesModal'
import { VehicleDetailModal } from './VehicleDetailModal'
import { VehicleList } from './VehicleList'
import { VehicleModal } from './VehicleModal'
import { PaymentsModal } from './PaymentsModal'
import { MonthlyModal } from './MonthlyModal'

interface ParquederoSectionProps {
  idBusiness: string
}

export function ParquederoSection({ idBusiness }: ParquederoSectionProps) {
  const [showEntryExit, setShowEntryExit] = useState(false)
  const [showVehicle, setShowVehicle] = useState(false)
  const [showRates, setShowRates] = useState(false)
  const [editVehicle, setEditVehicle] = useState<ParkingVehicle | null>(null)
  const [detailVehicle, setDetailVehicle] = useState<ParkingVehicle | null>(null)
  const [showPayments, setShowPayments] = useState<{ idTicket: string; totalAmount: number; pendingAmount: number } | null>(null)
  const [showMonthly, setShowMonthly] = useState<{ idTicket: string; monthlyPrice: number; isActive: boolean; vehicleLicensePlate: string } | null>(null)

  const { data: ratesData } = useParkingRates(idBusiness)
  const activeTickets = useActiveParkingTickets(idBusiness)
  const allTickets = useParkingTickets(idBusiness)
  const vehicles = useParkingVehicles(idBusiness)

  const { mutate: _deleteVehicle } = useDeleteParkingVehicle()

  const rates = ratesData ?? []
  const hasRates = rates.length > 0

  const active = useMemo(() => activeTickets.data?.filter((t) => t.ticketStatus === 'ACTIVE') ?? [], [activeTickets.data])
  const completed = useMemo(() => allTickets.data?.filter((t) => t.ticketStatus === 'COMPLETED') ?? [], [allTickets.data])

  const parkingStats = useMemo(() => {
    const activeFee = active.reduce((sum, entry) => sum + entry.pendingAmount, 0)
    const completedAmount = completed.reduce((sum, entry) => sum + entry.totalAmount, 0)
    return {
      total: 0,
      occupied: active.length,
      free: 0,
      todayRevenue: completedAmount + activeFee,
      activeFee,
      completedAmount,
      entriesCount: completed.length + active.length,
    }
  }, [active, completed])

  const monthlyPriceForVehicle = (plate: string) => {
    const vehicle = vehicles.data?.find((v) => v.licensePlate === plate)
    if (!vehicle) return 0
    const monthlyRate = rates.find((r) => r.vehicleType === vehicle.vehicleType && r.shiftType === 'MONTHLY')
    return monthlyRate?.price ?? 0
  }

  const handleEditVehicle = (vehicle: ParkingVehicle) => setEditVehicle(vehicle)
  const handleDetailVehicle = (vehicle: ParkingVehicle) => setDetailVehicle(vehicle)

  const handleDeleteVehicle = (vehicle: ParkingVehicle) => {
    if (confirm(`Eliminar ${vehicle.licensePlate}?`)) {
      _deleteVehicle({ idBusiness, idVehicle: vehicle.idVehicle })
    }
  }

  const handlePayTicket = (ticket: ParkingTicket) => {
    setShowPayments({ idTicket: ticket.idTicket, totalAmount: ticket.totalAmount, pendingAmount: ticket.pendingAmount })
  }

  const handleActivateMonthly = (vehicle: ParkingVehicle) => {
    const vehicleTickets = (allTickets.data ?? []).filter((t) => t.licensePlate === vehicle.licensePlate)
    const activeTicket = vehicleTickets.find((t) => t.ticketStatus === 'ACTIVE')
    if (!activeTicket) return
    setShowMonthly({
      idTicket: activeTicket.idTicket,
      monthlyPrice: monthlyPriceForVehicle(vehicle.licensePlate),
      isActive: false,
      vehicleLicensePlate: vehicle.licensePlate,
    })
  }

  const handleCancelMonthly = (vehicle: ParkingVehicle) => {
    const vehicleTickets = (allTickets.data ?? []).filter((t) => t.licensePlate === vehicle.licensePlate)
    const activeTicket = vehicleTickets.find((t) => t.ticketStatus === 'ACTIVE')
    if (!activeTicket) return
    setShowMonthly({
      idTicket: activeTicket.idTicket,
      monthlyPrice: monthlyPriceForVehicle(vehicle.licensePlate),
      isActive: true,
      vehicleLicensePlate: vehicle.licensePlate,
    })
  }

  return (
    <div>
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

      {!hasRates && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <Info size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-700">No hay tarifas configuradas</p>
            <p className="text-xs text-amber-600 mt-1">Ve a Tarifas para definir precios por tipo de vehículo y turno. No se podrán registrar vehículos hasta que configure al menos una tarifa.</p>
          </div>
        </div>
      )}

      <div className="hidden md:flex gap-2 mb-5">
        <button
          type="button"
          disabled={!hasRates}
          onClick={() => hasRates && setShowVehicle(true)}
          className={`flex items-center gap-3 flex-1 border rounded-2xl p-4 text-left transition-all ${
            hasRates ? 'bg-card border-border hover:border-primary/50 hover:shadow-sm active:scale-[0.99] cursor-pointer' : 'bg-muted border-border opacity-60 cursor-not-allowed'
          }`}
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
          className="flex items-center gap-3 flex-1 bg-card border border-border rounded-2xl p-4 text-left active:scale-[0.99] transition-all hover:border-primary/50 hover:shadow-sm cursor-pointer"
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
        <button
          type="button"
          onClick={() => setShowEntryExit(true)}
          className="flex items-center justify-center gap-2 ml-auto px-6 bg-accent text-accent-foreground rounded-2xl font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus size={18} />
          Registrar entrada / salida
        </button>
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

      <div className="grid gap-2 mb-5 md:hidden">
        <button
          type="button"
          disabled={!hasRates}
          onClick={() => hasRates && setShowVehicle(true)}
          className={`flex items-center gap-3 border rounded-2xl p-4 text-left transition-all ${
            hasRates ? 'bg-card border-border hover:border-primary/50 hover:shadow-sm active:scale-[0.99]' : 'bg-muted border-border opacity-60 cursor-not-allowed'
          }`}
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

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-foreground">Vehículos registrados</p>
        <span className="text-xs font-bold text-muted-foreground">{vehicles.data?.length ?? 0}</span>
      </div>
      <div className="mb-5">
        <VehicleList
          vehicles={vehicles.data ?? []}
          onEdit={handleEditVehicle}
          onDetail={handleDetailVehicle}
          onDelete={handleDeleteVehicle}
          onCancelMonthly={handleCancelMonthly}
        />
      </div>

      <div className="sticky bottom-24 md:bottom-4 -mx-5 px-5 pt-3 bg-background/95 backdrop-blur-sm md:hidden">
        <PrimaryButton onClick={() => setShowEntryExit(true)}>
          <Plus size={18} />
          Registrar entrada / salida
        </PrimaryButton>
      </div>

      <EntryExitModal open={showEntryExit} onClose={() => setShowEntryExit(false)} idBusiness={idBusiness} />
      <VehicleModal
        open={showVehicle}
        onClose={() => setShowVehicle(false)}
        idBusiness={idBusiness}
        hasRates={hasRates}
      />
      <VehicleModal
        open={!!editVehicle}
        onClose={() => setEditVehicle(null)}
        initial={editVehicle}
        idBusiness={idBusiness}
        hasRates={hasRates}
      />
      <VehicleDetailModal
        open={!!detailVehicle}
        onClose={() => setDetailVehicle(null)}
        vehicle={detailVehicle}
        tickets={allTickets.data ?? []}
        onPayTicket={handlePayTicket}
        onActivateMonthly={handleActivateMonthly}
        onCancelMonthly={handleCancelMonthly}
      />
      <RatesModal open={showRates} onClose={() => setShowRates(false)} idBusiness={idBusiness} />
      <PaymentsModal
        open={!!showPayments}
        onClose={() => setShowPayments(null)}
        idTicket={showPayments?.idTicket ?? ''}
        totalAmount={showPayments?.totalAmount ?? 0}
        pendingAmount={showPayments?.pendingAmount ?? 0}
      />
      <MonthlyModal
        open={!!showMonthly}
        onClose={() => setShowMonthly(null)}
        idTicket={showMonthly?.idTicket ?? ''}
        monthlyPrice={showMonthly ? monthlyPriceForVehicle(showMonthly.vehicleLicensePlate) : 0}
        isActive={showMonthly?.isActive ?? false}
        vehicleLicensePlate={showMonthly?.vehicleLicensePlate ?? ''}
        onActivate={() => setShowMonthly(null)}
        onCancel={() => setShowMonthly(null)}
      />
    </div>
  )
}
