<template>
  <div class="flex flex-col gap-2 mb-4 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90 sm:text-xl" x-text="pageTitle">
      {{ pageTitle }}
    </h2>
    <nav>
      <ol class="flex items-center gap-1.5">
        <li>
          <router-link
            class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            to="/"
          >
            Home
            <svg
              class="stroke-current"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                stroke=""
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </li>
        <li class="text-sm text-gray-800 dark:text-white/90">
          {{ pageTitle }}
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface BreadcrumbProps {
  pageTitle: string
}

defineProps<BreadcrumbProps>()
</script>
