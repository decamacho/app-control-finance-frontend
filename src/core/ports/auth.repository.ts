import type { AuthSession, AuthUser } from '../domain/entities/user'

export interface RegisterAuthInput {
  nameUser: string
  emailUser: string
  passwordUser: string
}

export interface LoginAuthInput {
  emailUser: string
  passwordUser: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export interface LoginResult {
  accessToken: string
  user: AuthUser
}

export interface AuthRepository {
  register(input: RegisterAuthInput): Promise<AuthUser>
  login(input: LoginAuthInput): Promise<LoginResult>
  logout(): Promise<void>
  changePassword(input: ChangePasswordInput): Promise<void>
  getProfile(): Promise<AuthUser>
  listSessions(): Promise<AuthSession[]>
  closeSession(sessionId: string): Promise<void>
  closeAllSessions(): Promise<void>
  verifyEmail(token: string): Promise<void>
  resendVerify(emailUser: string): Promise<void>
}