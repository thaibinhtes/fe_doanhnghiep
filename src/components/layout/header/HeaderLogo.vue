<template>
  <router-link to="/" class="flex items-center gap-2 lg:hidden">
    <span
      class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold-500 bg-brand-600"
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" class="h-4 w-4">
        <polygon
          points="24,8 28.5,19 40,19 30.5,26.5 34,38 24,30.5 14,38 17.5,26.5 8,19 19.5,19"
          fill="#d4af37"
        />
      </svg>
    </span>
    <span class="text-sm font-bold text-brand-700 dark:text-brand-300">{{ APP_SHORT_NAME }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { APP_SHORT_NAME } from '@/config/app'
</script>
