import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createRegisterParkingEntry,
  type RegisterParkingEntryInput,
} from '../../core/application/register-parking-entry'
import { createRegisterParkingExit } from '../../core/application/register-parking-exit'
import {
  createRegisterVehicle,
  type RegisterVehicleInput,
} from '../../core/application/register-vehicle'
import { ApiParkingRepository } from '../../infrastructure/api/api-parking.repository'
import { ApiVehicleRepository } from '../../infrastructure/api/api-vehicle.repository'
import { queryKeys } from '../query/keys'

const parkingRepository = new ApiParkingRepository()
const vehicleRepository = new ApiVehicleRepository()

export function useParkingEntries() {
  return useQuery({
    queryKey: queryKeys.parking.entries,
    queryFn: () => parkingRepository.listEntries(),
  })
}

export function useRegisterParkingEntry() {
  const queryClient = useQueryClient()
  const register = createRegisterParkingEntry(parkingRepository)
  return useMutation({
    mutationFn: (input: RegisterParkingEntryInput) => register(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.entries })
    },
  })
}

export function useRegisterParkingExit() {
  const queryClient = useQueryClient()
  const register = createRegisterParkingExit(parkingRepository)
  return useMutation({
    mutationFn: (entryId: string) => register(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.entries })
    },
  })
}

export function useParkingVehicles() {
  return useQuery({
    queryKey: queryKeys.parking.vehicles,
    queryFn: () => vehicleRepository.listVehicles(),
  })
}

export function useRegisterParkingVehicle() {
  const queryClient = useQueryClient()
  const register = createRegisterVehicle(vehicleRepository)
  return useMutation({
    mutationFn: (input: RegisterVehicleInput) => register(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.vehicles })
    },
  })
}

export type { RegisterParkingEntryInput, RegisterVehicleInput }
