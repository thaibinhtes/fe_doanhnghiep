<template>
  <div
    :class="[
      'min-w-0 max-w-full',
      className,
      isFullscreen ? 'min-h-[280px]' : '',
    ]"
  >
    <Teleport to="body" :disabled="!isFullscreen">
      <div
        :class="[
          'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]',
          isFullscreen
            ? 'fixed inset-0 z-[100000] flex h-dvh max-h-dvh w-full max-w-[100vw] flex-col overflow-hidden rounded-none border-0 bg-white shadow-2xl dark:bg-gray-950'
            : 'flex h-full min-h-0 min-w-0 max-w-full flex-col overflow-hidden',
        ]"
      >
        <!-- Card Header -->
        <div v-if="!hideHeader" class="shrink-0 px-3 py-2.5 sm:px-4 sm:py-3">
          <div class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
                {{ title }}
              </h3>
              <p v-if="desc" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {{ desc }}
              </p>
            </div>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <slot name="header-right"></slot>
              <button
                v-if="fullscreenable"
                type="button"
                class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                :title="isFullscreen ? 'Thu nhỏ' : 'Xem toàn màn hình'"
                :aria-label="isFullscreen ? 'Thu nhỏ' : 'Xem toàn màn hình'"
                @click="toggleFullscreen"
              >
                <Minimize2 v-if="isFullscreen" class="h-[18px] w-[18px]" />
                <Maximize2 v-else class="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div
          :class="[
            bodyClass ?? 'border-t border-gray-100 p-2.5 dark:border-gray-800 sm:p-3',
            'min-h-0 flex-1',
            isFullscreen ? 'overflow-auto' : '',
          ]"
        >
          <div :class="[slotClass ?? 'space-y-3', slotClass ? 'min-h-0 flex-1' : '']">
            <slot></slot>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Maximize2, Minimize2 } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title: string
    className?: string
    desc?: string
    bodyClass?: string
    slotClass?: string
    hideHeader?: boolean
    fullscreenable?: boolean
  }>(),
  {
    fullscreenable: false,
  },
)

const isFullscreen = ref(false)

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const exitFullscreen = () => {
  isFullscreen.value = false
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullscreen.value) {
    exitFullscreen()
  }
}

watch(isFullscreen, (value) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

defineExpose({
  isFullscreen,
  toggleFullscreen,
  exitFullscreen,
})
</script>
