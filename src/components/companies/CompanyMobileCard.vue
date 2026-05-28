<template>
  <article
    class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/50"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">#{{ index + 1 }}</p>
        <h3 class="mt-0.5 truncate text-base font-semibold text-gray-900 dark:text-white/90">
          {{ company.tenDoanhNghiep }}
        </h3>
        <p v-if="company.maSoDoanhNghiep" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          MST: {{ company.maSoDoanhNghiep }}
        </p>
      </div>
      <span
        :class="[
          'shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
          statusClass(company.trangThai),
        ]"
      >
        {{ company.trangThai || '—' }}
      </span>
    </div>

    <dl class="mt-4 space-y-2 text-sm">
      <div v-if="company.diaChi && company.diaChi !== '-'" class="flex gap-2">
        <dt class="shrink-0 text-gray-500 dark:text-gray-400 w-24">Địa chỉ</dt>
        <dd class="text-gray-800 dark:text-gray-200 break-words">{{ company.diaChi }}</dd>
      </div>
      <div v-if="company.dienThoai && company.dienThoai !== '-'" class="flex gap-2">
        <dt class="shrink-0 text-gray-500 dark:text-gray-400 w-24">Điện thoại</dt>
        <dd class="text-gray-800 dark:text-gray-200">{{ company.dienThoai }}</dd>
      </div>
      <div v-if="repName" class="flex gap-2">
        <dt class="shrink-0 text-gray-500 dark:text-gray-400 w-24">Đại diện</dt>
        <dd class="text-gray-800 dark:text-gray-200 break-words">{{ repName }}</dd>
      </div>
      <div v-if="ownerName" class="flex gap-2">
        <dt class="shrink-0 text-gray-500 dark:text-gray-400 w-24">Chủ sở hữu</dt>
        <dd class="text-gray-800 dark:text-gray-200 break-words">{{ ownerName }}</dd>
      </div>
      <div v-if="company.vonDieuLe && company.vonDieuLe !== '-'" class="flex gap-2">
        <dt class="shrink-0 text-gray-500 dark:text-gray-400 w-24">Vốn ĐL</dt>
        <dd class="text-gray-800 dark:text-gray-200">{{ formatVND(company.vonDieuLe) }}</dd>
      </div>
      <div v-if="company.loaiHinhDN && company.loaiHinhDN !== '-'" class="flex gap-2">
        <dt class="shrink-0 text-gray-500 dark:text-gray-400 w-24">Loại hình</dt>
        <dd class="text-gray-800 dark:text-gray-200">{{ company.loaiHinhDN }}</dd>
      </div>
      <div class="flex gap-2">
        <dt class="shrink-0 text-gray-500 dark:text-gray-400 w-24">Định danh</dt>
        <dd>
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              company.daCapNhatDinhDanh
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
            ]"
          >
            {{ company.daCapNhatDinhDanh ? 'Đã cập nhật định danh' : 'Chưa cập nhật định danh' }}
          </span>
        </dd>
      </div>
      <div v-if="company.dsThanhVienGopVon?.length" class="flex gap-2">
        <dt class="shrink-0 text-gray-500 dark:text-gray-400 w-24">Góp vốn</dt>
        <dd class="min-w-0 flex-1 space-y-1 text-gray-800 dark:text-gray-200">
          <div
            v-for="(member, idx) in company.dsThanhVienGopVon.slice(0, 3)"
            :key="idx"
            class="text-xs leading-relaxed"
          >
            <span class="font-medium">{{ member.fullName }}</span>
            <span v-if="member.position" class="text-gray-500"> · {{ member.position }}</span>
            <span v-if="member.investmentAmount" class="text-gray-500">
              — {{ formatVND(member.investmentAmount) }}
            </span>
          </div>
          <p
            v-if="company.dsThanhVienGopVon.length > 3"
            class="text-xs text-gray-500"
          >
            +{{ company.dsThanhVienGopVon.length - 3 }} thành viên
          </p>
        </dd>
      </div>
    </dl>

    <div class="mt-4 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
      <button
        type="button"
        @click="$emit('toggle-dinh-danh', company)"
        class="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white transition hover:bg-emerald-700"
      >
        {{ company.daCapNhatDinhDanh ? 'Đặt chưa cập nhật' : 'Cập nhật định danh' }}
      </button>
      <button
        type="button"
        @click="$emit('edit', company)"
        class="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 text-sm font-medium text-white transition hover:bg-brand-600"
      >
        Chỉnh sửa
      </button>
      <button
        type="button"
        @click="$emit('delete', company.id)"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white transition hover:bg-red-600"
        aria-label="Xóa"
      >
        <svg class="fill-current" width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M6.875 3.125C6.875 2.43464 7.43464 1.875 8.125 1.875H11.875C12.5654 1.875 13.125 2.43464 13.125 3.125V4.375H17.5C17.8452 4.375 18.125 4.65482 18.125 5C18.125 5.34518 17.8452 5.625 17.5 5.625H16.4463L15.8928 16.6602C15.8425 17.7236 14.9707 18.5625 13.9052 18.5625H6.09479C5.02931 18.5625 4.1575 17.7236 4.10718 16.6602L3.55369 5.625H2.5C2.15482 5.625 1.875 5.34518 1.875 5C1.875 4.65482 2.15482 4.375 2.5 4.375H6.875V3.125ZM8.125 3.125V4.375H11.875V3.125H8.125ZM4.78355 5.625L5.30959 16.2305C5.32971 16.6309 5.65895 16.9375 6.06007 16.9375H13.9399C14.3411 16.9375 14.6703 16.6309 14.6904 16.2305L15.2165 5.625H4.78355Z"/>
        </svg>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Company } from '@/types/company'
import { formatVND } from '@/utils/formatters'

const props = defineProps<{
  company: Company
  index: number
  statusClass: (status: string | null) => string
}>()

defineEmits<{
  edit: [company: Company]
  'toggle-dinh-danh': [company: Company]
  delete: [id: number]
}>()

const repName = computed(
  () => props.company.nguoiDaiDienTen || props.company.nguoiDaiDien?.fullName || '',
)
const ownerName = computed(
  () => props.company.chuSoHuuTen || props.company.chuSoHuu?.fullName || '',
)
</script>
