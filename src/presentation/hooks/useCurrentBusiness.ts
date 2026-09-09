import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useBusinesses } from './useBusinessQuery'
import { queryKeys } from '../query/keys'

const CURRENT_BUSINESS_KEY = 'wallet_ai.current_business'

export function useCurrentBusiness() {
  const { data: businesses, isLoading, isError } = useBusinesses()
  const queryClient = useQueryClient()

  const storedId = typeof window !== 'undefined' ? localStorage.getItem(CURRENT_BUSINESS_KEY) : null
  const currentBusiness = businesses?.find((b) => b.idBusiness === storedId) ?? businesses?.[0] ?? null

  const setCurrentBusiness = useCallback((idBusiness: string) => {
    localStorage.setItem(CURRENT_BUSINESS_KEY, idBusiness)
    queryClient.setQueryData(queryKeys.business.list, (old: { idBusiness: string }[] | undefined) =>
      old ? old : undefined,
    )
  }, [queryClient])

  return {
    currentBusiness,
    businesses,
    isLoading,
    isError,
    setCurrentBusiness,
    hasBusinesses: Boolean(businesses?.length),
  }
}