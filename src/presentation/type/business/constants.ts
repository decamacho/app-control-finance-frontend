import { Bike, Car, Truck, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import type { VehicleType as ApiVehicleType } from '../../../core/domain/entities/api'
import type { PaymentMethod } from '../../../core/domain/entities/sale'
import type { DeliveryStatus, RecurringDay } from '../../../core/domain/entities/food'

type DemoVehicleType = 'car' | 'motorcycle' | 'truck'

export const HOURLY_SALES_DATA = [
  { hour: '7am', amount: 15500 },
  { hour: '8am', amount: 28000 },
  { hour: '9am', amount: 44500 },
  { hour: '10am', amount: 62000 },
  { hour: '11am', amount: 38000 },
]

export const VEHICLE_OPTIONS: { id: DemoVehicleType; label: string; Icon: LucideIcon }[] = [
  { id: 'car', label: 'Carro', Icon: Car },
  { id: 'motorcycle', label: 'Moto', Icon: Bike },
  { id: 'truck', label: 'Camioneta', Icon: Truck },
]

export const API_VEHICLE_OPTIONS: { id: ApiVehicleType; label: string; Icon: LucideIcon }[] = [
  { id: 'MOTO', label: 'Moto', Icon: Bike },
  { id: 'CARRO', label: 'Carro', Icon: Car },
  { id: 'CAMIONETA', label: 'Camioneta', Icon: Truck },
]

export const VEHICLE_FILTER_OPTIONS = [
  { id: 'all', label: 'Todos' },
  ...API_VEHICLE_OPTIONS.map(({ id, label }) => ({ id, label })),
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
  { id: 'NEQUI', label: 'Nequi' },
  { id: 'CASH', label: 'Efectivo' },
  { id: 'BREVE', label: 'Breve' },
  { id: 'LLAVE', label: 'Llave' },
  { id: 'DEVIPLATA', label: 'Deviplata' },
  { id: 'OTHER', label: 'Otro' },
] as const

export type ParkingPaymentMethod = (typeof PARKING_PAYMENT_OPTIONS)[number]['id']

export const PAYMENT_OPTIONS: [PaymentMethod, string][] = [
  ['efectivo', 'Efectivo'],
  ['nequi', 'Nequi'],
  ['tarjeta', 'Tarjeta'],
]

export const FOOD_PAYMENT_OPTIONS = [
  { id: 'NEQUI', label: 'Nequi' },
  { id: 'CASH', label: 'Efectivo' },
  { id: 'BREVE', label: 'Breve' },
  { id: 'LLAVE', label: 'Llave' },
  { id: 'DEVIPLATA', label: 'Deviplata' },
  { id: 'OTHER', label: 'Otro' },
] as const

export type FoodPaymentMethod = (typeof FOOD_PAYMENT_OPTIONS)[number]['id']

export const FOOD_PAYMENT_METHOD_LABELS: Record<string, string> = {
  NEQUI: 'Nequi',
  CASH: 'Efectivo',
  BREVE: 'Breve',
  LLAVE: 'Llave',
  DEVIPLATA: 'Deviplata',
  OTHER: 'Otro',
}

export const ORDER_TYPE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  SALE: { label: 'Venta', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  EXPENSE: { label: 'Gasto', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-100' },
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Activo', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
  CANCELLED: { label: 'Cancelado', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-100' },
}

export const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendiente pago', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-100' },
  PARTIAL: { label: 'Parcialmente pago', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
  PAID: { label: 'Pagado', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
}

export const DELIVERY_STATUS_MAP: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  NOT_DELIVERED: { label: 'Sin entregar', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-100' },
  PARTIAL_DELIVERED: { label: 'Entrega parcial', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
  DELIVERED: { label: 'Entregado', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
}

export const RECURRING_DAY_OPTIONS: { id: RecurringDay; label: string }[] = [
  { id: 'MON', label: 'Lun' },
  { id: 'TUE', label: 'Mar' },
  { id: 'WED', label: 'Mié' },
  { id: 'THU', label: 'Jue' },
  { id: 'FRI', label: 'Vie' },
  { id: 'SAT', label: 'Sáb' },
  { id: 'SUN', label: 'Dom' },
]

export const FOOD_ICONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'utensils', label: 'General', Icon: UtensilsCrossed },
]
