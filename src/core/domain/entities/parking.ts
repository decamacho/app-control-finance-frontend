import type { VehicleType, ShiftType, TicketStatus, PaymentStatus, PaymentMethod } from './api'

export interface ParkingRate {
  idRate: string
  price: number
  vehicleType: VehicleType
  shiftType: ShiftType
}

export interface ParkingVehicle {
  idVehicle: string
  licensePlate: string
  vehicleType: VehicleType
  color: string | null
  brand: string | null
  model: string | null
  photoUrl: string | null
  ownerName: string
  phoneOwner: string
  emailOwner: string | null
  monthlyStartDate: string | null
  monthlyEndDate: string | null
}

export interface ParkingTicket {
  idTicket: string
  idBusiness: string
  licensePlate: string
  entryTime: string
  exitTime: string | null
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  paymentStatus: PaymentStatus
  ticketStatus: TicketStatus
  vehicle: ParkingVehicle
}

export interface Payment {
  idPayment: string
  amount: number
  paymentMethod: PaymentMethod
}

export interface RegisterVehicleInput {
  licensePlate: string
  vehicleType: VehicleType
  ownerName: string
  phoneOwner: string
  emailOwner?: string
  color?: string
  brand?: string
  model?: string
}

export interface ToggleTicketInput {
  idBusiness: string
  licensePlate: string
  customTime?: string
}

export interface ExitTicketInput {
  exitTime?: string
}

export interface RegisterPaymentsInput {
  payments: Array<{ amount: number; paymentMethod: PaymentMethod }>
}

export interface ActivateMonthlyInput {
  payments?: Array<{ amount: number; paymentMethod: PaymentMethod }>
  startDate?: string
}

export interface ActivateMonthlyResponse {
  payments: Payment[]
  vehicle: ParkingVehicle
  monthlyPrice: number
}

export interface CancelMonthlyResponse {
  vehicle: { monthlyStartDate: string | null; monthlyEndDate: string | null }
  recalculatedTickets: number
}