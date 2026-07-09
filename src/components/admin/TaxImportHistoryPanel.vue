<template>
  <div>
    <div v-if="!hideTypeFilter" class="mb-4">
      <label class="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Lọc lịch sử import
      </label>
      <select
        v-model="importHistoryType"
        class="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        @change="loadImportHistory()"
      >
        <option value="tax_units">Import đơn vị thuế</option>
        <option value="company_tax">Import doanh nghiệp đóng thuế</option>
      </select>
    </div>

    <div v-if="importHistoryLoading" class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
      Đang tải lịch sử import...
    </div>
    <div v-else-if="importHistory.length === 0" class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
      Chưa có lịch sử import.
    </div>
    <div v-else class="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div class="max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          v-for="item in importHistory"
          :key="item.id"
          type="button"
          class="flex w-full flex-col gap-1 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 dark:border-gray-800"
          :class="selectedImportHistoryId === item.id ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'"
          @click="selectImportHistory(item.id)"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="truncate text-sm font-medium text-gray-900 dark:text-white">{{ item.originalFilename || `Import #${item.id}` }}</span>
            <span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium" :class="statusBadgeClass(item.status)">
              {{ statusLabel(item.status) }}
            </span>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatHistoryDate(item.createdAt) }}</span>
          <span v-if="item.importedBy" class="text-xs text-gray-500 dark:text-gray-400">
            Người import: {{ item.importedBy.name }}
          </span>
          <span v-if="item.donVi" class="text-xs text-gray-500 dark:text-gray-400">
            Đơn vị: {{ item.donVi.ten }}
          </span>
          <span class="text-xs text-gray-600 dark:text-gray-300">
            {{ item.summary.imported }} mới · {{ item.summary.duplicates }} trùng · {{ item.summary.failed }} lỗi
          </span>
        </button>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-700">
        <div v-if="!selectedImportHistoryId" class="flex h-full min-h-[320px] items-center justify-center p-6 text-sm text-gray-500 dark:text-gray-400">
          Chọn một lần import để xem chi tiết.
        </div>
        <div v-else>
          <div class="flex flex-wrap items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <button
              v-for="tab in importHistoryTabs"
              :key="tab.key"
              type="button"
              class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
              :class="activeImportHistoryTab === tab.key ? tab.activeClass : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
              @click="changeImportHistoryTab(tab.key)"
            >
              {{ tab.label }}
              <span class="ml-1 opacity-80">({{ tab.count }})</span>
            </button>
          </div>

          <div v-if="importHistoryRowsLoading" class="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Đang tải chi tiết...
          </div>
          <div v-else-if="importHistoryRowsError" class="px-4 py-10 text-center text-sm text-red-600 dark:text-red-400">
            {{ importHistoryRowsError }}
          </div>
          <div v-else-if="importHistoryRows.length === 0" class="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            {{ importHistoryEmptyLabel }}
          </div>
          <div v-else class="max-h-[58vh] overflow-y-auto">
            <table class="min-w-full text-sm">
              <thead class="sticky top-0 bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th class="px-4 py-3">Dòng</th>
                  <th class="px-4 py-3">MST</th>
                  <th class="px-4 py-3">Tên doanh nghiệp</th>
                  <th class="px-4 py-3">ID đơn vị thuế</th>
                  <th class="px-4 py-3">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in importHistoryRows" :key="row.id" class="border-t border-gray-100 dark:border-gray-800">
                  <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ row.rowNumber }}</td>
                  <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ row.maSoDoanhNghiep || '—' }}</td>
                  <td class="px-4 py-3 text-gray-900 dark:text-white">{{ row.tenDoanhNghiep || '—' }}</td>
                  <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ row.taxUnitCode || '—' }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <div>{{ row.message || '—' }}</div>
                    <div v-if="formatMappedValues(row)" class="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {{ formatMappedValues(row) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="importHistoryRowsMeta && importHistoryRowsMeta.last_page > 1"
            class="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm dark:border-gray-700"
          >
            <span class="text-gray-500 dark:text-gray-400">
              Trang {{ importHistoryRowsMeta.current_page }} / {{ importHistoryRowsMeta.last_page }}
            </span>
            <div class="flex gap-2">
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50 dark:border-gray-700"
                :disabled="importHistoryRowsMeta.current_page <= 1"
                @click="loadImportHistoryRows(importHistoryRowsMeta.current_page - 1)"
              >
                Trước
              </button>
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50 dark:border-gray-700"
                :disabled="importHistoryRowsMeta.current_page >= importHistoryRowsMeta.last_page"
                @click="loadImportHistoryRows(importHistoryRowsMeta.current_page + 1)"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { taxManagementService } from '@/services/taxManagementService'
