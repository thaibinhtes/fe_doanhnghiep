import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  socketService,
  IMPORT_SOCKET_TOPICS,
  type ImportSocketPayload,
} from '@/services/socketService'

const activeImportJobId = ref<number | null>(null)
const importInProgress = ref(false)
const lastImportNotification = ref<ImportSocketPayload | null>(null)

type ImportEventHandler = (payload: ImportSocketPayload) => void
type ImportRowEventHandler = (payload: ImportSocketPayload) => void

const completedHandlers = new Set<ImportEventHandler>()
const failedHandlers = new Set<ImportEventHandler>()
const rowSuccessHandlers = new Set<ImportRowEventHandler>()
const rowDuplicateHandlers = new Set<ImportRowEventHandler>()
const rowFailedHandlers = new Set<ImportRowEventHandler>()

function isActiveJob(payload: ImportSocketPayload): boolean {
  return activeImportJobId.value !== null && payload.importJobId === activeImportJobId.value
}

function dispatchCompleted(payload: ImportSocketPayload) {
  completedHandlers.forEach((handler) => handler(payload))
}

function dispatchFailed(payload: ImportSocketPayload) {
  failedHandlers.forEach((handler) => handler(payload))
}

function dispatchRowSuccess(payload: ImportSocketPayload) {
  rowSuccessHandlers.forEach((handler) => handler(payload))
}

function dispatchRowDuplicate(payload: ImportSocketPayload) {
  rowDuplicateHandlers.forEach((handler) => handler(payload))
}

function dispatchRowFailed(payload: ImportSocketPayload) {
  rowFailedHandlers.forEach((handler) => handler(payload))
}

function handleStarted(payload: ImportSocketPayload) {
  if (isActiveJob(payload)) {
    importInProgress.value = true
  }
}

function handleCompleted(payload: ImportSocketPayload) {
  lastImportNotification.value = payload

  if (isActiveJob(payload)) {
    importInProgress.value = false
    activeImportJobId.value = null
    dispatchCompleted(payload)
  }
}

function handleFailed(payload: ImportSocketPayload) {
  lastImportNotification.value = payload

  if (isActiveJob(payload)) {
    importInProgress.value = false
    activeImportJobId.value = null
    dispatchFailed(payload)
  }
}

function handleRowSuccess(payload: ImportSocketPayload) {
  if (isActiveJob(payload)) {
    dispatchRowSuccess(payload)
  }
}

function handleRowDuplicate(payload: ImportSocketPayload) {
  if (isActiveJob(payload)) {
    dispatchRowDuplicate(payload)
  }
}

function handleRowFailed(payload: ImportSocketPayload) {
  if (isActiveJob(payload)) {
    dispatchRowFailed(payload)
  }
}

let socketInitialized = false
let authWatchStarted = false
const unsubscribers: Array<() => void> = []

function ensureSocketListeners() {
  if (socketInitialized) {
    return
  }

  unsubscribers.push(socketService.onTopic(IMPORT_SOCKET_TOPICS.STARTED, handleStarted))
  unsubscribers.push(socketService.onTopic(IMPORT_SOCKET_TOPICS.COMPLETED, handleCompleted))
  unsubscribers.push(socketService.onTopic(IMPORT_SOCKET_TOPICS.FAILED, handleFailed))
  unsubscribers.push(socketService.onTopic(IMPORT_SOCKET_TOPICS.ROW_SUCCESS, handleRowSuccess))
  unsubscribers.push(socketService.onTopic(IMPORT_SOCKET_TOPICS.ROW_DUPLICATE, handleRowDuplicate))
  unsubscribers.push(socketService.onTopic(IMPORT_SOCKET_TOPICS.ROW_FAILED, handleRowFailed))
  socketInitialized = true
}

function ensureAuthWatch(auth: ReturnType<typeof useAuthStore>) {
  if (authWatchStarted) {
    return
  }

  authWatchStarted = true

  watch(
    () => auth.token,
    (token) => {
      if (token) {
        ensureSocketListeners()
        socketService.connect(token)
      } else {
        socketService.disconnect()
      }
    },
    { immediate: true },
  )
}

export function useImportNotifications() {
  const auth = useAuthStore()
  ensureAuthWatch(auth)

  function trackImportJob(importJobId: number) {
    activeImportJobId.value = importJobId
    importInProgress.value = true
  }

  function clearImportJob() {
    activeImportJobId.value = null
    importInProgress.value = false
  }

  function onImportCompleted(handler: ImportEventHandler) {
    completedHandlers.add(handler)
    return () => completedHandlers.delete(handler)
  }

  function onImportFailed(handler: ImportEventHandler) {
    failedHandlers.add(handler)
    return () => failedHandlers.delete(handler)
  }

  function onImportRowSuccess(handler: ImportRowEventHandler) {
    rowSuccessHandlers.add(handler)
    return () => rowSuccessHandlers.delete(handler)
  }

  function onImportRowDuplicate(handler: ImportRowEventHandler) {
    rowDuplicateHandlers.add(handler)
    return () => rowDuplicateHandlers.delete(handler)
  }

  function onImportRowFailed(handler: ImportRowEventHandler) {
    rowFailedHandlers.add(handler)
    return () => rowFailedHandlers.delete(handler)
  }

  return {
    activeImportJobId,
    importInProgress,
    lastImportNotification,
    trackImportJob,
    clearImportJob,
    onImportCompleted,
    onImportFailed,
    onImportRowSuccess,
    onImportRowDuplicate,
    onImportRowFailed,
  }
}
