<template>
  <div
    class="mx-auto mb-10 w-full max-w-60 rounded-2xl border border-gold-200 bg-brand-50 px-4 py-5 text-center dark:border-brand-800 dark:bg-brand-950/40"
  >
    <p class="text-[11px] font-bold uppercase tracking-wide text-gold-700 dark:text-gold-400">
      {{ APP_ORG }}
    </p>
    <h3 class="mt-1 font-bold text-brand-700 dark:text-brand-300">{{ APP_SHORT_NAME }}</h3>
    <p class="mt-2 text-gray-600 text-theme-sm dark:text-gray-400">
      {{ APP_TAGLINE }}
    </p>
    <router-link
      to="/dashboard"
      class="mt-4 flex items-center justify-center rounded-lg bg-brand-600 p-3 font-semibold text-white text-theme-sm hover:bg-brand-700"
    >
      Về trang chủ
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { APP_ORG, APP_SHORT_NAME, APP_TAGLINE } from '@/config/app'
</script>
