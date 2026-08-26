import type { VehicleType } from '../entities/api'

const CAR_PLATE_PATTERN = /^[A-Z]{3}\d{3}$/
const MOTO_PLATE_PATTERN = /^[A-Z]{3}\d{2}[A-Z]$/

export function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase().replace(/[\s-]+/g, '')
}

export function isValidPlate(plate: string, vehicleType: VehicleType): boolean {
  const normalized = normalizePlate(plate)
  if (!normalized) return false
  return vehicleType === 'MOTO' ? MOTO_PLATE_PATTERN.test(normalized) : CAR_PLATE_PATTERN.test(normalized)
}