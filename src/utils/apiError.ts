interface ApiErrorPayload {
  message?: string
  reason?: string
  errors?: Record<string, string[]>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readApiErrorPayload(err: unknown): ApiErrorPayload | null {
  if (!isRecord(err) || !isRecord(err.response) || !isRecord(err.response.data)) {
    return null
  }

  const data = err.response.data
  return {
    message: typeof data.message === 'string' ? data.message : undefined,
    reason: typeof data.reason === 'string' ? data.reason : undefined,
    errors: isRecord(data.errors)
      ? Object.fromEntries(
          Object.entries(data.errors).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [],
          ]),
        )
      : undefined,
  }
}

/** Extract a user-facing message from Laravel API error responses (422, 413, …). */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const payload = readApiErrorPayload(err)
  if (!payload) {
    return fallback
  }

  if (payload.message) {
    return payload.message
  }

  const firstFieldError = payload.errors
    ? Object.values(payload.errors).flat().find(Boolean)
    : undefined

  return firstFieldError ?? fallback
}

/** Full upload error detail for import modals (message + field errors + reason code). */
export function formatImportUploadError(err: unknown, fallback: string): string {
  const payload = readApiErrorPayload(err)
  if (!payload) {
    return fallback
  }

  const lines: string[] = []

  if (payload.message) {
    lines.push(payload.message)
  }

  if (payload.errors) {
    for (const [field, messages] of Object.entries(payload.errors)) {
      for (const message of messages) {
        if (message !== payload.message) {
          lines.push(`${field}: ${message}`)
        }
      }
    }
  }

  if (payload.reason && payload.reason !== 'validation_failed') {
    lines.push(`Mã lỗi: ${payload.reason}`)
  }

  return lines.length > 0 ? lines.join('\n') : fallback
}
