import type { FoodDelivery, CreateDeliveryInput } from '../domain/entities/food'
import type { FoodRepository } from '../ports/food.repository'

export type { CreateDeliveryInput }

export function createRegisterDelivery(repository: FoodRepository) {
  return async (idOrder: string, input: CreateDeliveryInput): Promise<FoodDelivery> => {
    if (!input.items || input.items.length === 0) {
      throw new Error('Debe entregar al menos un item')
    }

    for (const item of input.items) {
      if (!item.idOrderItem) throw new Error('Cada item debe tener un idOrderItem')
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new Error('La cantidad debe ser un entero mayor a 0')
      }
    }

    return repository.createDelivery(idOrder, input)
  }
}
