export type VehicleType = 'car' | 'motorcycle' | 'truck'

export type ParkingEntryStatus = 'active' | 'completed'

export interface ParkingEntry {
  id: string
  plate: string
  vehicleType: VehicleType
  spaceNumber: string
  entryTime: string
  hoursElapsed: number
  exitTime?: string
  amount?: number
  status: ParkingEntryStatus
}
