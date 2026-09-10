const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

interface ApiEnvelope<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

function isEnvelope(body: unknown): body is ApiEnvelope<unknown> {
  return typeof body === 'object' && body !== null && 'success' in body && 'data' in body
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const NETWORK_ERROR_MESSAGE = 'Hubo un problema de conexión. Inténtalo de nuevo más tarde.'

const NETWORK_ERROR_SIGNALS = ['failed to fetch', 'networkerror', 'load failed', 'network request failed']

const ERROR_TRANSLATIONS: Record<string, string> = {
  'user not found or inactive': 'Usuario no encontrado o inactivo',
  'invalid credentials': 'Credenciales inválidas',
  'invalid or expired token': 'Token inválido o expirado',
}

function translateErrorMessage(message: string): string {
  return ERROR_TRANSLATIONS[message.trim().toLowerCase()] ?? message
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return translateErrorMessage(error.message)
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    if (NETWORK_ERROR_SIGNALS.some((signal) => message.includes(signal))) return NETWORK_ERROR_MESSAGE
    return translateErrorMessage(error.message)
  }
  return 'Ocurrió un error inesperado'
}

let accessToken: string | null = null
let refreshPromise: Promise<string | null> | null = null
let sessionExpiredHandler: (() => void) | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

export function onSessionExpired(handler: () => void): void {
  sessionExpiredHandler = handler
}

export async function restoreSession(): Promise<boolean> {
  const token = await refreshAccessToken()
  return Boolean(token)
}

const NO_AUTO_REFRESH_PATHS = new Set(['/auth/refresh', '/auth/login', '/auth/register'])

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })

        if (!response.ok) {
          setAccessToken(null)
          sessionExpiredHandler?.()
          return null
        }

        const body = (await response.json().catch(() => null)) as unknown
        const data = (isEnvelope(body) ? body.data : body) as { accessToken?: string } | null
        if (data?.accessToken) setAccessToken(data.accessToken)
        return data?.accessToken ?? null
      } finally {
        refreshPromise = null
      }
    })()
  }
  return refreshPromise
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: unknown }
    if (typeof body?.message === 'string') return body.message
  } catch {
    // cuerpo no JSON
  }
  return `Hubo un problema (${response.status}). Inténtalo de nuevo.`
}

async function request<T>(path: string, init?: RequestInit, retried = false): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init?.headers,
      },
      credentials: 'include',
      ...init,
    })
  } catch {
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0)
  }

  if (!response.ok) {
    if (response.status === 401 && !retried && !NO_AUTO_REFRESH_PATHS.has(path)) {
      const token = await refreshAccessToken()
      if (token) return request<T>(path, init, true)
    }
    throw new ApiError(await readErrorMessage(response), response.status)
  }

  if (response.status === 204) return undefined as T
  const body = (await response.json().catch(() => null)) as unknown
  return (isEnvelope(body) ? body.data : body) as T
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}