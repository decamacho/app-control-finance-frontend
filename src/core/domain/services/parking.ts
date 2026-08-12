import type { ParkingEntry, VehicleType } from '../entities/parking'

export type RatePeriod = 'hora' | 'noche' | 'dia' | 'mes'

export const PARKING_RATES: Record<VehicleType, Record<RatePeriod, number>> = {
  car: { hora: 3000, noche: 15000, dia: 25000, mes: 300000 },
  motorcycle: { hora: 1500, noche: 7500, dia: 12500, mes: 150000 },
  truck: { hora: 5000, noche: 25000, dia: 40000, mes: 500000 },
}

export type ParkingRates = typeof PARKING_RATES

export const TOTAL_SPACES = 20

export function parkingFee(entry: ParkingEntry, rates: ParkingRates = PARKING_RATES): number {
  return Math.ceil(entry.hoursElapsed * rates[entry.vehicleType].hora)
}
