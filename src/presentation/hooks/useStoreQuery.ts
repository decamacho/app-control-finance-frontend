import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createRegisterSale, type RegisterSaleInput } from '../../core/application/register-sale'
import { ApiSaleRepository } from '../../infrastructure/api/api-sale.repository'
import { queryKeys } from '../query/keys'

const saleRepository = new ApiSaleRepository()

export function useStoreProducts() {
  return useQuery({
    queryKey: queryKeys.store.products,
    queryFn: () => saleRepository.listProducts(),
  })
}

export function useStoreSales() {
  return useQuery({
    queryKey: queryKeys.store.sales,
    queryFn: () => saleRepository.listSales(),
  })
}

export function useRegisterSale() {
  const queryClient = useQueryClient()
  const register = createRegisterSale(saleRepository)
  return useMutation({
    mutationFn: (input: RegisterSaleInput) => register(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.store.sales })
      queryClient.invalidateQueries({ queryKey: queryKeys.store.products })
    },
  })
}

export type { RegisterSaleInput }
