<template>
  <div class="space-y-6" aria-label="Đang tải dữ liệu dashboard" aria-busy="true">
    <section
      v-for="section in sections"
      :key="section"
      class="space-y-4"
      :class="{ 'border-t border-gray-200 pt-6 dark:border-gray-800': section === 'cooperative' }"
    >
      <div class="flex items-center gap-3">
        <div class="skeleton h-10 w-10 rounded-xl"></div>
        <div class="space-y-2">
          <div class="skeleton h-5 w-28 rounded-md"></div>
          <div class="skeleton h-3.5 w-52 max-w-[60vw] rounded"></div>
        </div>
      </div>

      <div class="grid gap-5 xl:grid-cols-12">
        <!-- Tổng quan -->
        <div class="dashboard-card-skeleton xl:col-span-4">
          <SkeletonHeader />
          <div class="border-t border-gray-100 p-4 dark:border-gray-800 md:p-6">
            <div class="grid min-h-[180px] grid-cols-[minmax(0,1fr)_140px] items-center gap-4">
              <div class="space-y-5">
                <div class="space-y-2">
                  <div class="skeleton h-3.5 w-28 rounded"></div>
                  <div class="skeleton h-8 w-20 rounded-md"></div>
                </div>
                <div class="space-y-3">
                  <div v-for="item in 3" :key="item" class="flex items-center justify-between gap-3">
                    <div class="flex min-w-0 flex-1 items-center gap-2">
                      <div class="skeleton h-2.5 w-2.5 shrink-0 rounded-full"></div>
                      <div class="skeleton h-3.5 rounded" :class="item === 2 ? 'w-24' : 'w-20'"></div>
                    </div>
                    <div class="skeleton h-4 w-9 shrink-0 rounded"></div>
                  </div>
                </div>
              </div>
              <div class="relative mx-auto h-32 w-32 rounded-full border-[18px] border-gray-100 dark:border-gray-800">
                <div class="absolute inset-[-18px] animate-pulse rounded-full border-[18px] border-transparent border-t-gray-200 border-r-gray-200/70 dark:border-t-gray-700 dark:border-r-gray-700/70"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Theo địa bàn -->
        <div class="dashboard-card-skeleton xl:col-span-8">
          <div class="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
            <SkeletonHeaderContent />
            <div class="skeleton h-10 w-36 shrink-0 rounded-lg"></div>
          </div>
          <div class="border-t border-gray-100 p-4 dark:border-gray-800 md:p-6">
            <div class="space-y-4 py-2">
              <div v-for="(width, index) in chartBarWidths" :key="width" class="flex items-center gap-3">
                <div class="skeleton h-3.5 w-24 shrink-0 rounded"></div>
                <div class="h-7 min-w-0 flex-1 overflow-hidden rounded bg-gray-50 dark:bg-gray-800/50">
                  <div
                    class="skeleton h-full rounded"
                    :style="{ width }"
                    :class="{ 'animation-delay': index % 2 === 1 }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tra cứu -->
        <div class="dashboard-card-skeleton xl:col-span-12">
          <SkeletonHeader />
          <div class="border-t border-gray-100 p-4 dark:border-gray-800 md:p-6">
            <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div class="skeleton h-10 rounded-lg"></div>
              <div class="skeleton h-10 rounded-lg"></div>
            </div>
            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <div v-for="item in 3" :key="item" class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div class="skeleton h-3.5 w-24 rounded"></div>
                <div class="skeleton mt-3 h-7 w-16 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

const sections = ['company', 'cooperative'] as const
const chartBarWidths = ['72%', '48%', '84%', '61%', '38%']

const SkeletonHeaderContent = defineComponent({
  name: 'SkeletonHeaderContent',
  setup: () => () => h('div', { class: 'min-w-0 flex-1 space-y-2' }, [
    h('div', { class: 'skeleton h-4 w-24 rounded' }),
    h('div', { class: 'skeleton h-3.5 w-56 max-w-full rounded' }),
  ]),
})

const SkeletonHeader = defineComponent({
  name: 'SkeletonHeader',
  setup: () => () => h('div', { class: 'px-4 py-4 sm:px-6 sm:py-5' }, [
    h(SkeletonHeaderContent),
  ]),
})
</script>

<style scoped>
.dashboard-card-skeleton {
  overflow: hidden;
  border: 1px solid rgb(229 231 235);
  border-radius: 1rem;
  background: white;
}

.skeleton {
  animation: dashboard-pulse 1.7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: rgb(243 244 246);
}

.animation-delay {
  animation-delay: 180ms;
}

@keyframes dashboard-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.48;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton,
  .animate-pulse {
    animation: none;
  }
}

:global(.dark) .dashboard-card-skeleton {
  border-color: rgb(31 41 55);
  background: rgb(255 255 255 / 0.03);
}

:global(.dark) .skeleton {
  background: rgb(31 41 55);
}
</style>
