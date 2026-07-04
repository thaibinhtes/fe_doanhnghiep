<template>
  <div class="pointer-events-none fixed bottom-5 right-5 z-[99999] flex max-w-md flex-col gap-2">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-for="item in toasts"
        :key="item.id"
        class="pointer-events-auto rounded-xl border px-4 py-3 shadow-theme-lg backdrop-blur-sm"
        :class="toastClass(item.type)"
        role="status"
        aria-live="polite"
      >
        <p class="text-sm font-semibold">
          {{ item.title }}
        </p>
        <p v-if="item.message" class="mt-1 text-sm opacity-90">
          {{ item.message }}
        </p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useImportNotifications } from '@/composables/useImportNotifications'
import type { ImportSocketPayload } from '@/services/socketService'

type ToastType = 'success' | 'warning' | 'error'

interface ToastItem {
  id: number
  type: ToastType
  title: string
  message?: string
}

const toasts = ref<ToastItem[]>([])
let nextToastId = 1
const MAX_VISIBLE = 4
const ROW_TOAST_MS = 3500
const SUMMARY_TOAST_MS = 8000

function toastClass(type: ToastType) {
  if (type === 'success') {
    return 'border-emerald-200 bg-emerald-50/95 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-100'
  }
  if (type === 'warning') {
    return 'border-amber-200 bg-amber-50/95 text-amber-900 dark:border-amber-800 dark:bg-amber-950/90 dark:text-amber-100'
  }
  return 'border-red-200 bg-red-50/95 text-red-900 dark:border-red-800 dark:bg-red-950/90 dark:text-red-100'
}

function showToast(type: ToastType, title: string, message?: string, duration = ROW_TOAST_MS) {
  const id = nextToastId++
  toasts.value = [{ id, type, title, message }, ...toasts.value].slice(0, MAX_VISIBLE)

  window.setTimeout(() => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }, duration)
}

function formatCompanyLabel(payload: ImportSocketPayload): string {
  const name = payload.tenDoanhNghiep?.trim()
  const msdn = payload.maSoDoanhNghiep?.trim()
  if (name && msdn) {
    return `${name} (${msdn})`
  }
  return name || msdn || `Dòng ${payload.row ?? ''}`
}

const {
  onImportCompleted,
  onImportFailed,
  onImportRowSuccess,
  onImportRowDuplicate,
} = useImportNotifications()

onMounted(() => {
  onImportRowSuccess((payload) => {
    showToast('success', 'Import thành công', formatCompanyLabel(payload))
  })

  onImportRowDuplicate((payload) => {
    showToast('warning', 'Doanh nghiệp trùng', formatCompanyLabel(payload))
  })

  onImportCompleted((payload) => {
    const duplicates = payload.result?.duplicates ?? payload.result?.updated ?? 0
    showToast(
      'success',
      'Import Excel hoàn tất',
      payload.message ??
        (payload.result
          ? `${payload.result.imported} mới, ${duplicates} trùng, ${payload.result.failed} lỗi`
          : undefined),
      SUMMARY_TOAST_MS,
    )
  })

  onImportFailed((payload) => {
    showToast('error', 'Import Excel thất bại', payload.message ?? 'Vui lòng thử lại.', SUMMARY_TOAST_MS)
  })
})
</script>
