import type {
  ParkingRate,
  ParkingVehicle,
  ParkingTicket,
  RegisterVehicleInput,
  ToggleTicketInput,
  ExitTicketInput,
} from '../../core/domain/entities/parking'
import type { ParkingRepository } from '../../core/ports/parking.repository'
import { http } from './http-client'

function toRatesBody(body: Record<string, Record<string, number>>): Record<string, Record<string, number>> {
  return body
}

export class ApiParkingRepository implements ParkingRepository {
  async upsertRates(idBusiness: string, body: Record<string, Record<string, number>>): Promise<ParkingRate[]> {
    return http.post<ParkingRate[]>(`/businesses/${idBusiness}/parking-rates`, toRatesBody(body))
  }

  async listRates(idBusiness: string): Promise<ParkingRate[]> {
    return http.get<ParkingRate[]>(`/businesses/${idBusiness}/parking-rates`)
  }

  async updateRate(idRate: string, patch: { price?: number; vehicleType?: string; shiftType?: string }): Promise<ParkingRate | null> {
    return http.patch<ParkingRate | null>(`/parking-rates/${idRate}`, patch)
  }

  async deleteRate(idRate: string): Promise<void> {
    await http.delete<void>(`/parking-rates/${idRate}`)
  }

  async listVehicles(idBusiness: string): Promise<ParkingVehicle[]> {
    return http.get<ParkingVehicle[]>(`/businesses/${idBusiness}/vehicles`)
  }

  async getVehicleByPlate(idBusiness: string, licensePlate: string): Promise<ParkingVehicle | null> {
    return http.get<ParkingVehicle | null>(`/businesses/${idBusiness}/vehicles?licensePlate=${encodeURIComponent(licensePlate)}`)
  }

  async registerVehicle(idBusiness: string, input: RegisterVehicleInput): Promise<ParkingVehicle> {
    return http.post<ParkingVehicle>(`/businesses/${idBusiness}/vehicles`, input)
  }

  async updateVehicle(idBusiness: string, idVehicle: string, patch: Partial<RegisterVehicleInput>): Promise<ParkingVehicle | null> {
    return http.patch<ParkingVehicle | null>(`/businesses/${idBusiness}/vehicles/${idVehicle}`, patch)
  }

  async deleteVehicle(idBusiness: string, idVehicle: string): Promise<void> {
    await http.delete<void>(`/businesses/${idBusiness}/vehicles/${idVehicle}`)
  }

  async toggleTicket(input: ToggleTicketInput): Promise<ParkingTicket> {
    return http.post<ParkingTicket>('/parking-tickets', input)
  }

  async exitTicket(idTicket: string, input?: ExitTicketInput): Promise<ParkingTicket> {
    return http.post<ParkingTicket>(`/parking-tickets/${idTicket}/exit`, input ?? {})
  }

  async listTickets(idBusiness: string, filters?: { status?: string; licensePlate?: string }): Promise<ParkingTicket[]> {
    const params = new URLSearchParams()
    params.set('idBusiness', idBusiness)
    if (filters?.status) params.set('status', filters.status)
    if (filters?.licensePlate) params.set('licensePlate', filters.licensePlate)
    return http.get<ParkingTicket[]>(`/parking-tickets?${params.toString()}`)
  }

  async getActiveTickets(idBusiness: string): Promise<ParkingTicket[]> {
    return http.get<ParkingTicket[]>(`/parking-tickets/active?idBusiness=${idBusiness}`)
  }

  async getActiveTicketByPlate(idBusiness: string, licensePlate: string): Promise<ParkingTicket | null> {
    return http.get<ParkingTicket | null>(`/parking-tickets/active?idBusiness=${idBusiness}&licensePlate=${encodeURIComponent(licensePlate)}`)
  }

  async getTicket(idTicket: string): Promise<ParkingTicket | null> {
    return http.get<ParkingTicket | null>(`/parking-tickets/${idTicket}`)
  }

  async cancelTicket(idTicket: string): Promise<void> {
    await http.delete<void>(`/parking-tickets/${idTicket}`)
  }
}