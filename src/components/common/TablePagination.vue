<template>
  <div
    v-if="shouldShow"
    class="flex shrink-0 flex-col items-stretch justify-between gap-2 border-t border-gray-100 pt-2 dark:border-gray-800 sm:flex-row sm:items-center"
    :class="wrapperClass"
  >
    <p class="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
      <template v-if="from != null && to != null && total != null">
        {{ from }}–{{ to }} / {{ total }}
      </template>
      <template v-else-if="total != null">
        Tổng số:
        <span class="font-semibold text-gray-700 dark:text-gray-300">{{ total }}</span>
        {{ itemLabel }}
      </template>
      <template v-else>
        Trang {{ page }} / {{ safeLastPage }}
      </template>
      <span v-if="total != null || (from != null && to != null)" class="text-gray-400 lg:hidden">
        · Trang {{ page }}/{{ safeLastPage }}
      </span>
    </p>

    <div class="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
      <label
        v-if="showPageSize"
        class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <span class="whitespace-nowrap">Hiển thị</span>
        <select
          :value="perPage"
          :disabled="disabled"
          class="h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          @change="onPerPageChange"
        >
          <option v-for="size in resolvedPageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </label>

      <button
        type="button"
        :disabled="disabled || page <= 1"
        :class="navBtnClass(page <= 1)"
        aria-label="Trang trước"
        @click="goTo(page - 1)"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        v-for="p in visiblePages"
        :key="p"
        type="button"
        :disabled="disabled"
        :class="[
          'hidden sm:inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
          page === p
            ? 'border-brand-500 bg-brand-500 text-white'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        ]"
        @click="goTo(p)"
      >
        {{ p }}
      </button>

      <span
        class="inline-flex h-9 items-center px-1 text-sm text-gray-600 sm:hidden dark:text-gray-300"
      >
        {{ page }} / {{ safeLastPage }}
      </span>

      <button
        type="button"
        :disabled="disabled || page >= safeLastPage"
        :class="navBtnClass(page >= safeLastPage)"
        aria-label="Trang sau"
        @click="goTo(page + 1)"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    lastPage: number
    total?: number | null
    from?: number | null
    to?: number | null
    perPage?: number | null
    pageSizeOptions?: number[]
    itemLabel?: string
    disabled?: boolean
    /** Ẩn thanh phân trang khi chỉ có 1 trang (và không có chọn page size). */
    hideWhenSinglePage?: boolean
    wrapperClass?: string
  }>(),
  {
    total: null,
    from: null,
    to: null,
    perPage: null,
    pageSizeOptions: () => [15, 25, 50, 100, 200, 300, 400, 500],
    itemLabel: 'bản ghi',
    disabled: false,
    hideWhenSinglePage: false,
    wrapperClass: '',
  },
)

const DEFAULT_PAGE_SIZES = [15, 25, 50, 100, 200, 300, 400, 500]

const emit = defineEmits<{
  'update:page': [page: number]
  'update:perPage': [perPage: number]
  change: [page: number]
  'per-page-change': [perPage: number]
}>()

const safeLastPage = computed(() => Math.max(1, Number(props.lastPage) || 1))

const showPageSize = computed(() => props.perPage != null)

const resolvedPageSizeOptions = computed(() => {
  const options = props.pageSizeOptions?.length ? props.pageSizeOptions : DEFAULT_PAGE_SIZES
  if (props.perPage != null && !options.includes(props.perPage)) {
    return [...options, props.perPage].sort((a, b) => a - b)
  }
  return options
})

const shouldShow = computed(() => {
  if (!props.hideWhenSinglePage) return true
  if (showPageSize.value && (props.total == null || props.total > 0)) return true
  return safeLastPage.value > 1
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  const total = safeLastPage.value
  const current = Math.min(Math.max(1, props.page), total)
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function navBtnClass(inactive: boolean) {
  return [
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition',
    inactive || props.disabled
      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
  ]
}

function goTo(next: number) {
  if (props.disabled) return
  const page = Math.min(Math.max(1, next), safeLastPage.value)
  if (page === props.page) return
  emit('update:page', page)
  emit('change', page)
}

function onPerPageChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  if (!Number.isFinite(value) || value <= 0) return
  emit('update:perPage', value)
  emit('per-page-change', value)
}
</script>
