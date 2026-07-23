<template>
  <div>
    <div v-if="!embedded" class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Lịch sử import hợp tác xã</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Theo dõi các lần import thành công, trùng lặp và thất bại.</p>
      </div>
      <button
        v-if="showClose"
        type="button"
        class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="emit('close')"
      >
        <span class="sr-only">Đóng</span>
        ✕
      </button>
    </div>

    <div v-if="loadError" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
      {{ loadError }}
    </div>

    <div v-if="loadingJobs">
      <TableSkeleton :rows="5" :columns="4" compact />
    </div>

    <div v-else-if="jobs.length === 0" class="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
      <p class="text-sm text-gray-500 dark:text-gray-400">Chưa có lịch sử import.</p>
    </div>

    <div v-else class="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div class="max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          v-for="job in jobs"
          :key="job.id"
          type="button"
          class="flex w-full flex-col gap-1 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 dark:border-gray-800"
          :class="selectedJobId === job.id ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'"
          @click="selectJob(job.id)"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="truncate text-sm font-medium text-gray-900 dark:text-white">{{ job.originalFilename || `Import #${job.id}` }}</span>
            <span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium" :class="statusBadgeClass(job.status)">{{ statusLabel(job.status) }}</span>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(job.createdAt) }}</span>
          <span v-if="job.importedBy" class="text-xs text-gray-500 dark:text-gray-400">
            Người import: {{ job.importedBy.name }}
          </span>
          <span v-if="job.donVi" class="text-xs text-gray-500 dark:text-gray-400">
            Đơn vị: {{ job.donVi.ten }}
          </span>
          <span class="text-xs text-gray-600 dark:text-gray-300">{{ jobSummary(job).imported }} mới · {{ jobSummary(job).duplicates }} trùng · {{ jobSummary(job).failed }} lỗi</span>
        </button>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-700">
        <div v-if="!selectedJobId" class="flex h-full min-h-[320px] items-center justify-center p-6 text-sm text-gray-500 dark:text-gray-400">
          Chọn một lần import để xem chi tiết.
        </div>
        <div v-else>
          <div class="flex flex-wrap items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <button
              v-for="tab in rowTabs"
              :key="tab.value"
              type="button"
              class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
              :class="activeStatus === tab.value ? tab.activeClass : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
              @click="changeStatus(tab.value)"
            >
              {{ tab.label }}
              <span v-if="tab.count !== null" class="ml-1 opacity-80">({{ tab.count }})</span>
            </button>
          </div>

          <div v-if="loadingRows" class="px-4 py-4">
            <TableSkeleton :rows="8" :columns="4" compact />
          </div>
          <div v-else-if="rowsError" class="px-4 py-10 text-center text-sm text-red-600 dark:text-red-400">{{ rowsError }}</div>
          <div v-else-if="rows.length === 0" class="py-10 text-center text-sm text-gray-500 dark:text-gray-400">Không có bản ghi {{ activeStatusLabel.toLowerCase() }}.</div>
          <div v-else class="max-h-[58vh] overflow-y-auto">
            <table class="min-w-full text-sm">
              <thead class="sticky top-0 bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th class="px-4 py-3">Dòng</th>
                  <th class="px-4 py-3">Mã số thuế</th>
                  <th class="px-4 py-3">Tên HTX</th>
                  <th class="px-4 py-3">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rows" :key="row.id" class="border-t border-gray-100 dark:border-gray-800">
                  <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ row.rowNumber }}</td>
                  <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ row.maSoThue || '—' }}</td>
                  <td class="px-4 py-3 text-gray-900 dark:text-white">{{ row.tenHtx || '—' }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ row.message || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TableSkeleton from '@/components/common/TableSkeleton.vue'
import { cooperativeService } from '@/services/cooperativeService'
import type {
  CooperativeImportJobListItem,
  CooperativeImportJobRow,
  CooperativeImportRowStatus,
  CooperativeListMeta,
} from '@/types/cooperative'

withDefaults(
  defineProps<{
    embedded?: boolean
    showClose?: boolean
  }>(),
  {
    embedded: false,
    showClose: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

const loadingJobs = ref(false)
const loadingRows = ref(false)
const loadError = ref<string | null>(null)
const rowsError = ref<string | null>(null)
const jobs = ref<CooperativeImportJobListItem[]>([])
const selectedJobId = ref<number | null>(null)
const selectedJob = ref<CooperativeImportJobListItem | null>(null)
const rows = ref<CooperativeImportJobRow[]>([])
const rowsMeta = ref<CooperativeListMeta | null>(null)
const activeStatus = ref<CooperativeImportRowStatus>('success')

const rowTabs = computed(() => {
  const counts = (selectedJob.value as CooperativeImportJobListItem & { rowCounts?: { success: number; duplicate: number; failed: number } })?.rowCounts
  return [
    { value: 'success' as const, label: 'Thành công', count: counts?.success ?? selectedJob.value?.summary?.imported ?? null, activeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' },
    { value: 'duplicate' as const, label: 'Trùng', count: counts?.duplicate ?? selectedJob.value?.summary?.duplicates ?? null, activeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' },
    { value: 'failed' as const, label: 'Thất bại', count: counts?.failed ?? selectedJob.value?.summary?.failed ?? null, activeClass: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' },
  ]
})

const activeStatusLabel = computed(() => rowTabs.value.find((tab) => tab.value === activeStatus.value)?.label ?? '')

function statusLabel(status: string) {
  if (status === 'completed') return 'Hoàn tất'
  if (status === 'processing') return 'Đang xử lý'
  if (status === 'failed') return 'Thất bại'
  return 'Chờ xử lý'
}

function statusBadgeClass(status: string) {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
  if (status === 'processing') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
  if (status === 'failed') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('vi-VN')
}

function jobSummary(job: CooperativeImportJobListItem) {
  return job.summary ?? { imported: job.result?.imported ?? 0, duplicates: job.result?.duplicates ?? job.result?.updated ?? 0, failed: job.result?.failed ?? 0 }
}

async function loadJobs() {
  loadingJobs.value = true
  loadError.value = null
  try {
    const response = await cooperativeService.getImportJobs(1, 50)
    jobs.value = response.data
    if (jobs.value.length > 0 && !selectedJobId.value) await selectJob(jobs.value[0].id)
  } catch (err: unknown) {
    jobs.value = []
    const axiosErr = err as { response?: { data?: { message?: string } } }
    loadError.value = axiosErr.response?.data?.message ?? 'Không tải được lịch sử import.'
  } finally {
    loadingJobs.value = false
  }
}

async function selectJob(jobId: number) {
  selectedJobId.value = jobId
  activeStatus.value = 'success'
  loadingRows.value = true
  rows.value = []
  try {
    const detail = await cooperativeService.getImportJobStatus(jobId)
    selectedJob.value = {
      ...detail,
      summary: detail.summary ?? { imported: detail.result?.imported ?? 0, duplicates: detail.result?.duplicates ?? detail.result?.updated ?? 0, failed: detail.result?.failed ?? 0 },
    }
    await loadRows(1)
  } catch {
    selectedJob.value = jobs.value.find((job) => job.id === jobId) ?? null
    rows.value = []
  } finally {
    loadingRows.value = false
  }
}

async function loadRows(page: number) {
  if (!selectedJobId.value) return
  loadingRows.value = true
  rowsError.value = null
  try {
    const response = await cooperativeService.getImportJobRows(selectedJobId.value, { page, perPage: 50, status: activeStatus.value })
    rows.value = response.data
    rowsMeta.value = response.meta
  } catch (err: unknown) {
    rows.value = []
    rowsMeta.value = null
    const axiosErr = err as { response?: { data?: { message?: string } } }
    rowsError.value = axiosErr.response?.data?.message ?? 'Không tải được chi tiết import.'
  } finally {
    loadingRows.value = false
  }
}

function changeStatus(status: CooperativeImportRowStatus) {
  activeStatus.value = status
  void loadRows(1)
}

function resetAndLoad() {
  selectedJobId.value = null
  selectedJob.value = null
  rows.value = []
  rowsMeta.value = null
  void loadJobs()
}

onMounted(() => {
  void loadJobs()
})

defineExpose({ resetAndLoad })
</script>
