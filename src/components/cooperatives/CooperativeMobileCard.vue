<template>
  <article class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">#{{ cooperative.tt ?? index + 1 }}</p>
        <h3 class="mt-0.5 truncate text-base font-semibold text-gray-900 dark:text-white/90">
          {{ cooperative.tenHtx }}
        </h3>
        <p v-if="cooperative.maSoThue" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          MST: {{ cooperative.maSoThue }}
        </p>
      </div>
      <span
        v-if="cooperative.hoatDong && cooperative.hoatDong !== '-'"
        class="shrink-0 inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
      >
        {{ cooperative.hoatDong }}
      </span>
    </div>

    <dl class="mt-4 space-y-2 text-sm">
      <div v-if="cooperative.diaChi && cooperative.diaChi !== '-'" class="flex gap-2">
        <dt class="w-24 shrink-0 text-gray-500 dark:text-gray-400">Địa chỉ</dt>
        <dd class="break-words text-gray-800 dark:text-gray-200">{{ cooperative.diaChi }}</dd>
      </div>
      <div v-if="cooperative.phuongXa && cooperative.phuongXa !== '-'" class="flex gap-2">
        <dt class="w-24 shrink-0 text-gray-500 dark:text-gray-400">Phường/xã</dt>
        <dd class="text-gray-800 dark:text-gray-200">{{ cooperative.phuongXa }}</dd>
      </div>
      <div v-if="cooperative.chuTichHdqtTen && cooperative.chuTichHdqtTen !== '-'" class="flex gap-2">
        <dt class="w-24 shrink-0 text-gray-500 dark:text-gray-400">CT HĐQT</dt>
        <dd class="text-gray-800 dark:text-gray-200">{{ cooperative.chuTichHdqtTen }}</dd>
      </div>
      <div v-if="cooperative.dienThoai && cooperative.dienThoai !== '-'" class="flex gap-2">
        <dt class="w-24 shrink-0 text-gray-500 dark:text-gray-400">Điện thoại</dt>
        <dd class="text-gray-800 dark:text-gray-200">{{ cooperative.dienThoai }}</dd>
      </div>
      <div v-if="cooperative.linhVuc && cooperative.linhVuc !== '-'" class="flex gap-2">
        <dt class="w-24 shrink-0 text-gray-500 dark:text-gray-400">Lĩnh vực</dt>
        <dd class="text-gray-800 dark:text-gray-200">{{ cooperative.linhVuc }}</dd>
      </div>
      <div v-if="cooperative.tinhTrangThue" class="flex gap-2">
        <dt class="w-24 shrink-0 text-gray-500 dark:text-gray-400">Thuế</dt>
        <dd>
          <span
            class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
            :class="taxStatusClass(cooperative.tinhTrangThue)"
          >
            {{ cooperative.tinhTrangThue }}
          </span>
        </dd>
      </div>
    </dl>

    <div v-if="showActions" class="mt-4 flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
      <button
        type="button"
        class="flex-1 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
        @click="emit('delete', cooperative)"
      >
        Xóa
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Cooperative } from '@/types/cooperative'

defineProps<{
  cooperative: Cooperative
  index: number
  showActions?: boolean
}>()

const emit = defineEmits<{
  delete: [cooperative: Cooperative]
}>()

const taxStatusClass = (status?: string | null) => {
  if (status === 'Đang hoạt động') {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }
  if (status === 'Ngừng hoạt động' || status === 'Không hoạt động') {
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }

  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>
