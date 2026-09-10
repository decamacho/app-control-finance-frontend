import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiFoodRepository } from '../../infrastructure/api/api-food.repository'
import { createRegisterFoodOrder, type CreateOrderInput } from '../../core/application/register-food-order'
import { createRegisterDelivery, type CreateDeliveryInput } from '../../core/application/create-delivery'
import { queryKeys } from '../query/keys'
import type {
  CreateProductInput,
  CreateCustomerInput,
  UpdateOrderInput,
  RegisterOrderPaymentsInput,
  CreateRecurringInput,
  CreateCustomerProductPriceInput,
  OrderFilters,
} from '../../core/domain/entities/food'

const foodRepository = new ApiFoodRepository()

export function useFoodProducts(idBusiness: string | undefined) {
  return useQuery({
    queryKey: queryKeys.food.products(idBusiness ?? ''),
    queryFn: () => foodRepository.listProducts(idBusiness!),
    enabled: Boolean(idBusiness),
  })
}

export function useCreateFoodProduct(idBusiness: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) => foodRepository.createProduct(idBusiness!, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.products(idBusiness ?? '') }),
  })
}

export function useUpdateFoodProduct(idBusiness: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateProductInput }) => foodRepository.updateProduct(idBusiness!, id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.products(idBusiness ?? '') }),
  })
}

export function useDeleteFoodProduct(idBusiness: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => foodRepository.deleteProduct(idBusiness!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.products(idBusiness ?? '') }),
  })
}

export function useFoodCustomers(idBusiness: string | undefined) {
  return useQuery({
    queryKey: queryKeys.food.customers(idBusiness ?? ''),
    queryFn: () => foodRepository.listCustomers(idBusiness!),
    enabled: Boolean(idBusiness),
  })
}

export function useCreateFoodCustomer(idBusiness: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCustomerInput) => foodRepository.createCustomer(idBusiness!, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.customers(idBusiness ?? '') }),
  })
}

export function useUpdateFoodCustomer(idBusiness: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateCustomerInput }) => foodRepository.updateCustomer(idBusiness!, id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.customers(idBusiness ?? '') }),
  })
}

export function useDeleteFoodCustomer(idBusiness: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => foodRepository.deleteCustomer(idBusiness!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.customers(idBusiness ?? '') }),
  })
}

export function useFoodOrders(idBusiness: string | undefined, filters?: OrderFilters) {
  return useQuery({
    queryKey: queryKeys.food.orders(idBusiness ?? '', filters),
    queryFn: () => foodRepository.listOrders(idBusiness!, filters),
    enabled: Boolean(idBusiness),
  })
}

export function useDailySummaryByCustomers(idBusiness: string | undefined, date?: string) {
  return useQuery({
    queryKey: queryKeys.food.summaryByCustomers(idBusiness ?? '', date),
    queryFn: () => foodRepository.getDailySummaryByCustomers(idBusiness!, date),
    enabled: Boolean(idBusiness),
  })
}

export function useFoodOrder(idOrder: string | undefined) {
  return useQuery({
    queryKey: queryKeys.food.order(idOrder ?? ''),
    queryFn: () => foodRepository.getOrder(idOrder!),
    enabled: Boolean(idOrder),
  })
}

export function useCreateFoodOrder() {
  const qc = useQueryClient()
  const register = createRegisterFoodOrder(foodRepository)
  return useMutation({
    mutationFn: (input: CreateOrderInput) => register(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.food.all })
    },
  })
}

export function useUpdateFoodOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrderInput }) => foodRepository.updateOrder(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.all }),
  })
}

export function useCancelFoodOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => foodRepository.cancelOrder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.all }),
  })
}

export function useOrderPayments(idOrder: string | undefined) {
  return useQuery({
    queryKey: queryKeys.food.orderPayments(idOrder ?? ''),
    queryFn: () => foodRepository.listOrderPayments(idOrder!),
    enabled: Boolean(idOrder),
  })
}

export function useRegisterOrderPayments() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ idOrder, input }: { idOrder: string; input: RegisterOrderPaymentsInput }) =>
      foodRepository.registerOrderPayments(idOrder, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.all }),
  })
}

export function useDeliveries(idOrder: string | undefined) {
  return useQuery({
    queryKey: queryKeys.food.deliveries(idOrder ?? ''),
    queryFn: () => foodRepository.listDeliveries(idOrder!),
    enabled: Boolean(idOrder),
  })
}

export function useDeliverySummary(idOrder: string | undefined) {
  return useQuery({
    queryKey: queryKeys.food.deliverySummary(idOrder ?? ''),
    queryFn: () => foodRepository.getDeliverySummary(idOrder!),
    enabled: Boolean(idOrder),
  })
}

export function useCreateDelivery() {
  const qc = useQueryClient()
  const register = createRegisterDelivery(foodRepository)
  return useMutation({
    mutationFn: ({ idOrder, input }: { idOrder: string; input: CreateDeliveryInput }) => register(idOrder, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.all }),
  })
}

export function useCustomerPrices(idBusiness: string | undefined, idCustomer: string | undefined) {
  return useQuery({
    queryKey: queryKeys.food.customerPrices(idBusiness ?? '', idCustomer ?? ''),
    queryFn: () => foodRepository.listCustomerPrices(idBusiness!, idCustomer!),
    enabled: Boolean(idBusiness) && Boolean(idCustomer),
  })
}

export function useUpsertCustomerPrice(idBusiness: string | undefined, idCustomer: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCustomerProductPriceInput) =>
      foodRepository.upsertCustomerPrice(idBusiness!, idCustomer!, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.food.customerPrices(idBusiness ?? '', idCustomer ?? '') })
      qc.invalidateQueries({ queryKey: queryKeys.food.customers(idBusiness ?? '') })
    },
  })
}

export function useFoodRecurringByBusiness(idBusiness: string | undefined) {
  return useQuery({
    queryKey: queryKeys.food.recurringByBusiness(idBusiness ?? ''),
    queryFn: () => foodRepository.listRecurringByBusiness(idBusiness!),
    enabled: Boolean(idBusiness),
  })
}

export function useCreateRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRecurringInput) => foodRepository.createRecurring(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.all }),
  })
}

export function useToggleRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ idOrder, idRecurringOrder, active }: { idOrder: string; idRecurringOrder: string; active: boolean }) =>
      foodRepository.toggleRecurring(idOrder, idRecurringOrder, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.food.all }),
  })
}
