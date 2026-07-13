<template>
  <div class="space-y-4">
    <div
      v-if="showHeader"
      class="flex items-start justify-between gap-4"
    >
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
          Nhập doanh nghiệp từ Excel
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload file Excel từ đơn vị. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất.
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

    <div class="rounded-xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-800/60 dark:bg-brand-950/20">
      <p class="text-sm font-semibold text-gray-900 dark:text-white">Đơn vị import doanh nghiệp</p>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Doanh nghiệp mới sẽ gán vào đơn vị của bạn. Hệ thống kiểm tra trùng trong phạm vi các đơn vị bên dưới.
      </p>

      <div v-if="loadingImportScope" class="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Đang tải thông tin đơn vị...
      </div>

      <div
        v-else-if="!importScopePrimaryUnit"
        class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
      >
        Tài khoản chưa được gán đơn vị. Vui lòng liên hệ quản trị viên.
      </div>

      <div v-else class="mt-3 space-y-3">
        <div class="flex items-start gap-3 rounded-lg border border-white/80 bg-white/80 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900/60">
          <span class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            {{ importScopePrimaryUnit.cap }}
          </span>
          <div class="min-w-0">
            <p class="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-300">
              Đơn vị gán import
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ importScopePrimaryUnit.ma }} — {{ importScopePrimaryUnit.ten }}
            </p>
          </div>
        </div>

        <div v-if="importScopeChildUnits.length > 0">
          <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Đơn vị con trực thuộc ({{ importScopeChildUnits.length }})
          </p>
          <ul class="max-h-36 space-y-2 overflow-y-auto pr-1">
            <li
              v-for="unit in importScopeChildUnits"
              :key="unit.id"
              class="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900/40"
            >
              <span class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {{ unit.cap }}
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ unit.ma }} — {{ unit.ten }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <button
      type="button"
      :disabled="downloadingTemplate"
      class="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400"
      @click="handleDownloadTemplate"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {{ downloadingTemplate ? 'Đang tải mẫu...' : 'Tải file mẫu Excel (hệ thống)' }}
    </button>

    <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Config mẫu (example)
        </label>
        <select
          v-model="selectedImportConfigId"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          @change="applySelectedImportConfig"
        >
          <option :value="''">— Chọn config mẫu —</option>
          <option v-for="config in importExampleConfigs" :key="config.id" :value="config.id">
            {{ config.name }}
          </option>
        </select>
        <p v-if="selectedImportConfigDescription" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ selectedImportConfigDescription }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Format đã lưu (cá nhân)
        </label>
        <div class="flex flex-col gap-2 sm:flex-row">
          <select
            v-model="selectedImportFormatId"
            class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            @change="applySelectedImportFormat"
          >
            <option :value="''">— Chọn format —</option>
            <option v-for="format in importFormats" :key="format.id" :value="format.id">
              {{ format.name }}
            </option>
          </select>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            :disabled="!selectedImportFormatId || deletingImportFormat"
            @click="handleDeleteImportFormat"
          >
            {{ deletingImportFormat ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Tên format mới
          </label>
          <input
            v-model="importFormatName"
            type="text"
            placeholder="VD: Template Sở KHĐT"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          :disabled="!importFormatName.trim() || savingImportFormat"
          @click="handleSaveImportFormat"
        >
          {{ savingImportFormat ? 'Đang lưu...' : 'Lưu format' }}
        </button>
      </div>

      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Hàng bắt đầu đọc dữ liệu
      </label>
      <input
        v-model.number="importStartRow"
        type="number"
        min="1"
        max="1000"
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />
      <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
        Template đơn vị: header hàng 12, dữ liệu từ hàng 13. Đọc liên tục đến khi gặp hàng trống.
      </p>

      <button
        type="button"
        class="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        @click="showImportColumnConfig = !showImportColumnConfig"
      >
        {{ showImportColumnConfig ? 'Ẩn' : 'Cấu hình' }} ánh xạ cột
      </button>

      <div v-if="showImportColumnConfig" class="mt-3 max-h-64 overflow-y-auto space-y-2 pr-1">
        <div
          v-for="(label, key) in importColumnLabels"
          :key="key"
          class="grid grid-cols-[1fr_88px] gap-2 items-center"
        >
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ label }}</span>
          <input
            v-model="importColumnInputs[key]"
            type="text"
            placeholder="—"
            class="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 pt-1 sticky bottom-0 bg-white dark:bg-gray-900">
          Để trống = không map cột. Cột đơn (C), merge (D-G), cột đôi (AA-AB).
        </p>
      </div>

      <button
        type="button"
        class="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        @click="showImportExtensions = !showImportExtensions"
      >
        {{ showImportExtensions ? 'Ẩn' : 'Cấu hình' }} mở rộng xử lý giá trị
      </button>

      <div v-if="showImportExtensions" class="mt-3 space-y-2">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Mặc định giữ nguyên giá trị Excel. Chỉ xử lý khi chọn mở rộng bên dưới.
        </p>
        <div
          v-for="item in availableImportValueExtensions"
          :key="item.field"
          class="grid grid-cols-[1fr_1fr] gap-2 items-center"
        >
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.fieldLabel }}</span>
          <select
            v-model="importValueExtensions[item.field]"
            class="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Không xử lý</option>
            <option
              v-for="ext in item.extensions"
              :key="ext.key"
              :value="ext.key"
            >
              {{ ext.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
      <input
        ref="importFileInput"
        type="file"
        accept=".xlsx,.xls,.csv"
        class="hidden"
        @change="onImportFileSelected"
      />
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Chọn file Excel (.xlsx, .xls, .csv)
      </p>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
        @click="importFileInput?.click()"
      >
        Chọn file
      </button>
      <p v-if="selectedImportFile" class="mt-3 text-sm text-gray-700 dark:text-gray-300">
        {{ selectedImportFile.name }}
      </p>
    </div>

    <ImportLoadingSkeleton
      v-if="importing && !importResult"
      :subtitle="importQueuedMessage"
    />

    <div
      v-if="importResult"
      class="rounded-lg border p-4 text-sm dark:border-gray-700"
      :class="importResult.failed > 0 ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20'"
    >
      <p class="font-medium text-gray-800 dark:text-gray-200">
        {{ importResult.imported }} mới · {{ importResultDuplicates }} trùng · {{ importResult.failed }} lỗi
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

    <div
      v-if="showActions"
      class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end"
    >
      <button
        v-if="showClose"
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        @click="emit('close')"
      >
        Đóng
      </button>
      <button
        type="button"
        :disabled="!selectedImportFile || importing"
        class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        @click="handleImport"
      >
        {{ importSubmitLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import { useImportNotifications } from '@/composables/useImportNotifications'
import { companyService } from '@/services/companyService'
import { orgUnitService } from '@/services/orgUnitService'
import { useAuthStore } from '@/stores/auth'
import type {
  CompanyImportColumnMap,
  CompanyImportExampleConfig,
  CompanyImportFormat,
  CompanyImportResult,
  CompanyImportValueExtensionField,
} from '@/types/company'
import { COMPANY_IMPORT_COLUMN_LABELS } from '@/types/company'
import type { ImportScopeOrgUnit, OrgUnit } from '@/types/orgUnit'
import { hasUnrestrictedOrgScope, resolveImportScopeOrgUnits } from '@/types/orgUnit'
import { formatImportUploadError } from '@/utils/apiError'
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
  imported: [result: CompanyImportResult]
}>()

const auth = useAuthStore()
const orgUnits = ref<OrgUnit[]>([])
const importScopeOrgUnits = ref<ImportScopeOrgUnit[]>([])
const loadingImportScope = ref(false)
const importing = ref(false)
const importQueuedMessage = ref<string | null>(null)
const activeImportJobId = ref<number | null>(null)
let importPollTimer: ReturnType<typeof setInterval> | null = null
const downloadingTemplate = ref(false)
const selectedImportFile = ref<File | null>(null)
const importFileInput = ref<HTMLInputElement | null>(null)
const importResult = ref<CompanyImportResult | null>(null)
const importError = ref<string | null>(null)
const importStartRow = ref(13)
const importColumnInputs = reactive<Record<string, string>>({})
const importColumnLabels = reactive<Record<string, string>>({})
const importValueExtensions = reactive<Record<string, string>>({})
const availableImportValueExtensions = ref<CompanyImportValueExtensionField[]>([])
const showImportColumnConfig = ref(true)
const showImportExtensions = ref(false)
const importFormats = ref<CompanyImportFormat[]>([])
const importExampleConfigs = ref<CompanyImportExampleConfig[]>([])
const selectedImportConfigId = ref<number | ''>('')
const selectedImportFormatId = ref<number | ''>('')
const importFormatName = ref('')
const savingImportFormat = ref(false)
const deletingImportFormat = ref(false)

const {
  trackImportJob,
  clearImportJob,
  onImportCompleted,
  onImportFailed,
} = useImportNotifications()

const importScopePrimaryUnit = computed(() => importScopeOrgUnits.value.find((unit) => unit.isPrimary) ?? null)
const importScopeChildUnits = computed(() => importScopeOrgUnits.value.filter((unit) => !unit.isPrimary))
const importResultDuplicates = computed(() => {
  if (!importResult.value) return 0
  return importResult.value.duplicates ?? importResult.value.updated ?? 0
})
const selectedImportConfigDescription = computed(() => {
  const config = importExampleConfigs.value.find((item) => item.id === selectedImportConfigId.value)
  return config?.description ?? ''
})
const importSubmitLabel = computed(() => {
  if (!importing.value) return 'Nhập dữ liệu'
  if (activeImportJobId.value) return 'Đang xử lý nền...'
  return 'Đang nhập...'
})

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function loadImportScopeOrgUnits() {
  loadingImportScope.value = true
  try {
    const donViId = auth.user?.donViId ?? null
    const donVi = auth.user?.donVi ?? null

    if (!donViId) {
      importScopeOrgUnits.value = resolveImportScopeOrgUnits(null, donVi, orgUnits.value, [], hasUnrestrictedOrgScope(auth.user))
      return
    }

    let directChildren: OrgUnit[] = []
    try {
      const response = await orgUnitService.getList({ parentId: donViId, isActive: true, perPage: 200 })
      directChildren = response.data
    } catch {
      directChildren = []
    }

    importScopeOrgUnits.value = resolveImportScopeOrgUnits(donViId, donVi, orgUnits.value, directChildren, hasUnrestrictedOrgScope(auth.user))
  } finally {
    loadingImportScope.value = false
  }
}

function stopImportPolling() {
  if (importPollTimer) {
    clearInterval(importPollTimer)
    importPollTimer = null
  }
}

function finishQueuedImport(result: CompanyImportResult) {
  importing.value = false
  importQueuedMessage.value = null
  activeImportJobId.value = null
  clearImportJob()
  stopImportPolling()
  importResult.value = result
  emit('imported', result)
}

function finishQueuedImportFailed(message: string) {
  importing.value = false
  importQueuedMessage.value = null
  activeImportJobId.value = null
  clearImportJob()
  stopImportPolling()
  importError.value = message
}

function startImportPolling(importJobId: number) {
  stopImportPolling()
  importPollTimer = setInterval(async () => {
    try {
      const status = await companyService.getImportJobStatus(importJobId)
      if (status.status === 'completed' && status.result) {
        finishQueuedImport(status.result)
      } else if (status.status === 'failed') {
        finishQueuedImportFailed(status.errorMessage ?? 'Import thất bại.')
      }
    } catch {
      // ignore transient polling errors
    }
  }, 4000)
}

function applyImportMapping(options: {
  startRow: number
  columnMap: CompanyImportColumnMap
  valueExtensions?: Record<string, string>
}) {
  importStartRow.value = options.startRow
  applyImportColumnMap(options.columnMap, COMPANY_IMPORT_COLUMN_LABELS)
  resetImportValueExtensions(availableImportValueExtensions.value)
  for (const [field, preset] of Object.entries(options.valueExtensions ?? {})) {
    if (field in importValueExtensions) {
      importValueExtensions[field] = preset
    }
  }
}

function applyImportFormat(format: CompanyImportFormat) {
  applyImportMapping({
    startRow: format.startRow,
    columnMap: format.columnMap,
    valueExtensions: format.valueExtensions,
  })
}

function applyImportExampleConfig(config: CompanyImportExampleConfig) {
  applyImportMapping({
    startRow: config.startRow,
    columnMap: config.columnMap,
    valueExtensions: config.valueExtensions,
  })
}

function applySelectedImportConfig() {
  if (selectedImportConfigId.value === '') return
  const config = importExampleConfigs.value.find((item) => item.id === selectedImportConfigId.value)
  if (config) {
    selectedImportFormatId.value = ''
    importFormatName.value = ''
    applyImportExampleConfig(config)
  }
}

function applySelectedImportFormat() {
  if (selectedImportFormatId.value === '') return
  const format = importFormats.value.find((item) => item.id === selectedImportFormatId.value)
  if (format) {
    selectedImportConfigId.value = ''
    applyImportFormat(format)
    importFormatName.value = format.name
  }
}

async function loadImportExampleConfigs() {
  try {
    importExampleConfigs.value = await companyService.getImportConfigs()
    if (importExampleConfigs.value.length > 0) {
      selectedImportConfigId.value = importExampleConfigs.value[0].id
      applyImportExampleConfig(importExampleConfigs.value[0])
    }
  } catch {
    importExampleConfigs.value = []
  }
}

async function loadImportFormats() {
  try {
    importFormats.value = await companyService.getImportFormats()
  } catch {
    importFormats.value = []
  }
}

async function handleSaveImportFormat() {
  const name = importFormatName.value.trim()
  if (!name) return

  savingImportFormat.value = true
  importError.value = null
  try {
    const saved = await companyService.saveImportFormat({
      name,
      startRow: importStartRow.value,
      columnMap: buildImportColumnMap(),
      valueExtensions: buildImportValueExtensions(),
    })
    await loadImportFormats()
    selectedImportFormatId.value = saved.id
    importFormatName.value = saved.name
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    importError.value = axiosErr.response?.data?.message ?? 'Lưu format thất bại.'
  } finally {
    savingImportFormat.value = false
  }
}

async function handleDeleteImportFormat() {
  if (!selectedImportFormatId.value) return

  deletingImportFormat.value = true
  importError.value = null
  try {
    await companyService.deleteImportFormat(Number(selectedImportFormatId.value))
    selectedImportFormatId.value = ''
    importFormatName.value = ''
    await loadImportFormats()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    importError.value = axiosErr.response?.data?.message ?? 'Xóa format thất bại.'
  } finally {
    deletingImportFormat.value = false
  }
}

function buildImportColumnMap(): CompanyImportColumnMap {
  const map: CompanyImportColumnMap = {}
  for (const [key, input] of Object.entries(importColumnInputs)) {
    const columns = parseColumnInput(input)
    if (columns.length > 0) {
      map[key] = columns
    }
  }
  return map
}

function buildImportValueExtensions(): Record<string, string> {
  const extensions: Record<string, string> = {}
  for (const [field, preset] of Object.entries(importValueExtensions)) {
    if (preset) {
      extensions[field] = preset
    }
  }
  return extensions
}

function resetImportValueExtensions(fields: CompanyImportValueExtensionField[]) {
  Object.keys(importValueExtensions).forEach((key) => delete importValueExtensions[key])
  for (const item of fields) {
    importValueExtensions[item.field] = ''
  }
}

function applyImportColumnMap(columnMap: CompanyImportColumnMap, labels?: Record<string, string>) {
  Object.keys(importColumnInputs).forEach((key) => delete importColumnInputs[key])
  Object.keys(importColumnLabels).forEach((key) => delete importColumnLabels[key])

  const allLabels = labels ?? {}

  for (const [key, label] of Object.entries(allLabels)) {
    importColumnLabels[key] = label
    importColumnInputs[key] = key in columnMap ? columnsToDisplay(columnMap[key]) : ''
  }
}

async function loadImportColumnMapDefaults() {
  try {
    const config = await companyService.getImportColumnMap()
    importStartRow.value = config.startRow
    applyImportColumnMap(config.columnMap, config.columnLabels)
    availableImportValueExtensions.value = config.availableValueExtensions ?? []
    resetImportValueExtensions(availableImportValueExtensions.value)
  } catch {
    availableImportValueExtensions.value = [
      {
        field: 'nganhNgheKDChinh',
        fieldLabel: 'Ngành nghề KD chính',
        extensions: [{ key: 'vsic_code', label: 'Trích mã VSIC (vd: 2391:Mô tả → 2391)' }],
      },
      {
        field: 'nganhNgheKD',
        fieldLabel: 'Ngành nghề KD',
        extensions: [{ key: 'vsic_code_list', label: 'Trích mã VSIC từ danh sách (phân tách , hoặc ;)' }],
      },
    ]
    resetImportValueExtensions(availableImportValueExtensions.value)
    applyImportColumnMap(
      {
        tt: ['B'],
        maSoDoanhNghiep: ['C'],
        tenDoanhNghiep: ['D', 'E', 'F', 'G'],
        quanHuyenCu: ['O', 'P', 'Q'],
        phuongXaCu: ['R', 'S', 'T'],
        diaChiCu: ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
        vonDieuLe: ['U', 'V', 'W'],
        trangThai: ['X', 'Y', 'Z'],
      },
      COMPANY_IMPORT_COLUMN_LABELS,
    )
  }
}

const handleDownloadTemplate = async () => {
  downloadingTemplate.value = true
  try {
    const blob = await companyService.exportTemplate()
    downloadBlob(blob, 'mau-import-doanh-nghiep.xlsx')
  } catch {
    alert('Tải file mẫu thất bại.')
  } finally {
    downloadingTemplate.value = false
  }
}

const onImportFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedImportFile.value = input.files?.[0] ?? null
  importResult.value = null
  importError.value = null
}

const handleImport = async () => {
  if (!selectedImportFile.value) return

  importing.value = true
  importError.value = null
  importResult.value = null
  importQueuedMessage.value = null

  try {
    const queued = await companyService.importExcel(selectedImportFile.value, {
      startRow: importStartRow.value,
      columnMap: buildImportColumnMap(),
      valueExtensions: buildImportValueExtensions(),
    })

    activeImportJobId.value = queued.importJobId
    trackImportJob(queued.importJobId)
    importQueuedMessage.value = `File "${queued.originalFilename ?? selectedImportFile.value.name}" đã được đưa vào hàng đợi.`
    startImportPolling(queued.importJobId)
  } catch (err: unknown) {
    importError.value = formatImportUploadError(err, 'Nhập Excel thất bại.')
    importing.value = false
    activeImportJobId.value = null
    importQueuedMessage.value = null
    clearImportJob()
    stopImportPolling()
  }
}

async function initialize() {
  selectedImportFile.value = null
  importResult.value = null
  importError.value = null
  showImportColumnConfig.value = true
  showImportExtensions.value = false
  selectedImportFormatId.value = ''
  selectedImportConfigId.value = ''
  importFormatName.value = ''
  await loadImportColumnMapDefaults()
  await Promise.all([loadImportExampleConfigs(), loadImportFormats(), loadImportScopeOrgUnits()])
}

onMounted(async () => {
  orgUnits.value = await orgUnitService.getTree()
  await initialize()

  onImportCompleted((payload) => {
    if (payload.entity === 'hop-tac-xa' || !payload.result) return
    if (activeImportJobId.value && payload.importJobId === activeImportJobId.value) {
      finishQueuedImport(payload.result)
    }
  })

  onImportFailed((payload) => {
    if (payload.entity === 'hop-tac-xa') return
    if (activeImportJobId.value && payload.importJobId === activeImportJobId.value) {
      finishQueuedImportFailed(payload.message ?? 'Import thất bại.')
    }
  })
})

onUnmounted(() => {
  stopImportPolling()
})

defineExpose({ initialize })
</script>
