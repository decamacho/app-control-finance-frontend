import type { FoodOrder, CreateOrderInput } from '../domain/entities/food'
import type { FoodRepository } from '../ports/food.repository'

export type { CreateOrderInput }

export function createRegisterFoodOrder(repository: FoodRepository) {
  return async (input: CreateOrderInput): Promise<FoodOrder> => {
    if (!input.idBusiness) throw new Error('El negocio es obligatorio')

    if (input.orderType === 'EXPENSE') {
      if (!input.description?.trim()) throw new Error('La descripción del gasto es obligatoria')
      if (!input.totalAmount || input.totalAmount <= 0) throw new Error('El monto del gasto debe ser mayor a 0')
      if (!input.paymentMethod) throw new Error('El método de pago es obligatorio')
      return repository.createOrder(input)
    }

    if (!input.idCustomer) throw new Error('El cliente es obligatorio')
    if (!input.items || input.items.length === 0) throw new Error('Debe agregar al menos un producto')

    for (const item of input.items) {
      if (!item.idProduct) throw new Error('Cada item debe tener un producto')
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new Error('La cantidad debe ser un entero mayor a 0')
      }
    }

    return repository.createOrder(input)
  }
}