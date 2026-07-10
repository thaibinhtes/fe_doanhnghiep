<template>
  <router-link to="/" class="lg:hidden text-sm font-semibold text-gray-900 dark:text-white">
    {{ APP_SHORT_NAME }}
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { APP_SHORT_NAME } from '@/config/app'
</script>
