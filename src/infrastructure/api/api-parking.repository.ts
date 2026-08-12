import type { ParkingRepository } from '../../core/ports/parking.repository'
import type { ParkingEntry } from '../../core/domain/entities/parking'
import { http } from './http-client'

export class ApiParkingRepository implements ParkingRepository {
  async listEntries(): Promise<ParkingEntry[]> {
    return http.get<ParkingEntry[]>('/parking/entries')
  }

  async findById(id: string): Promise<ParkingEntry | null> {
    return http.get<ParkingEntry | null>(`/parking/entries/${id}`)
  }

  async saveEntry(entry: ParkingEntry): Promise<void> {
    await http.post<void>('/parking/entries', entry)
  }

  async updateEntry(id: string, patch: Partial<ParkingEntry>): Promise<ParkingEntry | null> {
    return http.patch<ParkingEntry>(`/parking/entries/${id}`, patch)
  }
}
