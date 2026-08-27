import type { FoodOrder, CreateOrderInput } from '../domain/entities/food'
import type { FoodRepository } from '../ports/food.repository'

export type { CreateOrderInput }

export function createRegisterFoodOrder(repository: FoodRepository) {
  return async (input: CreateOrderInput): Promise<FoodOrder> => {
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