import type { TaxImportJobHistoryItem, TaxImportJobRow } from '@/types/taxManagement'

const props = withDefaults(
  defineProps<{
    fixedType?: 'tax_units' | 'company_tax'
    hideTypeFilter?: boolean
  }>(),
  {
    hideTypeFilter: false,
  },
)

const formatMappedValues = (row: TaxImportJobRow) => {
  if (!row.mappedValues || Object.keys(row.mappedValues).length === 0) return ''
  return Object.entries(row.mappedValues)
    .map(([key, value]) => `${key}: ${String(value ?? '')}`)
    .join(' · ')
}

const importHistory = ref<TaxImportJobHistoryItem[]>([])
const importHistoryType = ref<'tax_units' | 'company_tax'>(props.fixedType ?? 'tax_units')
const importHistoryLoading = ref(false)
const selectedImportHistoryId = ref<number | null>(null)
const activeImportHistoryTab = ref<'success' | 'duplicate' | 'failed'>('success')
const importHistoryRows = ref<TaxImportJobRow[]>([])
const importHistoryRowsMeta = ref<{ current_page: number; last_page: number } | null>(null)
const importHistoryRowsLoading = ref(false)
const importHistoryRowsError = ref<string | null>(null)

const selectedImportHistory = computed(() =>
  importHistory.value.find((item) => item.id === selectedImportHistoryId.value) ?? importHistory.value[0] ?? null,
)

const importHistoryTabs = computed(() => {
  const summary = selectedImportHistory.value?.summary ?? { imported: 0, duplicates: 0, failed: 0 }
  return [
    {
      key: 'success' as const,
      label: 'Thành công',
      count: summary.imported,
      activeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    },
    {
      key: 'duplicate' as const,
      label: 'Trùng',
      count: summary.duplicates,
      activeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    },
    {
      key: 'failed' as const,
      label: 'Thất bại',
      count: summary.failed,
      activeClass: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    },
  ]
})

const importHistoryEmptyLabel = computed(() => {
  if (activeImportHistoryTab.value === 'success') return 'Không có bản ghi thành công.'
  if (activeImportHistoryTab.value === 'duplicate') return 'Không có bản ghi trùng/cập nhật.'
  return 'Không có bản ghi thất bại.'
})

const formatHistoryDate = (value?: string | null) => (value ? new Date(value).toLocaleString('vi-VN') : '—')

const statusLabel = (status: TaxImportJobHistoryItem['status']) => {
  if (status === 'completed') return 'Hoàn tất'
  if (status === 'processing') return 'Đang xử lý'
  if (status === 'failed') return 'Thất bại'
  return 'Chờ xử lý'
}

const statusBadgeClass = (status: TaxImportJobHistoryItem['status']) => {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
  if (status === 'processing') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
  if (status === 'failed') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

const loadImportHistory = async () => {
  importHistoryLoading.value = true
  try {
    const response = await taxManagementService.getImportJobs({
      type: props.fixedType ?? importHistoryType.value,
      page: 1,
      perPage: 50,
    })
    importHistory.value = response.data
    if (importHistory.value.length > 0) {
      await selectImportHistory(importHistory.value[0].id)
    } else {
      selectedImportHistoryId.value = null
      importHistoryRows.value = []
      importHistoryRowsMeta.value = null
    }
  } finally {
    importHistoryLoading.value = false
  }
}

const selectImportHistory = async (jobId: number) => {
  selectedImportHistoryId.value = jobId
  activeImportHistoryTab.value = 'success'
  await loadImportHistoryRows(1)
}

const loadImportHistoryRows = async (page = 1) => {
  if (!selectedImportHistoryId.value) return

  importHistoryRowsLoading.value = true
  importHistoryRowsError.value = null
  try {
    const response = await taxManagementService.getImportJobRows(selectedImportHistoryId.value, {
      page,
      perPage: 50,
      status: activeImportHistoryTab.value,
    })
    importHistoryRows.value = response.data
    importHistoryRowsMeta.value = response.meta
      ? { current_page: response.meta.current_page ?? 1, last_page: response.meta.last_page ?? 1 }
      : null
  } catch (err: unknown) {
    importHistoryRows.value = []
    importHistoryRowsMeta.value = null
    const axiosErr = err as { response?: { data?: { message?: string } } }
    importHistoryRowsError.value = axiosErr.response?.data?.message ?? 'Không tải được chi tiết import.'
  } finally {
    importHistoryRowsLoading.value = false
  }
}

const changeImportHistoryTab = (tab: 'success' | 'duplicate' | 'failed') => {
  activeImportHistoryTab.value = tab
  void loadImportHistoryRows(1)
}

onMounted(() => {
  void loadImportHistory()
})
</script>
