import { Bike, Calendar, Phone, Mail, MapPin, CreditCard, CalendarX, Banknote, CalendarPlus } from 'lucide-react'
import type { ParkingVehicle, ParkingTicket } from '../../../../core/domain/entities/parking'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { TYPE_ICONS } from './icons'
import { Modal } from '../../../components/core/Modal'

interface VehicleDetailModalProps {
  open: boolean
  onClose: () => void
  vehicle: ParkingVehicle | null
  tickets: ParkingTicket[]
  onPayTicket?: (ticket: ParkingTicket) => void
  onActivateMonthly?: (vehicle: ParkingVehicle) => void
  onCancelMonthly?: (vehicle: ParkingVehicle) => void
}

export function VehicleDetailModal({ open, onClose, vehicle, tickets, onPayTicket, onActivateMonthly, onCancelMonthly }: VehicleDetailModalProps) {
  const vehicleTickets = vehicle ? tickets.filter((t) => t.licensePlate === vehicle.licensePlate) : []
  const Icon = TYPE_ICONS[vehicle?.vehicleType ?? 'MOTO'] ?? Bike

  const hasActiveMonthly = vehicle?.monthlyStartDate != null && vehicle.monthlyEndDate == null
  const hasTicketActive = vehicleTickets.some((t) => t.ticketStatus === 'ACTIVE')

  return (
    <Modal open={open} onClose={onClose} title={`Detalle: ${vehicle?.licensePlate ?? ''}`}>
      <div className="flex items-center gap-4 mb-5 p-4 bg-secondary rounded-2xl">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={24} />
        </div>
        <div>
          <p className="font-mono uppercase text-2xl font-bold text-foreground">{vehicle?.licensePlate}</p>
          <p className="text-sm text-muted-foreground">{vehicle?.vehicleType}</p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1">
          {vehicle?.monthlyStartDate && !vehicle.monthlyEndDate && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
              <Calendar size={10} />
              Mensualidad activa
            </span>
          )}
          {vehicle?.monthlyStartDate && vehicle.monthlyEndDate && (
            <span className="bg-rose-50 text-rose-700 border border-rose-100 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
              <CalendarX size={10} />
              Mensualidad finalizada
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 mb-5">
        <div className="flex items-center gap-3">
          <Phone size={18} className="text-muted-foreground" />
          <span className="font-bold text-foreground">{vehicle?.phoneOwner ?? '—'}</span>
        </div>
        {vehicle?.emailOwner && (
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-muted-foreground" />
            <span className="font-bold text-foreground">{vehicle.emailOwner}</span>
          </div>
        )}
        {vehicle?.color && (
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-muted-foreground" />
            <span className="font-bold text-foreground">Color: {vehicle.color}</span>
          </div>
        )}
        {vehicle?.brand && (
          <div className="flex items-center gap-3">
            <CreditCard size={18} className="text-muted-foreground" />
            <span className="font-bold text-foreground">{vehicle.brand} {vehicle.model ?? ''}</span>
          </div>
        )}
      </div>

      <div className="mb-5">
        <p className="text-xs font-bold text-muted-foreground tracking-wider mb-2">Historial de tickets ({vehicleTickets.length})</p>
        {vehicleTickets.length === 0 ? (
          <p className="text-sm text-muted-foreground bg-muted rounded-2xl px-4 py-3">Sin tickets</p>
        ) : (
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {vehicleTickets.slice(0, 10).map((ticket) => (
              <div key={ticket.idTicket} className="bg-card border border-border rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-foreground">{ticket.ticketStatus === 'ACTIVE' ? 'Activo' : ticket.ticketStatus === 'COMPLETED' ? 'Completado' : 'Cancelado'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(ticket.entryTime).toLocaleString('es-CO')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-foreground">{formatMoney(ticket.pendingAmount ?? ticket.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">{ticket.paymentStatus === 'PAID' ? 'Pagado' : ticket.paymentStatus === 'PARTIAL' ? 'Parcial' : 'Pendiente'}</p>
                  </div>
                </div>
                {ticket.pendingAmount > 0 && ticket.ticketStatus === 'COMPLETED' && onPayTicket && (
                  <button
                    type="button"
                    onClick={() => onPayTicket(ticket)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <Banknote size={14} />
                    Pagar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4 flex flex-wrap gap-2">
        {hasActiveMonthly && onCancelMonthly && vehicle && (
          <button
            type="button"
            onClick={() => onCancelMonthly(vehicle)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <CalendarX size={14} />
            Cancelar mensualidad
          </button>
        )}
        {!hasActiveMonthly && onActivateMonthly && vehicle && (
          <button
            type="button"
            disabled={!hasTicketActive}
            onClick={() => onActivateMonthly(vehicle)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              hasTicketActive
                ? 'text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 cursor-pointer'
                : 'text-muted-foreground bg-muted border border-border cursor-not-allowed'
            }`}
          >
            <CalendarPlus size={14} />
            Activar mensualidad
          </button>
        )}
        {!hasActiveMonthly && !hasTicketActive && onActivateMonthly && (
          <p className="text-xs text-muted-foreground w-full">
            Para activar mensualidad primero registra una entrada.
          </p>
        )}
      </div>
    </Modal>
  )
}
