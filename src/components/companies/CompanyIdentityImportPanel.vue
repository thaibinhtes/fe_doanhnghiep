<template>
  <div class="space-y-4">
    <div v-if="showHeader" class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
          Import định danh
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Chọn field đối chiếu → match Excel → chỉ cập nhật định danh + ngày.
          Không tạo DN mới, không sửa tên / địa chỉ / trạng thái hoạt động.
        </p>
      </div>
      <button
        v-if="showClose"
        type="button"
        class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        @click="emit('close')"
      >
        ✕
      </button>
    </div>

    <div
      class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
    >
      Import định danh <strong>không</strong> ghi đè dữ liệu doanh nghiệp. Chỉ ghi cờ định danh và bảng
      <code class="text-xs">to_chuc_dinh_danhs</code> (mã + thời gian).
    </div>

    <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-4">
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hàng bắt đầu
          </label>
          <input
            v-model.number="startRow"
            type="number"
            min="1"
            max="1000"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Trạng thái áp dụng
          </label>
          <select
            v-model="identityStatus"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="dinh_danh">Định danh</option>
            <option value="chua_dinh_danh">Chưa định danh</option>
          </select>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-[1fr_120px]">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Field đối chiếu (query)
          </label>
          <select
            v-model="lookupField"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option v-for="(label, key) in lookupFields" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cột Excel
          </label>
          <input
            v-model="lookupColumn"
            type="text"
            placeholder="A"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-[1fr_120px]">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cột thời gian định danh
          </label>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Ô trống / không có giá trị → lấy thời gian hiện tại.
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cột Excel
          </label>
          <input
            v-model="dateColumn"
            type="text"
            placeholder="B"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>
    </div>

    <div class="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls,.csv"
        class="hidden"
        @change="onFileSelected"
      />
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        @click="fileInput?.click()"
      >
        Chọn file
      </button>
      <p v-if="selectedFile" class="mt-3 text-sm text-gray-700 dark:text-gray-300">
        {{ selectedFile.name }}
      </p>
      <button
        type="button"
        class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        :disabled="downloadingTemplate"
        @click="downloadTemplate"
      >
        {{ downloadingTemplate ? 'Đang tải mẫu...' : 'Tải file mẫu định danh' }}
      </button>
    </div>

    <ImportLoadingSkeleton v-if="importing && !importResult" :subtitle="queuedMessage" />

    <div
      v-if="importResult"
      class="rounded-lg border p-4 text-sm dark:border-gray-700"
      :class="importResult.failed > 0 ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20'"
    >
      <p class="font-medium text-gray-800 dark:text-gray-200">
        {{ importResult.updated }} cập nhật định danh · {{ importResult.failed }} lỗi
      </p>
      <ul v-if="importResult.errors.length" class="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
        <li v-for="(err, idx) in importResult.errors.slice(0, 10)" :key="idx">
          Dòng {{ err.row }}: {{ err.message }}
        </li>
      </ul>
    </div>

    <div
      v-if="importError"
      class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400 whitespace-pre-line"
    >
      {{ importError }}
    </div>

    <div
      v-if="showActions"
      class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end"
    >
      <button
        v-if="showClose"
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        @click="emit('close')"
      >
        Đóng
      </button>
      <button
        type="button"
        :disabled="!canSubmit || importing"
        class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        @click="handleImport"
      >
        {{ importing ? 'Đang xử lý...' : 'Import định danh' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import { useImportNotifications } from '@/composables/useImportNotifications'
import { companyService } from '@/services/companyService'
import type { CompanyImportColumnMap, CompanyImportResult } from '@/types/company'
import { formatImportUploadError } from '@/utils/apiError'
import { parseColumnInput, columnsToDisplay } from '@/utils/excelColumns'

withDefaults(
  defineProps<{
    showHeader?: boolean
    showClose?: boolean
    showActions?: boolean
  }>(),
  {
    showHeader: true,
    showClose: false,
    showActions: true,
  },
)

const emit = defineEmits<{
  close: []
  imported: [result: CompanyImportResult]
}>()

const startRow = ref(2)
const lookupField = ref('maSoDoanhNghiep')
const lookupColumn = ref('A')
const dateColumn = ref('B')
const identityStatus = ref<'dinh_danh' | 'chua_dinh_danh'>('dinh_danh')
const lookupFields = ref<Record<string, string>>({
  maSoDoanhNghiep: 'Mã số doanh nghiệp',
  tenDoanhNghiep: 'Tên doanh nghiệp',
})

const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const importing = ref(false)
const importError = ref<string | null>(null)
const importResult = ref<CompanyImportResult | null>(null)
const queuedMessage = ref<string | null>(null)
const activeImportJobId = ref<number | null>(null)
const downloadingTemplate = ref(false)
let pollTimer: ReturnType<typeof setInterval> | null = null

const { trackImportJob, clearImportJob, onImportCompleted, onImportFailed } = useImportNotifications()

const canSubmit = computed(() => {
  if (!selectedFile.value) return false
  if (!lookupField.value) return false
  if (!parseColumnInput(lookupColumn.value).length) return false
  return true
})

function buildColumnMap(): CompanyImportColumnMap {
  const map: CompanyImportColumnMap = {
    [lookupField.value]: parseColumnInput(lookupColumn.value),
  }
  const dateCols = parseColumnInput(dateColumn.value)
  if (dateCols.length > 0) {
    map.ngayDinhDanh = dateCols
  }
  return map
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
  importResult.value = null
  importError.value = null
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function finishOk(result: CompanyImportResult) {
  importing.value = false
  queuedMessage.value = null
  activeImportJobId.value = null
  clearImportJob()
  stopPolling()
  importResult.value = result
  emit('imported', result)
}

function finishFail(message: string) {
  importing.value = false
  queuedMessage.value = null
  activeImportJobId.value = null
  clearImportJob()
  stopPolling()
  importError.value = message
}

function startPolling(jobId: number) {
  stopPolling()
  pollTimer = setInterval(async () => {
    try {
      const status = await companyService.getImportJobStatus(jobId)
      if (status.status === 'completed' && status.result) {
        finishOk(status.result)
      } else if (status.status === 'failed') {
        finishFail(status.errorMessage ?? 'Import định danh thất bại.')
      }
    } catch {
      // ignore transient
    }
  }, 4000)
}

async function downloadTemplate() {
  downloadingTemplate.value = true
  try {
    const blob = await companyService.exportIdentityTemplate()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mau-import-dinh-danh.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    importError.value = 'Tải file mẫu thất bại.'
  } finally {
    downloadingTemplate.value = false
  }
}

async function handleImport() {
  if (!selectedFile.value || !canSubmit.value) return

  importing.value = true
  importError.value = null
  importResult.value = null
  queuedMessage.value = null

  try {
    const queued = await companyService.importIdentityExcel(selectedFile.value, {
      startRow: startRow.value,
      lookupField: lookupField.value,
      columnMap: buildColumnMap(),
      daCapNhatDinhDanh: identityStatus.value === 'dinh_danh',
    })
    activeImportJobId.value = queued.importJobId
    trackImportJob(queued.importJobId)
    queuedMessage.value = `Đã đưa vào hàng đợi: ${queued.originalFilename || selectedFile.value.name}`
    startPolling(queued.importJobId)
  } catch (err: unknown) {
    importError.value = formatImportUploadError(err, 'Import định danh thất bại.')
    importing.value = false
    clearImportJob()
    stopPolling()
  }
}

async function initialize() {
  selectedFile.value = null
  importResult.value = null
  importError.value = null
  try {
    const config = await companyService.getIdentityImportColumnMap()
    startRow.value = config.startRow || 2
    lookupField.value = config.lookupField || 'maSoDoanhNghiep'
    lookupFields.value = config.lookupFields || lookupFields.value
    lookupColumn.value = columnsToDisplay(config.columnMap?.[lookupField.value] ?? ['A'])
    dateColumn.value = columnsToDisplay(config.columnMap?.ngayDinhDanh ?? ['B'])
  } catch {
    startRow.value = 2
    lookupField.value = 'maSoDoanhNghiep'
    lookupColumn.value = 'A'
    dateColumn.value = 'B'
  }
}

onMounted(async () => {
  await initialize()
  onImportCompleted((payload) => {
    if (payload.entity === 'hop-tac-xa' || !payload.result) return
    if (activeImportJobId.value && payload.importJobId === activeImportJobId.value) {
      finishOk(payload.result)
    }
  })
  onImportFailed((payload) => {
    if (payload.entity === 'hop-tac-xa') return
    if (activeImportJobId.value && payload.importJobId === activeImportJobId.value) {
      finishFail(payload.message ?? 'Import định danh thất bại.')
    }
  })
})

onUnmounted(() => stopPolling())

defineExpose({ initialize })
</script>
