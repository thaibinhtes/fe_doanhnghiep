<template>
  <div class="flex h-dvh overflow-hidden">
    <app-sidebar />
    <Backdrop />
    <div
      class="layout__main flex min-h-0 flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header class="shrink-0" />
      <div
        class="flex w-full flex-1 flex-col min-h-0 p-2 sm:p-2.5 md:p-3"
        :class="contentClass"
      >
        <slot></slot>
      </div>
      <footer class="shrink-0 border-t border-gray-200 bg-white px-4 py-2.5 text-center text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        {{ APP_FOOTER }}
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
import { APP_FOOTER } from '@/config/app'

const route = useRoute()
const { isExpanded, isHovered } = useSidebar()

const fillViewport = computed(() => route.meta.fillViewport === true)

const contentClass = computed(() =>
  fillViewport.value ? 'overflow-y-auto lg:overflow-hidden' : 'overflow-y-auto',
)
</script>

<style lang="scss">
  .layout {
    &__main {
      width: 100%;
    }
    @media (min-width: 1024px) {
      &__main {
        width: calc(100% - 90px);
      }
    }
  }
</style>