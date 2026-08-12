import type { VehicleRepository } from '../../core/ports/vehicle.repository'
import type { ParkingVehicle } from '../../core/domain/entities/vehicle'
import { http } from './http-client'

export class ApiVehicleRepository implements VehicleRepository {
  async listVehicles(): Promise<ParkingVehicle[]> {
    return http.get<ParkingVehicle[]>('/vehicles')
  }

  async saveVehicle(vehicle: ParkingVehicle): Promise<void> {
    await http.post<void>('/vehicles', vehicle)
  }
}
