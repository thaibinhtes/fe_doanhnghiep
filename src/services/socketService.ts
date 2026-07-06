import { io, type Socket } from 'socket.io-client'

export const IMPORT_SOCKET_TOPICS = {
  STARTED: 'import.excel.started',
  COMPLETED: 'import.excel.completed',
  FAILED: 'import.excel.failed',
  ROW_SUCCESS: 'import.excel.row.success',
  ROW_DUPLICATE: 'import.excel.row.duplicate',
  ROW_FAILED: 'import.excel.row.failed',
} as const

export type ImportSocketTopic = (typeof IMPORT_SOCKET_TOPICS)[keyof typeof IMPORT_SOCKET_TOPICS]

export interface ImportRowSocketPayload {
  row: number
  status: 'success' | 'duplicate' | 'failed'
  maSoDoanhNghiep?: string | null
  tenDoanhNghiep?: string | null
  doanhNghiepId?: number | null
  message?: string | null
}

export interface ImportSocketPayload {
  topic: ImportSocketTopic
  userId: number
  importJobId: number | null
  status?: string
  originalFilename?: string | null
  result?: {
    imported: number
    duplicates?: number
    updated: number
    failed: number
    errors: Array<{ row: number; message: string }>
  }
  message?: string
  timestamp?: string
  entity?: string
  row?: number
  maSoDoanhNghiep?: string | null
  tenDoanhNghiep?: string | null
  doanhNghiepId?: number | null
}

type TopicHandler = (payload: ImportSocketPayload) => void

function resolveSocketUrl(): string {
  const configured = import.meta.env.VITE_SOCKET_URL?.trim()
  if (configured) {
    return configured
  }

  if (import.meta.env.DEV) {
    return window.location.origin
  }

  return window.location.origin
}

class SocketService {
  private socket: Socket | null = null
  private token: string | null = null
  private topicHandlers = new Map<string, Set<TopicHandler>>()

  connect(token: string) {
    if (this.socket?.connected && this.token === token) {
      return
    }

    this.disconnect()
    this.token = token

    this.socket = io(resolveSocketUrl(), {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
    })

    this.socket.on('connect_error', (error) => {
      console.warn('[socket] connect_error:', error.message)
    })

    for (const topic of Object.values(IMPORT_SOCKET_TOPICS)) {
      this.socket.on(topic, (payload: ImportSocketPayload) => {
        this.topicHandlers.get(topic)?.forEach((handler) => handler(payload))
      })
    }
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
    this.token = null
  }

  onTopic(topic: ImportSocketTopic, handler: TopicHandler) {
    if (!this.topicHandlers.has(topic)) {
      this.topicHandlers.set(topic, new Set())
    }
    this.topicHandlers.get(topic)!.add(handler)

    return () => {
      this.topicHandlers.get(topic)?.delete(handler)
    }
  }

  get connected() {
    return this.socket?.connected ?? false
  }
}

export const socketService = new SocketService()
