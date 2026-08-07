<template>
  <div
    class="list-table-scroll min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto overscroll-contain rounded-xl border border-gray-200 dark:border-gray-700"
    :class="className"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Extra classes merged onto the scroll surface */
    className?: string
  }>(),
  {
    className: '',
  },
)
</script>
