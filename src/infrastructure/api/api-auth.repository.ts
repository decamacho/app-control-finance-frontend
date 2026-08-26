import type { AuthSession, AuthUser } from '../../core/domain/entities/user'
import type {
  AuthRepository,
  ChangePasswordInput,
  LoginAuthInput,
  LoginResult,
  RegisterAuthInput,
} from '../../core/ports/auth.repository'
import { http } from './http-client'

function toAuthUser(data: unknown): AuthUser {
  const candidate = data as Partial<AuthUser> & { user?: Partial<AuthUser> }
  if (candidate && 'idUser' in candidate && candidate.idUser) return candidate as AuthUser
  return candidate?.user as AuthUser
}

export class ApiAuthRepository implements AuthRepository {
  async register(input: RegisterAuthInput): Promise<AuthUser> {
    const data = await http.post<unknown>('/auth/register', input)
    return toAuthUser(data)
  }

  async login(input: LoginAuthInput): Promise<LoginResult> {
    const data = await http.post<{ accessToken?: string; user?: unknown }>('/auth/login', input)
    if (!data.accessToken) throw new Error('No se recibió un token de acceso')
    return { accessToken: data.accessToken, user: toAuthUser(data.user) }
  }

  async logout(): Promise<void> {
    await http.post<void>('/auth/logout')
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await http.post<void>('/auth/change-password', input)
  }

  async getProfile(): Promise<AuthUser> {
    const data = await http.get<unknown>('/auth/profile')
    return toAuthUser(data)
  }

  async listSessions(): Promise<AuthSession[]> {
    return http.get<AuthSession[]>('/auth/sessions')
  }

  async closeSession(sessionId: string): Promise<void> {
    await http.delete<void>(`/auth/sessions/${sessionId}`)
  }

  async closeAllSessions(): Promise<void> {
    await http.delete<void>('/auth/sessions')
  }

  async verifyEmail(token: string): Promise<void> {
    await http.get<void>(`/auth/verify-email/${token}`)
  }

  async resendVerify(emailUser: string): Promise<void> {
    await http.post<void>('/auth/resend-verify', { emailUser })
  }
}