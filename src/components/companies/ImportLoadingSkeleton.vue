<template>
  <div
    class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="flex items-start gap-4">
      <div class="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/30"
        />
        <span
          class="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
        >
          <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </span>
      </div>

      <div class="min-w-0 flex-1 space-y-3">
        <div>
          <p class="text-sm font-semibold text-gray-800 dark:text-white/90">
            {{ title }}
          </p>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>

        <div class="space-y-2">
          <div class="h-2.5 w-full animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          <div class="h-2.5 w-5/6 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          <div class="h-2.5 w-2/3 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
        </div>

        <p class="text-xs text-gray-400 dark:text-gray-500">
          Bạn có thể đóng cửa sổ này — hệ thống sẽ thông báo khi import hoàn tất.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string | null
  }>(),
  {
    title: 'Đang xử lý import Excel...',
    subtitle: null,
  },
)
</script>
