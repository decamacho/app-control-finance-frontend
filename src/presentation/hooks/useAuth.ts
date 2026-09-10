import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import type { AuthUser } from '../../core/domain/entities/user'
import { hasRole } from '../../core/domain/entities/user'
import type {
  ChangePasswordInput,
  LoginAuthInput,
  RegisterAuthInput,
} from '../../core/ports/auth.repository'
import { ApiAuthRepository } from '../../infrastructure/api/api-auth.repository'
import { getAccessToken, onSessionExpired, setAccessToken } from '../../infrastructure/api/http-client'
import { queryKeys } from '../query/keys'
import { queryClient } from '../query/queryClient'

const authRepository = new ApiAuthRepository()

onSessionExpired(() => {
  queryClient.setQueryData<AuthUser | null>(queryKeys.auth.session, null)
  queryClient.removeQueries({ queryKey: queryKeys.auth.sessions })
})

export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authRepository.getProfile(),
    enabled: Boolean(getAccessToken()),
    staleTime: 60_000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: LoginAuthInput) => authRepository.login(input),
    onSuccess: (result) => {
      setAccessToken(result.accessToken)
      queryClient.setQueryData<AuthUser | null>(queryKeys.auth.session, result.user)
      navigate('/')
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterAuthInput) => authRepository.register(input),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authRepository.logout(),
    onSettled: () => {
      setAccessToken(null)
      queryClient.setQueryData<AuthUser | null>(queryKeys.auth.session, null)
      queryClient.removeQueries({ queryKey: queryKeys.auth.sessions })
      navigate('/login', { replace: true })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authRepository.changePassword(input),
  })
}

export function useResendVerify() {
  return useMutation({
    mutationFn: (emailUser: string) => authRepository.resendVerify(emailUser),
  })
}

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.auth.sessions,
    queryFn: () => authRepository.listSessions(),
    enabled: Boolean(getAccessToken()),
  })
}

export function useCloseSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => authRepository.closeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions })
    },
  })
}

export function useCloseAllSessions() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authRepository.closeAllSessions(),
    onSuccess: () => {
      setAccessToken(null)
      queryClient.setQueryData<AuthUser | null>(queryKeys.auth.session, null)
      queryClient.removeQueries({ queryKey: queryKeys.auth.sessions })
      navigate('/login', { replace: true })
    },
  })
}

export function useVerifyEmail(token: string) {
  return useQuery({
    queryKey: queryKeys.auth.verify(token),
    queryFn: () => authRepository.verifyEmail(token),
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  })
}

export function useIsAdmin(user: AuthUser | null | undefined): boolean {
  return hasRole(user, 'ADMIN')
}