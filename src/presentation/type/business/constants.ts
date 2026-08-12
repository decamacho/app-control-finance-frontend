import { Bike, Car, Truck, type LucideIcon } from 'lucide-react'
import type { VehicleType } from '../../../core/domain/entities/parking'
import type { PaymentMethod } from '../../../core/domain/entities/sale'

export const HOURLY_SALES_DATA = [
  { hour: '7am', amount: 15500 },
  { hour: '8am', amount: 28000 },
  { hour: '9am', amount: 44500 },
  { hour: '10am', amount: 62000 },
  { hour: '11am', amount: 38000 },
]

export const VEHICLE_OPTIONS: { id: VehicleType; label: string; Icon: LucideIcon }[] = [
  { id: 'car', label: 'Carro', Icon: Car },
  { id: 'motorcycle', label: 'Moto', Icon: Bike },
  { id: 'truck', label: 'Camioneta', Icon: Truck },
]

export const PAYMENT_OPTIONS: [PaymentMethod, string][] = [
  ['efectivo', '💵 Efectivo'],
  ['nequi', '📱 Nequi'],
  ['tarjeta', '💳 Tarjeta'],
]
