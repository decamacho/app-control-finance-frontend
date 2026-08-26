import { useQuery } from '@tanstack/react-query'
import { getAccessToken } from '../../infrastructure/api/http-client'
import { ApiBusinessRepository } from '../../infrastructure/api/api-business.repository'
import { queryKeys } from '../query/keys'

const businessRepository = new ApiBusinessRepository()

export function useBusinesses() {
  return useQuery({
    queryKey: queryKeys.business.list,
    queryFn: () => businessRepository.list(),
    enabled: Boolean(getAccessToken()),
    staleTime: 60_000,
  })
}