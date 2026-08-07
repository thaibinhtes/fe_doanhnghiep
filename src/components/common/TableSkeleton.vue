<template>
  <div
    class="table-skeleton"
    role="status"
    aria-live="polite"
    aria-busy="true"
    :aria-label="ariaLabel"
    :class="fillHeight ? 'flex h-full min-h-0 flex-1 flex-col' : ''"
  >
    <!-- Mobile / card list -->
    <div
      v-if="variant === 'cards' || variant === 'both'"
      class="grid gap-3"
      :class="variant === 'both' ? 'lg:hidden' : ''"
    >
      <div
        v-for="row in rowIndexes"
        :key="`card-${row}`"
        class="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
      >
        <div class="space-y-3">
          <div class="skeleton h-4 w-2/3 max-w-[220px] rounded" />
          <div class="skeleton h-3.5 w-1/2 max-w-[160px] rounded" />
          <div class="skeleton h-3.5 w-5/6 max-w-[280px] rounded" />
          <div class="flex gap-2 pt-1">
            <div class="skeleton h-7 w-16 rounded-lg" />
            <div class="skeleton h-7 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop table -->
    <div
      v-if="variant === 'table' || variant === 'both'"
      class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
      :class="[
        variant === 'both' ? 'hidden lg:block' : '',
        fillHeight
          ? 'flex h-full min-h-0 flex-1 flex-col'
          : compact
            ? ''
            : 'min-h-[240px]',
        wrapperClass,
      ]"
    >
      <div
        class="min-w-full"
        :class="fillHeight ? 'min-h-0 flex-1 overflow-auto' : 'overflow-x-auto'"
      >
        <div
          v-if="showHeader"
          class="flex border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        >
          <div
            v-for="(col, index) in resolvedColumns"
            :key="`h-${index}`"
            class="shrink-0 p-[5px]"
            :style="{ width: col.width }"
          >
            <div class="skeleton h-3.5 rounded" :class="col.headerClass" />
          </div>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <div
            v-for="row in rowIndexes"
            :key="`r-${row}`"
            class="flex items-center"
            :class="row % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-gray-50/40 dark:bg-gray-900/20'"
          >
            <div
              v-for="(col, index) in resolvedColumns"
              :key="`c-${row}-${index}`"
              class="shrink-0 p-[5px]"
              :style="{ width: col.width }"
            >
              <div
                class="skeleton h-3.5 rounded"
                :class="cellClass(row, index, col)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <span class="sr-only">{{ ariaLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type TableSkeletonColumn = {
  width?: string
  /** Tailwind width classes for the shimmer bar inside the cell */
  barClass?: string
  headerClass?: string
}

const props = withDefaults(
  defineProps<{
    rows?: number
    columns?: number | TableSkeletonColumn[]
    variant?: 'table' | 'cards' | 'both'
    showHeader?: boolean
    compact?: boolean
    /** Stretch to fill parent flex/height chain (fillViewport list tables) */
    fillHeight?: boolean
    wrapperClass?: string
    ariaLabel?: string
  }>(),
  {
    rows: 8,
    columns: 6,
    variant: 'table',
    showHeader: true,
    compact: false,
    fillHeight: false,
    wrapperClass: '',
    ariaLabel: 'Đang tải dữ liệu bảng',
  },
)

const DEFAULT_WIDTHS = ['50px', '140px', '220px', '180px', '150px', '130px', '160px', '120px']

const rowIndexes = computed(() => Array.from({ length: Math.max(1, props.rows) }, (_, i) => i + 1))

const resolvedColumns = computed((): Required<TableSkeletonColumn>[] => {
  if (Array.isArray(props.columns)) {
    return props.columns.map((col, index) => ({
      width: col.width ?? DEFAULT_WIDTHS[index % DEFAULT_WIDTHS.length],
      barClass: col.barClass ?? defaultBarClass(index),
      headerClass: col.headerClass ?? 'w-16',
    }))
  }

  const count = Math.max(1, Number(props.columns) || 6)
  return Array.from({ length: count }, (_, index) => ({
    width: DEFAULT_WIDTHS[index % DEFAULT_WIDTHS.length],
    barClass: defaultBarClass(index),
    headerClass: 'w-16',
  }))
})

function defaultBarClass(index: number) {
  const classes = ['w-8', 'w-20', 'w-28', 'w-24', 'w-16', 'w-14', 'w-20', 'w-12']
  return classes[index % classes.length]
}

function cellClass(row: number, index: number, col: Required<TableSkeletonColumn>) {
  // Vary widths slightly so rows don't look identical.
  const variants = ['', 'opacity-90', 'w-[85%]', 'w-[70%]']
  const variant = variants[(row + index) % variants.length]
  return [col.barClass, variant].filter(Boolean)
}
</script>

<style scoped>
.skeleton {
  animation: table-skeleton-pulse 1.7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: rgb(243 244 246);
}

@keyframes table-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.48;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}

:global(.dark) .skeleton {
  background: rgb(31 41 55);
}
</style>
