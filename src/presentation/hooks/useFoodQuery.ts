import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiFoodRepository } from '../../infrastructure/api/api-food.repository'
import { createRegisterFoodOrder, type CreateOrderInput } from '../../core/application/register-food-order'
import { queryKeys } from '../query/keys'
import type { CreateProductInput, CreateCustomerInput, UpdateOrderInput, RegisterOrderPaymentsInput, CreateRecurringInput } from '../../core/domain/entities/food'

const foodRepository = new ApiFoodRepository()

export function useFoodProducts() {
  return useQuery({
    queryKey: queryKeys.food.products,
    queryFn: () => foodRepository.listProducts(),
  })
}

export function useCreateFoodProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) => foodRepository.createProduct(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.products }),
  })
}

export function useUpdateFoodProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateProductInput }) => foodRepository.updateProduct(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.products }),
  })
}

export function useDeleteFoodProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => foodRepository.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.products }),
  })
}

export function useFoodCustomers() {
  return useQuery({
    queryKey: queryKeys.food.customers,
    queryFn: () => foodRepository.listCustomers(),
  })
}

export function useCreateFoodCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCustomerInput) => foodRepository.createCustomer(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.customers }),
  })
}

export function useUpdateFoodCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateCustomerInput }) => foodRepository.updateCustomer(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.customers }),
  })
}

export function useDeleteFoodCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => foodRepository.deleteCustomer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.customers }),
  })
}

export function useTodayFoodOrders() {
  return useQuery({
    queryKey: queryKeys.food.todayOrders,
    queryFn: () => foodRepository.listTodayOrders(),
  })
}

export function useCreateFoodOrder() {
  const qc = useQueryClient()
  const register = createRegisterFoodOrder(foodRepository)
  return useMutation({
    mutationFn: (input: CreateOrderInput) => register(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.food.todayOrders })
      qc.invalidateQueries({ queryKey: queryKeys.food.recurring })
    },
  })
}

export function useUpdateFoodOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrderInput }) => foodRepository.updateOrder(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.todayOrders }),
  })
}

export function useRegisterOrderPayments() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ idOrder, input }: { idOrder: string; input: RegisterOrderPaymentsInput }) =>
      foodRepository.registerOrderPayments(idOrder, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.todayOrders }),
  })
}

export function useFoodRecurring() {
  return useQuery({
    queryKey: queryKeys.food.recurring,
    queryFn: () => foodRepository.listRecurring(),
  })
}

export function useCreateRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRecurringInput) => foodRepository.createRecurring(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.recurring }),
  })
}

export function useToggleRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => foodRepository.toggleRecurring(id, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.recurring }),
  })
}
