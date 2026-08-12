import type { ParkingEntry, VehicleType } from '../domain/entities/parking'
import type { ParkingRepository } from '../ports/parking.repository'

export interface RegisterParkingEntryInput {
  plate: string
  vehicleType: VehicleType
  spaceNumber: string
  entryTime: string
}

export function createRegisterParkingEntry(repository: ParkingRepository) {
  return async (input: RegisterParkingEntryInput): Promise<ParkingEntry> => {
    const plate = input.plate.trim().toUpperCase()
    const spaceNumber = input.spaceNumber.trim()

    if (!plate) throw new Error('La placa es obligatoria')
    if (!spaceNumber) throw new Error('El espacio es obligatorio')

    const entry: ParkingEntry = {
      id: `pk${Date.now()}`,
      plate,
      vehicleType: input.vehicleType,
      spaceNumber,
      entryTime: input.entryTime,
      hoursElapsed: 0,
      status: 'active',
    }

    await repository.saveEntry(entry)
    return entry
  }
}
