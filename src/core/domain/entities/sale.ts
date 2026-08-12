export type PaymentMethod = 'efectivo' | 'nequi' | 'tarjeta'

export interface Sale {
  id: string
  productId: string
  productName: string
  quantity: number
  total: number
  time: string
  payment: PaymentMethod
}
