<template>
  <div class="flex h-dvh max-h-dvh flex-col overflow-hidden">
    <main class="flex min-h-0 flex-1 overflow-hidden">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { APP_FOOTER } from '@/config/app'
</script>
