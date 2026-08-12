import type { ParkingEntry } from '../domain/entities/parking'
import { parkingFee } from '../domain/services/parking'
import type { ParkingRepository } from '../ports/parking.repository'

export function createRegisterParkingExit(repository: ParkingRepository) {
  return async (entryId: string): Promise<ParkingEntry> => {
    const entry = await repository.findById(entryId)
    if (!entry) throw new Error('Entrada no encontrada')
    if (entry.status === 'completed') throw new Error('La entrada ya está completada')

    const exitTime = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    const completed = await repository.updateEntry(entryId, {
      status: 'completed',
      exitTime,
      amount: parkingFee(entry),
    })
    if (!completed) throw new Error('Entrada no encontrada')
    return completed
  }
}
