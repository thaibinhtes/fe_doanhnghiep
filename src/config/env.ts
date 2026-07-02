/// API path prefix, e.g. `/api` → calls become `/api/auth/login`
function resolveApiPrefix(): string {
  const raw = import.meta.env.VITE_API_PREFIX?.trim()

  if (!raw) {
    return '/api'
  }

  const prefix = raw.startsWith('/') ? raw : `/${raw}`
  return prefix.replace(/\/$/, '') || '/api'
}

export const API_PREFIX = resolveApiPrefix()

/** @deprecated use API_PREFIX — kept for existing imports */
export const API_BASE_URL = API_PREFIX
