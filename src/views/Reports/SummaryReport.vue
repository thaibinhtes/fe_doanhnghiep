<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Báo cáo tổng hợp trạng thái doanh nghiệp">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p v-if="report" class="text-sm text-gray-500 dark:text-gray-400">
            Cập nhật lúc: {{ formatDate(report.generatedAt) }}
          </p>
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
              {{ exporting ? 'Đang xuất...' : 'Xuất Excel' }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else-if="report" class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[1200px] w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/60">
                <th class="border border-gray-200 px-3 py-4 text-center font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
                  STT
                </th>
                <th
                  v-for="column in report.columns"
                  :key="column.ma"
                  class="border border-gray-200 px-3 py-4 text-center font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200"
                >
                  {{ column.ten }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-200 px-3 py-4 text-center font-medium text-gray-800 dark:border-gray-700 dark:text-white/90">
                  {{ report.stt }}
                </td>
                <td
                  v-for="column in report.columns"
                  :key="`value-${column.ma}`"
                  class="border border-gray-200 px-3 py-4 text-center text-lg font-semibold text-brand-600 dark:border-gray-700 dark:text-brand-400"
                >
                  {{ column.count }}
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
import { onMounted, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { reportService } from '@/services/reportService'
import { useAuthStore } from '@/stores/auth'
import type { SummaryReport } from '@/types/status'

const auth = useAuthStore()
const loading = ref(true)
const exporting = ref(false)
const report = ref<SummaryReport | null>(null)

const formatDate = (value: string) => new Date(value).toLocaleString('vi-VN')

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
  loading.value = true
  try {
    report.value = await reportService.getSummary()
  } finally {
    loading.value = false
  }
}

const handleExport = async () => {
  exporting.value = true
  try {
    const blob = await reportService.exportSummary()
    downloadBlob(blob, `bao-cao-tong-hop_${new Date().toISOString().slice(0, 10)}.xlsx`)
  } catch {
    alert('Xuất báo cáo thất bại.')
  } finally {
    exporting.value = false
  }
}

onMounted(loadReport)
</script>
