<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 w-full min-w-0 transition-all duration-300 ease-in-out layout__main"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-3 mx-auto max-w-(--breakpoint-2xl) sm:p-4 md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
const { isExpanded, isHovered } = useSidebar()
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