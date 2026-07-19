<template>
  <div class="space-y-4">
    <div v-if="showHeader">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
        Cập nhật field từ Excel
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Đối chiếu doanh nghiệp theo field an toàn, ánh xạ các cột cần cập nhật. Ô Excel trống được bỏ qua.
        Không tạo doanh nghiệp mới.
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-4">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Hàng bắt đầu đọc dữ liệu
        </label>
        <input
          v-model.number="startRow"
          type="number"
          min="1"
          max="1000"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div class="grid gap-3 sm:grid-cols-[1fr_120px]">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Field đối chiếu
          </label>
          <select
            v-model="lookupField"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            @change="onLookupFieldChange"
          >
            <option
              v-for="(label, key) in lookupFields"
              :key="key"
              :value="key"
            >
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

      <div>
        <div class="mb-2 flex items-center justify-between gap-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Field cần cập nhật
          </label>
          <button
            type="button"
            class="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            @click="addUpdateMapping"
          >
            + Thêm field
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(row, index) in updateMappings"
            :key="row.id"
            class="grid grid-cols-[1fr_100px_36px] gap-2 items-center"
          >
            <select
              v-model="row.field"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">— Chọn field —</option>
              <option
                v-for="(label, key) in availableUpdateFieldsFor(row.field)"
                :key="key"
                :value="key"
              >
                {{ label }}
              </option>
            </select>
            <input
              v-model="row.column"
              type="text"
              placeholder="B"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
              :disabled="updateMappings.length <= 1"
              title="Xóa"
              @click="removeUpdateMapping(index)"
            >
              ×
            </button>
          </div>
        </div>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Mặc định: cột A = Mã số doanh nghiệp, cột B = Phường/Xã cũ. Ô trống giữ nguyên giá trị hiện tại.
        </p>
      </div>
    </div>

    <div
      class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900/40"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls,.csv"
        class="hidden"
        @change="onFileSelected"
      />
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Chọn file Excel chứa cột đối chiếu và các cột cần cập nhật.
      </p>
      <button
        type="button"
        class="mt-3 inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
        @click="fileInput?.click()"
      >
        Chọn file
      </button>
      <p v-if="selectedFile" class="mt-3 text-sm text-gray-700 dark:text-gray-300">
        {{ selectedFile.name }}
      </p>
    </div>

    <ImportLoadingSkeleton
      v-if="importing && !importResult"
      :subtitle="queuedMessage"
    />

    <div
      v-if="importResult"
      class="rounded-lg border p-4 text-sm dark:border-gray-700"
      :class="importResult.failed > 0 ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20'"
    >
      <p class="font-medium text-gray-800 dark:text-gray-200">
        {{ importResult.updated }} cập nhật · {{ importResult.skipped ?? 0 }} bỏ qua · {{ importResult.failed }} lỗi
      </p>
      <ul v-if="importResult.errors.length" class="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
        <li v-for="(err, idx) in importResult.errors.slice(0, 10)" :key="idx">
          Dòng {{ err.row }}: {{ err.message }}
        </li>
        <li v-if="importResult.errors.length > 10" class="text-gray-500">
          ... và {{ importResult.errors.length - 10 }} lỗi khác
        </li>
      </ul>
    </div>

    <div
      v-if="importError"
      class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400 whitespace-pre-line"
    >
      {{ importError }}
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        :disabled="!selectedFile || importing || !canSubmit"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        @click="handleSubmit"
      >
        {{ submitLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import { useImportNotifications } from '@/composables/useImportNotifications'
import { companyService } from '@/services/companyService'
import type { CompanyImportResult, CompanyFieldUpdateConfig } from '@/types/company'
import { formatImportUploadError } from '@/utils/apiError'
import { parseColumnInput } from '@/utils/excelColumns'

withDefaults(
  defineProps<{
    showHeader?: boolean
  }>(),
  {
    showHeader: true,
  },
)

interface UpdateMappingRow {
  id: number
  field: string
  column: string
}

let mappingIdSeq = 1

const startRow = ref(2)
const lookupField = ref('maSoDoanhNghiep')
const lookupColumn = ref('A')
const lookupFields = ref<Record<string, string>>({
  maSoDoanhNghiep: 'Mã số doanh nghiệp',
  tenDoanhNghiep: 'Tên doanh nghiệp',
  dienThoai: 'Điện thoại',
})
const updateFields = ref<Record<string, string>>({
  phuongXaCu: 'Phường / Xã cũ',
})
const updateMappings = ref<UpdateMappingRow[]>([
  { id: mappingIdSeq++, field: 'phuongXaCu', column: 'B' },
])

const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const importing = ref(false)
const queuedMessage = ref<string | null>(null)
const activeImportJobId = ref<number | null>(null)
const importResult = ref<CompanyImportResult | null>(null)
const importError = ref<string | null>(null)
let importPollTimer: ReturnType<typeof setInterval> | null = null

const {
  trackImportJob,
  clearImportJob,
  onImportCompleted,
  onImportFailed,
} = useImportNotifications()

const canSubmit = computed(() => {
  if (!lookupField.value || !parseColumnInput(lookupColumn.value).length) return false
  const validUpdates = updateMappings.value.filter(
    (row) => row.field && parseColumnInput(row.column).length > 0,
  )
  return validUpdates.length > 0
})

const submitLabel = computed(() => {
  if (!importing.value) return 'Cập nhật từ Excel'
  if (activeImportJobId.value) return 'Đang xử lý nền...'
  return 'Đang gửi...'
})

function availableUpdateFieldsFor(currentField: string): Record<string, string> {
  const used = new Set(
    updateMappings.value
      .map((row) => row.field)
      .filter((field) => field && field !== currentField),
  )
  if (lookupField.value) {
    used.add(lookupField.value)
  }

  const result: Record<string, string> = {}
  for (const [key, label] of Object.entries(updateFields.value)) {
    if (!used.has(key) || key === currentField) {
      result[key] = label
    }
  }
  return result
}

function onLookupFieldChange() {
  for (const row of updateMappings.value) {
    if (row.field === lookupField.value) {
      row.field = ''
    }
  }
}

function addUpdateMapping() {
  updateMappings.value.push({ id: mappingIdSeq++, field: '', column: '' })
}

function removeUpdateMapping(index: number) {
  if (updateMappings.value.length <= 1) return
  updateMappings.value.splice(index, 1)
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
}

function buildColumnMap(): Record<string, string[]> | null {
  const lookupCols = parseColumnInput(lookupColumn.value)
  if (!lookupField.value || lookupCols.length === 0) {
    return null
  }

  const map: Record<string, string[]> = {
    [lookupField.value]: lookupCols,
  }

  const usedColumns = new Set(lookupCols.map((c) => c.toUpperCase()))
  const usedFields = new Set<string>([lookupField.value])

  for (const row of updateMappings.value) {
    if (!row.field) continue
    const cols = parseColumnInput(row.column)
    if (cols.length === 0) continue
    if (usedFields.has(row.field)) {
      importError.value = `Field "${updateFields.value[row.field] ?? row.field}" bị trùng ánh xạ.`
      return null
    }
    for (const col of cols) {
      const key = col.toUpperCase()
      if (usedColumns.has(key)) {
        importError.value = `Cột Excel ${key} đang được dùng cho nhiều field.`
        return null
      }
      usedColumns.add(key)
    }
    usedFields.add(row.field)
    map[row.field] = cols
  }

  if (Object.keys(map).length < 2) {
    importError.value = 'Cần ánh xạ ít nhất một field cần cập nhật.'
    return null
  }

  return map
}

function stopPolling() {
  if (importPollTimer) {
    clearInterval(importPollTimer)
    importPollTimer = null
  }
}

function finishQueued(result: CompanyImportResult) {
  importing.value = false
  importResult.value = result
  activeImportJobId.value = null
  clearImportJob()
  stopPolling()
}

function finishQueuedFailed(message: string) {
  importing.value = false
  importError.value = message
  activeImportJobId.value = null
  clearImportJob()
  stopPolling()
}

function startPolling(importJobId: number) {
  stopPolling()
  importPollTimer = setInterval(async () => {
    try {
      const status = await companyService.getImportJobStatus(importJobId)
      if (status.status === 'completed' && status.result) {
        finishQueued(status.result)
      } else if (status.status === 'failed') {
        finishQueuedFailed(status.errorMessage ?? 'Cập nhật field thất bại.')
      }
    } catch {
      // keep polling; socket may still deliver result
    }
  }, 2500)
}

async function loadDefaults() {
  try {
    const config: CompanyFieldUpdateConfig = await companyService.getFieldUpdateColumnMap()
    startRow.value = config.startRow || 2
    lookupField.value = config.lookupField || 'maSoDoanhNghiep'
    lookupFields.value = config.lookupFields || lookupFields.value
    updateFields.value = config.updateFields || updateFields.value

    const lookupCols = config.columnMap?.[lookupField.value] ?? ['A']
    lookupColumn.value = lookupCols.join(',')

    const firstUpdateKey = Object.keys(config.columnMap || {}).find(
      (key) => key !== lookupField.value && config.updateFields?.[key],
    ) || 'phuongXaCu'
    const firstUpdateCols = config.columnMap?.[firstUpdateKey] ?? ['B']
    updateMappings.value = [
      {
        id: mappingIdSeq++,
        field: firstUpdateKey,
        column: firstUpdateCols.join(','),
      },
    ]
  } catch {
    // keep local defaults
  }
}

async function handleSubmit() {
  if (!selectedFile.value) return

  importError.value = null
  importResult.value = null

  const columnMap = buildColumnMap()
  if (!columnMap) return

  importing.value = true
  queuedMessage.value = null

  try {
    const queued = await companyService.importFieldUpdatesExcel(selectedFile.value, {
      startRow: startRow.value,
      lookupField: lookupField.value,
      columnMap,
    })
    activeImportJobId.value = queued.importJobId
    trackImportJob(queued.importJobId)
    queuedMessage.value = `File "${queued.originalFilename ?? selectedFile.value.name}" đã được đưa vào hàng đợi.`
    startPolling(queued.importJobId)
  } catch (err) {
    importing.value = false
    activeImportJobId.value = null
    clearImportJob()
    importError.value = formatImportUploadError(err, 'Cập nhật field từ Excel thất bại.')
  }
}

onMounted(async () => {
  await loadDefaults()
  onImportCompleted((payload) => {
    if (payload.importJobId && payload.importJobId === activeImportJobId.value && payload.result) {
      finishQueued(payload.result as CompanyImportResult)
    }
  })
  onImportFailed((payload) => {
    if (payload.importJobId && payload.importJobId === activeImportJobId.value) {
      finishQueuedFailed(payload.message ?? 'Cập nhật field thất bại.')
    }
  })
})

onUnmounted(() => {
  stopPolling()
  clearImportJob()
})
</script>
