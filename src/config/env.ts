/// Resolves API base URL from Vite env (`VITE_API_BASE_URL`).
function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!raw) {
    throw new Error(
      'VITE_API_BASE_URL is not defined. Set it in fe/.env (local) or fe/.env.docker (docker build).',
    )
  }

  return raw.replace(/\/$/, '')
}

export const API_BASE_URL = resolveApiBaseUrl()
