export type BusinessType = 'PARKING' | 'FOOD_SALE' | 'RETAIL' | 'OTHER'

export type VehicleType = 'MOTO' | 'CARRO' | 'CAMIONETA'

export type ShiftType = 'DAY' | 'NIGHT' | 'HOUR' | 'MONTHLY'

export type TicketStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID'

export type PaymentMethod = 'NEQUI' | 'CASH' | 'BREVE' | 'LLAVE' | 'DEVIPLATA' | 'OTHER'

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  PARKING: 'Parqueadero',
  FOOD_SALE: 'Venta de alimentos',
  RETAIL: 'Tienda',
  OTHER: 'Otro',
}

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  MOTO: 'Moto',
  CARRO: 'Carro',
  CAMIONETA: 'Camioneta',
}

export const SHIFT_TYPE_LABELS: Record<ShiftType, string> = {
  DAY: 'Día',
  NIGHT: 'Noche',
  HOUR: 'Hora',
  MONTHLY: 'Mensual',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  NEQUI: 'Nequi',
  CASH: 'Efectivo',
  BREVE: 'Breve',
  LLAVE: 'Llave',
  DEVIPLATA: 'Deviplata',
  OTHER: 'Otro',
}