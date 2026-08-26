export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface Role {
  idRole: string
  nameRole: string
  stateRole: boolean
  createdAt: string
}

export interface AuthUser {
  idUser: string
  nameUser: string
  firstNameUser: string
  lastNameUser: string
  emailUser: string
  phoneNumberUser: string | null
  googleIdUser: string | null
  statusUser: UserStatus
  isVerifyUser: boolean
  countryUser: string | null
  currencyDefault: string | null
  lastLoginUser: string
  createdAt: string
  modifyAt: string
  role: Role
}

export interface AuthSession {
  idSession: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt?: string
  lastActivityAt?: string | null
  expiresAt?: string | null
  isCurrent?: boolean
}

export function hasRole(user: AuthUser | null | undefined, roleName: string): boolean {
  return user?.role?.nameRole === roleName
}