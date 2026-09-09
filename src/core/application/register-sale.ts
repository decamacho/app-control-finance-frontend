import type { PaymentMethod, Sale } from '../domain/entities/sale'
import type { SaleRepository } from '../ports/sale.repository'

export interface RegisterSaleInput {
  productId: string
  quantity: number
  payment: PaymentMethod
}

export function createRegisterSale(repository: SaleRepository) {
  return async (input: RegisterSaleInput): Promise<Sale> => {
    if (!Number.isInteger(input.quantity) || input.quantity < 1) {
      throw new Error('La cantidad debe ser un entero mayor a 0')
    }

    const products = await repository.listProducts()
    const product = products.find((p) => p.id === input.productId)
    if (!product) throw new Error('Producto no encontrado')

    const sale: Sale = {
      id: `s${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity: input.quantity,
      total: product.price * input.quantity,
      time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      payment: input.payment,
    }

    await repository.saveSale(sale)
    return sale
  }
}
