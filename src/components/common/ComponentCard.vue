<template>
  <div
    :class="[
      'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]',
      className,
    ]"
  >
    <!-- Card Header -->
    <div v-if="!hideHeader" class="shrink-0 px-4 py-4 sm:px-6 sm:py-5">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
            {{ title }}
          </h3>
          <p v-if="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ desc }}
          </p>
        </div>
        <slot name="header-right"></slot>
      </div>
    </div>

    <!-- Card Body -->
    <div
      :class="[
        bodyClass ?? 'border-t border-gray-100 p-3 dark:border-gray-800 sm:p-4 md:p-6',
      ]"
    >
      <div :class="slotClass ?? 'space-y-5'">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  title: string
  className?: string
  desc?: string
  bodyClass?: string
  slotClass?: string
  hideHeader?: boolean
}

defineProps<Props>()
</script>
