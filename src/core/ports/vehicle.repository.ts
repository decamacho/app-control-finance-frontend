import type { ParkingVehicle } from '../domain/entities/vehicle'

export interface VehicleRepository {
  listVehicles(): Promise<ParkingVehicle[]>
  saveVehicle(vehicle: ParkingVehicle): Promise<void>
}
