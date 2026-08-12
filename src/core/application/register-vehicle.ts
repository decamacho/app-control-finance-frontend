import type { VehicleType } from '../domain/entities/parking'
import type { ParkingVehicle } from '../domain/entities/vehicle'
import type { VehicleRepository } from '../ports/vehicle.repository'

export interface RegisterVehicleInput {
  plate: string
  vehicleType: VehicleType
}

export function createRegisterVehicle(repository: VehicleRepository) {
  return async (input: RegisterVehicleInput): Promise<ParkingVehicle> => {
    const plate = input.plate.trim().toUpperCase()
    if (!plate) throw new Error('La placa es obligatoria')

    const vehicle: ParkingVehicle = {
      id: `v${Date.now()}`,
      plate,
      vehicleType: input.vehicleType,
    }

    await repository.saveVehicle(vehicle)
    return vehicle
  }
}
