<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Biểu theo dõi tiến độ định danh tổ chức cho doanh nghiệp">
        <div class="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
          <p class="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">Bộ lọc khoảng thời gian</p>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label class="block space-y-1.5">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Ngày báo cáo</span>
              <input
                v-model="filters.reportDate"
                type="date"
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
            </label>
            <label class="block space-y-1.5">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Kỳ 1 — đến ngày</span>
              <input
                v-model="filters.range1To"
                type="date"
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400">Từ trước đến ngày chọn</span>
            </label>
            <label class="block space-y-1.5">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Kỳ 2 — từ ngày</span>
              <input
                v-model="filters.range2From"
                type="date"
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
            </label>
            <label class="block space-y-1.5">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Kỳ 2 — đến ngày</span>
              <input
                v-model="filters.range2To"
                type="date"
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
            </label>
          </div>
          <p v-if="filterError" class="mt-3 text-sm text-red-600 dark:text-red-400">{{ filterError }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              @click="applyFilters"
              :disabled="loading"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Áp dụng
            </button>
            <button
              @click="resetFilters"
              :disabled="loading"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Đặt lại mặc định
            </button>
          </div>
        </div>

        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div v-if="report" class="space-y-1">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ report.reportDateLabel }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Cập nhật lúc: {{ formatDate(report.generatedAt) }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="loadReport"
              :disabled="loading"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {{ loading ? 'Đang tải...' : 'Làm mới' }}
            </button>
            <button
              v-if="auth.hasPermission('feature.reports.export')"
              @click="handleExport"
              :disabled="exporting"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {{ exporting ? 'Đang xuất...' : 'Xuất mẫu báo cáo' }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else-if="report" class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[1400px] w-full border-collapse text-sm">
            <thead>
              <tr class="bg-yellow-300 dark:bg-yellow-600/40">
                <th
                  rowspan="2"
                  class="border border-gray-300 px-3 py-3 text-center font-semibold text-gray-800 dark:border-gray-600 dark:text-gray-100"
                >
                  Stt
                </th>
                <th
                  rowspan="2"
                  class="border border-gray-300 px-3 py-3 text-center font-semibold text-gray-800 dark:border-gray-600 dark:text-gray-100"
                >
                  Loại hình
                </th>
                <th
                  v-for="range in report.ranges"
                  :key="`range-${range.key}`"
                  colspan="5"
                  class="border border-gray-300 px-3 py-3 text-center font-semibold text-gray-800 dark:border-gray-600 dark:text-gray-100"
                >
                  {{ range.label }}
                </th>
                <th
                  rowspan="2"
                  class="border border-gray-300 px-3 py-3 text-center font-semibold text-gray-800 dark:border-gray-600 dark:text-gray-100"
                >
                  Ghi chú
                </th>
              </tr>
              <tr class="bg-yellow-300 dark:bg-yellow-600/40">
                <template v-for="range in report.ranges" :key="`metrics-${range.key}`">
                  <th
                    v-for="(label, metricKey) in report.metricLabels"
                    :key="`${range.key}-${metricKey}`"
                    class="border border-gray-300 px-2 py-3 text-center text-xs font-semibold text-gray-800 dark:border-gray-600 dark:text-gray-100"
                  >
                    {{ label }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in report.rows"
                :key="row.key"
                :class="row.isTotal ? 'bg-gray-50 font-bold dark:bg-gray-800/60' : ''"
              >
                <td class="border border-gray-200 px-3 py-3 text-center dark:border-gray-700">
                  {{ row.stt ?? '' }}
                </td>
                <td class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">
                  {{ row.label }}
                </td>
                <template v-for="range in report.ranges" :key="`${row.key}-${range.key}`">
                  <td
                    v-for="(label, metricKey) in report.metricLabels"
                    :key="`${row.key}-${range.key}-${metricKey}`"
                    class="border border-gray-200 px-3 py-3 text-center dark:border-gray-700"
                    :class="metricKey === 'chuaDinhDanh' ? 'font-semibold text-red-600 dark:text-red-400' : ''"
                  >
                    {{ row.periods[range.key]?.[metricKey as keyof typeof report.metricLabels] ?? 0 }}
                  </td>
                </template>
                <td class="border border-gray-200 px-3 py-3 text-center dark:border-gray-700">
                  {{ row.ghiChu ?? '' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { reportService } from '@/services/reportService'
import { useAuthStore } from '@/stores/auth'
import type { ProgressReport } from '@/types/report'

const auth = useAuthStore()
const loading = ref(true)
const exporting = ref(false)
const filterError = ref('')
const report = ref<ProgressReport | null>(null)

const todayIso = () => new Date().toISOString().slice(0, 10)

const defaultFilters = () => ({
  reportDate: todayIso(),
  range1To: '2025-12-31',
  range2From: '2026-01-01',
  range2To: todayIso(),
})

const filters = reactive(defaultFilters())

const formatDate = (value: string) => new Date(value).toLocaleString('vi-VN')

const validateFilters = () => {
  if (!filters.range1To || !filters.range2From || !filters.range2To) {
    filterError.value = 'Vui lòng chọn đầy đủ các ngày lọc.'
    return false
  }

  if (filters.range2From > filters.range2To) {
    filterError.value = 'Kỳ 2: ngày bắt đầu phải trước hoặc bằng ngày kết thúc.'
    return false
  }

  filterError.value = ''
  return true
}

const buildQuery = () => ({
  reportDate: filters.reportDate || todayIso(),
  range1To: filters.range1To,
  range2From: filters.range2From,
  range2To: filters.range2To,
})

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const loadReport = async () => {
  if (!validateFilters()) return

  loading.value = true
  try {
    report.value = await reportService.getProgress(buildQuery())
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  loadReport()
}

const resetFilters = () => {
  Object.assign(filters, defaultFilters())
  loadReport()
}

const handleExport = async () => {
  if (!validateFilters()) return

  exporting.value = true
  try {
    const blob = await reportService.exportProgress(buildQuery())
    downloadBlob(blob, `bao-cao-tien-do-dinh-danh_${filters.range2To}.xlsx`)
  } catch {
    alert('Xuất báo cáo thất bại.')
  } finally {
    exporting.value = false
  }
}

onMounted(loadReport)
</script>
