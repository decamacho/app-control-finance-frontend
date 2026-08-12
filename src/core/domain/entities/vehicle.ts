import type { VehicleType } from './parking'

export interface ParkingVehicle {
  id: string
  plate: string
  vehicleType: VehicleType
}
