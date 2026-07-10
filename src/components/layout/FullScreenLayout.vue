<template>
  <div class="flex h-dvh max-h-dvh flex-col overflow-hidden">
    <main class="flex min-h-0 flex-1 overflow-hidden">
      <slot></slot>
    </main>
    <footer class="shrink-0 border-t border-white/20 bg-white/90 px-4 py-2.5 text-center text-xs text-gray-600 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-400">
      {{ APP_FOOTER }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { APP_FOOTER } from '@/config/app'
</script>
