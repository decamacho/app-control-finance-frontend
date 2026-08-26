import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiParkingRepository } from '../../infrastructure/api/api-parking.repository'
import { ApiPaymentRepository } from '../../infrastructure/api/api-payment.repository'
import { ApiMonthlyRepository } from '../../infrastructure/api/api-monthly.repository'
import { queryKeys } from '../query/keys'
import type { PaymentMethod, VehicleType } from '../../core/domain/entities/api'

const parkingRepository = new ApiParkingRepository()
const paymentRepository = new ApiPaymentRepository()
const monthlyRepository = new ApiMonthlyRepository()

export function useParkingRates(idBusiness: string | null) {
  return useQuery({
    queryKey: queryKeys.parking.rates(idBusiness ?? ''),
    queryFn: () => parkingRepository.listRates(idBusiness!),
    enabled: Boolean(idBusiness),
    staleTime: 60_000,
  })
}

export function useUpsertParkingRates() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idBusiness, body }: { idBusiness: string; body: Record<string, Record<string, number>> }) =>
      parkingRepository.upsertRates(idBusiness, body),
    onSuccess: (_data, { idBusiness }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.rates(idBusiness) })
    },
  })
}

export function useUpdateParkingRate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idRate, patch }: { idRate: string; patch: { price?: number; vehicleType?: string; shiftType?: string } }) =>
      parkingRepository.updateRate(idRate, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.rates('') })
    },
  })
}

export function useDeleteParkingRate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (idRate: string) => parkingRepository.deleteRate(idRate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.rates('') })
    },
  })
}

export function useParkingVehicles(idBusiness: string | null) {
  return useQuery({
    queryKey: queryKeys.parking.vehicles(idBusiness ?? ''),
    queryFn: () => parkingRepository.listVehicles(idBusiness!),
    enabled: Boolean(idBusiness),
    staleTime: 60_000,
  })
}

export function useVehicleByPlate(idBusiness: string | null, licensePlate: string) {
  return useQuery({
    queryKey: queryKeys.parking.vehicleByPlate(idBusiness ?? '', licensePlate),
    queryFn: () => parkingRepository.getVehicleByPlate(idBusiness!, licensePlate),
    enabled: Boolean(idBusiness && licensePlate),
    staleTime: 30_000,
  })
}

export function useRegisterParkingVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idBusiness, input }: { idBusiness: string; input: { licensePlate: string; vehicleType: VehicleType; ownerName: string; phoneOwner: string; emailOwner?: string; color?: string; brand?: string; model?: string } }) =>
      parkingRepository.registerVehicle(idBusiness, input),
    onSuccess: (_data, { idBusiness }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.vehicles(idBusiness) })
    },
  })
}

export function useUpdateParkingVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idBusiness, idVehicle, patch }: { idBusiness: string; idVehicle: string; patch: { licensePlate?: string; vehicleType?: VehicleType; ownerName?: string; phoneOwner?: string; emailOwner?: string; color?: string; brand?: string; model?: string } }) =>
      parkingRepository.updateVehicle(idBusiness, idVehicle, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.vehicles('') })
    },
  })
}

export function useDeleteParkingVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idBusiness, idVehicle }: { idBusiness: string; idVehicle: string }) =>
      parkingRepository.deleteVehicle(idBusiness, idVehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.vehicles('') })
    },
  })
}

export function useToggleParkingTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { idBusiness: string; licensePlate: string; customTime?: string }) =>
      parkingRepository.toggleTicket(input),
    onSuccess: (_data, { idBusiness }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.tickets(idBusiness) })
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.activeTickets(idBusiness) })
    },
  })
}

export function useExitParkingTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idTicket, exitTime }: { idTicket: string; exitTime?: string }) =>
      parkingRepository.exitTicket(idTicket, exitTime ? { exitTime } : undefined),
    onSuccess: (_data, { idTicket }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.ticket(idTicket) })
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.tickets('') })
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.activeTickets('') })
    },
  })
}

export function useCancelParkingTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (idTicket: string) => parkingRepository.cancelTicket(idTicket),
    onSuccess: (_data, idTicket) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.ticket(idTicket) })
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.tickets('') })
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.activeTickets('') })
    },
  })
}

export function useParkingTickets(idBusiness: string | null, filters?: { status?: string; licensePlate?: string }) {
  return useQuery({
    queryKey: queryKeys.parking.tickets(idBusiness ?? '', filters),
    queryFn: () => parkingRepository.listTickets(idBusiness!, filters),
    enabled: Boolean(idBusiness),
    staleTime: 10_000,
  })
}

export function useActiveParkingTickets(idBusiness: string | null) {
  return useQuery({
    queryKey: queryKeys.parking.activeTickets(idBusiness ?? ''),
    queryFn: () => parkingRepository.getActiveTickets(idBusiness!),
    enabled: Boolean(idBusiness),
    staleTime: 5_000,
  })
}

export function useActiveTicketByPlate(idBusiness: string | null, licensePlate: string) {
  return useQuery({
    queryKey: queryKeys.parking.activeByPlate(idBusiness ?? '', licensePlate),
    queryFn: () => parkingRepository.getActiveTicketByPlate(idBusiness!, licensePlate),
    enabled: Boolean(idBusiness && licensePlate),
    staleTime: 5_000,
  })
}

export function useParkingTicket(idTicket: string | null) {
  return useQuery({
    queryKey: queryKeys.parking.ticket(idTicket ?? ''),
    queryFn: () => parkingRepository.getTicket(idTicket!),
    enabled: Boolean(idTicket),
    staleTime: 10_000,
  })
}

export function useRegisterTicketPayments() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idTicket, input }: { idTicket: string; input: { payments: Array<{ amount: number; paymentMethod: PaymentMethod }> } }) =>
      paymentRepository.registerPayments(idTicket, input),
    onSuccess: (_data, { idTicket }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.ticket(idTicket) })
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.payments(idTicket) })
    },
  })
}

export function useTicketPayments(idTicket: string | null) {
  return useQuery({
    queryKey: queryKeys.parking.payments(idTicket ?? ''),
    queryFn: () => paymentRepository.listPayments(idTicket!),
    enabled: Boolean(idTicket),
    staleTime: 10_000,
  })
}

export function useActivateMonthly() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idTicket, input }: { idTicket: string; input?: { payments?: Array<{ amount: number; paymentMethod: PaymentMethod }>; startDate?: string } }) =>
      monthlyRepository.activateMonthly(idTicket, input),
    onSuccess: (_data, { idTicket }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.ticket(idTicket) })
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.vehicleMonthly('') })
    },
  })
}

export function useCancelMonthly() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (idTicket: string) => monthlyRepository.cancelMonthly(idTicket),
    onSuccess: (_data, idTicket) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.ticket(idTicket) })
      queryClient.invalidateQueries({ queryKey: queryKeys.parking.vehicleMonthly('') })
    },
  })
}