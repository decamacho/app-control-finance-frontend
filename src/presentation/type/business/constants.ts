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

export const VEHICLE_FILTER_OPTIONS = [
  { id: 'all', label: 'Todos' },
  ...VEHICLE_OPTIONS.map(({ id, label }) => ({ id, label })),
]

export const VEHICLE_COLORS = [
  { id: 'azul', label: 'Azul', value: '#2563eb' },
  { id: 'cian', label: 'Cian', value: '#06b6d4' },
  { id: 'verde', label: 'Verde', value: '#10b981' },
  { id: 'ambar', label: 'Ámbar', value: '#f59e0b' },
  { id: 'rosa', label: 'Rosa', value: '#e11d48' },
  { id: 'violeta', label: 'Violeta', value: '#7c3aed' },
  { id: 'gris', label: 'Gris', value: '#64748b' },
  { id: 'negro', label: 'Negro', value: '#1a2f5a' },
]

export const PARKING_PAYMENT_OPTIONS = [
  { id: 'nequi', label: 'Nequi', emoji: '📱' },
  { id: 'efectivo', label: 'Efectivo', emoji: '💵' },
  { id: 'breve', label: 'Breve', emoji: '🧾' },
  { id: 'otro', label: 'Otro', emoji: '➕' },
] as const

export type ParkingPaymentMethod = (typeof PARKING_PAYMENT_OPTIONS)[number]['id']

export const PAYMENT_OPTIONS: [PaymentMethod, string][] = [
  ['efectivo', '💵 Efectivo'],
  ['nequi', '📱 Nequi'],
  ['tarjeta', '💳 Tarjeta'],
]
