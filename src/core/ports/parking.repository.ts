import type { ParkingEntry } from '../domain/entities/parking'

export interface ParkingRepository {
  listEntries(): Promise<ParkingEntry[]>
  findById(id: string): Promise<ParkingEntry | null>
  saveEntry(entry: ParkingEntry): Promise<void>
  updateEntry(id: string, patch: Partial<ParkingEntry>): Promise<ParkingEntry | null>
}
