import type {
  ParkingRate,
  ParkingVehicle,
  ParkingTicket,
  RegisterVehicleInput,
  ToggleTicketInput,
  ExitTicketInput,
} from '../domain/entities/parking'

export interface ParkingRepository {
  upsertRates(idBusiness: string, body: Record<string, Record<string, number>>): Promise<ParkingRate[]>
  listRates(idBusiness: string): Promise<ParkingRate[]>
  updateRate(idRate: string, patch: { price?: number; vehicleType?: string; shiftType?: string }): Promise<ParkingRate | null>
  deleteRate(idRate: string): Promise<void>

  listVehicles(idBusiness: string): Promise<ParkingVehicle[]>
  getVehicleByPlate(idBusiness: string, licensePlate: string): Promise<ParkingVehicle | null>
  registerVehicle(idBusiness: string, input: RegisterVehicleInput): Promise<ParkingVehicle>
  updateVehicle(idBusiness: string, idVehicle: string, patch: Partial<RegisterVehicleInput>): Promise<ParkingVehicle | null>
  deleteVehicle(idBusiness: string, idVehicle: string): Promise<void>

  toggleTicket(input: ToggleTicketInput): Promise<ParkingTicket>
  exitTicket(idTicket: string, input?: ExitTicketInput): Promise<ParkingTicket>
  listTickets(idBusiness: string, filters?: { status?: string; licensePlate?: string }): Promise<ParkingTicket[]>
  getActiveTickets(idBusiness: string): Promise<ParkingTicket[]>
  getActiveTicketByPlate(idBusiness: string, licensePlate: string): Promise<ParkingTicket | null>
  getTicket(idTicket: string): Promise<ParkingTicket | null>
  cancelTicket(idTicket: string): Promise<void>
}