<template>
  <div class="space-y-4">
    <div v-if="showHeader" class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
          Import doanh nghiệp đóng thuế
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload file Excel để cập nhật danh sách doanh nghiệp đóng thuế. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất.
        </p>
      </div>
      <button
        v-if="showClose"
        type="button"
        class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        @click="emit('close')"
      >
        <span class="sr-only">Đóng</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <ImportLoadingSkeleton
      v-if="dispatching"
      title="Đang khởi tạo import doanh nghiệp đóng thuế..."
      subtitle="Đang đưa file vào hàng đợi xử lý."
    />

    <template v-else>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="md:col-span-2">
          <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">File Excel</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
            @change="onFileChange"
          />
          <p v-if="selectedFile" class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ selectedFile.name }}</p>
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Hàng bắt đầu</label>
          <input
            v-model.number="startRow"
            type="number"
            min="1"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="md:col-span-2">
          <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Ngày cập nhật</label>
          <input
            v-model="taxPaidAt"
            type="date"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div
          v-for="(label, key) in columnLabels"
          :key="key"
          class="rounded-lg border border-gray-200 p-2 dark:border-gray-700"
        >
          <p class="mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">{{ label }}</p>
          <input
            v-model="columnInputs[key]"
            type="text"
            class="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900"
            placeholder="VD: A"
          />
        </div>
      </div>

      <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {{ error }}
      </div>

      <div
        v-if="showActions"
        class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end"
      >
        <button
          v-if="showClose"
          type="button"
          class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:w-auto"
          @click="emit('close')"
        >
          Hủy
        </button>
        <button
          type="button"
          class="inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 sm:w-auto"
          :disabled="!selectedFile || dispatching"
          @click="handleImport"
        >
          Thực hiện import
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import { useImportNotifications } from '@/composables/useImportNotifications'
import { taxManagementService } from '@/services/taxManagementService'
import type { TaxImportColumnMap } from '@/types/taxManagement'
import { columnsToDisplay, parseColumnInput } from '@/utils/excelColumns'

const props = withDefaults(
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
  imported: []
}>()

const { trackImportJob } = useImportNotifications()

const dispatching = ref(false)
const selectedFile = ref<File | null>(null)
const startRow = ref(4)
const taxPaidAt = ref(new Date().toISOString().slice(0, 10))
const columnLabels = ref<Record<string, string>>({})
const columnInputs = ref<Record<string, string>>({})
const error = ref<string | null>(null)

function buildColumnMap(): TaxImportColumnMap {
  const map: TaxImportColumnMap = {}
  for (const [key, input] of Object.entries(columnInputs.value)) {
    const parsed = parseColumnInput(input)
    if (parsed.length > 0) map[key] = parsed
  }
  return map
}

function applyColumnMap(columnMap: TaxImportColumnMap, labels?: Record<string, string>) {
  if (labels) columnLabels.value = { ...labels }
  const nextInputs: Record<string, string> = {}
  for (const [key, label] of Object.entries(columnLabels.value)) {
    nextInputs[key] = key in columnMap ? columnsToDisplay(columnMap[key]) : ''
    if (!label) columnLabels.value[key] = key
  }
  columnInputs.value = nextInputs
}

async function loadColumnMapDefaults() {
  try {
    const config = await taxManagementService.getCompanyTaxImportColumnMap()
    startRow.value = config.startRow
    applyColumnMap(config.columnMap, config.columnLabels)
  } catch {
    applyColumnMap({ taxUnitCode: ['B'], taxCode: ['D'] }, {
      taxUnitCode: 'ID đơn vị thuế',
      taxCode: 'Mã số thuế (MST)',
    })
    startRow.value = 4
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
  error.value = null
}

async function handleImport() {
  if (!selectedFile.value) return

  dispatching.value = true
  error.value = null

  try {
    const dispatchResult = await taxManagementService.importCompanyTaxFromExcel(selectedFile.value, {
      startRow: startRow.value,
      columnMap: buildColumnMap(),
      taxPaidAt: taxPaidAt.value || new Date().toISOString().slice(0, 10),
    })
    trackImportJob(dispatchResult.importJobId)
    selectedFile.value = null
    emit('imported')
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Import thất bại.'
  } finally {
    dispatching.value = false
  }
}

async function initialize() {
  selectedFile.value = null
  error.value = null
  taxPaidAt.value = new Date().toISOString().slice(0, 10)
  await loadColumnMapDefaults()
}

onMounted(() => {
  void initialize()
})

defineExpose({ initialize })
</script>
