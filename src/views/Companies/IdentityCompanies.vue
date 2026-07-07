<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Định danh công ty">
        <div class="mb-4 flex flex-col gap-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Chọn công ty và cập nhật trạng thái định danh.
          </p>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              v-model="search"
              type="text"
              placeholder="Tìm theo tên công ty hoặc MST..."
              class="dark:bg-dark-900 h-10 w-full lg:w-[200px] rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
            <select
              v-model="dinhDanhStatus"
              class="dark:bg-dark-900 h-10 rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">Tất cả trạng thái định danh</option>
              <option value="true">Đã định danh</option>
              <option value="false">Chưa định danh</option>
            </select>
            <button
              type="button"
              @click="handleSearch"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Tìm kiếm
            </button>
            <button
              type="button"
              @click="handleReset"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Đặt lại
            </button>
            <button
              type="button"
              @click="openImportModal"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Import định danh
            </button>
            <button
              type="button"
              @click="showImportHistoryModal = true"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Lịch sử import định danh
            </button>
          </div>
        </div>

        <div v-if="store.loading" class="py-10 text-center text-sm text-gray-500">Đang tải...</div>
        <div v-else-if="store.error" class="py-10 text-center text-sm text-red-500">{{ store.error }}</div>
        <div v-else-if="store.companies.length === 0" class="py-10 text-center text-sm text-gray-400">
          Chưa có công ty nào
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="company in store.companies"
            :key="company.id"
            class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-w-0">
                <p class="truncate text-base font-semibold text-gray-900 dark:text-white/90">
                  {{ company.tenDoanhNghiep }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  MST: {{ company.maSoDoanhNghiep || '-' }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Người đại diện: {{ company.nguoiDaiDienTen || company.nguoiDaiDien?.fullName || '-' }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Số điện thoại: {{ company.dienThoai || '-' }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 break-words">
                  Địa chỉ: {{ company.diaChi || '-' }}
                </p>
              </div>
              <div class="flex flex-col items-start gap-2 sm:items-end">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    company.daCapNhatDinhDanh
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                  ]"
                >
                  {{ company.daCapNhatDinhDanh ? 'Đã đăng ký định danh' : 'Chưa đăng ký định danh' }}
                </span>
                <button
                  type="button"
                  @click="toggleDinhDanh(company.id, !!company.daCapNhatDinhDanh)"
                  :class="company.daCapNhatDinhDanh ? 'inline-flex h-9 items-center justify-center rounded-lg bg-red-500 px-3 text-sm font-medium text-white transition hover:bg-red-600' : 'inline-flex h-9 items-center justify-center rounded-lg bg-brand-500 px-3 text-sm font-medium text-white transition hover:bg-brand-600' "
                >
                  {{ company.daCapNhatDinhDanh ? 'Huỷ đăng ký định danh' : 'Đăng ký định danh' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>

    <Modal v-if="showImportModal" @close="closeImportModal">
      <template #body>
        <div
          class="no-scrollbar relative z-1 mx-auto w-full max-w-3xl max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6"
        >
          <div class="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Import định danh</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Cấu hình ánh xạ cột và ngày định danh trước khi import.
              </p>
            </div>
            <button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" @click="closeImportModal">✕</button>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Ngày định danh</label>
              <input
                v-model="identityDate"
                type="date"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Hàng bắt đầu</label>
              <input
                v-model.number="importStartRow"
                type="number"
                min="1"
                max="1000"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>

          <div class="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Cấu hình đã lưu</label>
              <select
                v-model="selectedSavedConfigId"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">-- Chọn cấu hình --</option>
                <option v-for="cfg in savedConfigs" :key="cfg.id" :value="cfg.id">{{ cfg.name }}</option>
              </select>
            </div>
            <div class="flex items-end gap-2">
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
                @click="applySelectedSavedConfig"
              >
                Áp dụng
              </button>
              <button
                type="button"
                class="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                :disabled="!selectedSavedConfigId"
                @click="deleteSelectedConfig"
              >
                Xóa
              </button>
            </div>
          </div>

          <div class="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              v-model="newConfigName"
              type="text"
              placeholder="Tên cấu hình"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="button"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              :disabled="!newConfigName.trim()"
              @click="saveCurrentConfig"
            >
              Lưu cấu hình
            </button>
          </div>

          <div class="mt-4 space-y-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-200">Ánh xạ cột</h3>
            <div
              v-for="(label, key) in importColumnLabels"
              :key="key"
              class="grid grid-cols-[1fr_120px] items-center gap-2"
            >
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ label }}</span>
              <input
                v-model="importColumnInputs[key]"
                type="text"
                placeholder="A hoặc A-B"
                class="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>

          <div class="mt-4 rounded-xl border-2 border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
            <input ref="importFileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onImportFileSelected" />
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600" @click="importFileInput?.click()">
              Chọn file
            </button>
            <p v-if="selectedImportFile" class="mt-2 text-sm text-gray-700 dark:text-gray-300">{{ selectedImportFile.name }}</p>
          </div>

          <div v-if="importError" class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ importError }}
          </div>
          <div v-if="importQueuedMessage" class="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {{ importQueuedMessage }}
          </div>
          <div v-if="importResult" class="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Import xong: {{ importResult.updated }} cập nhật, {{ importResult.failed }} lỗi.
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700" @click="closeImportModal">Đóng</button>
            <button
              type="button"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              :disabled="!selectedImportFile || importing"
              @click="handleImportIdentity"
            >
              {{ importing ? 'Đang import...' : 'Import' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <ImportHistoryModal :open="showImportHistoryModal" @close="showImportHistoryModal = false" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/profile/Modal.vue'
import ImportHistoryModal from '@/components/companies/ImportHistoryModal.vue'
import { useCompaniesStore } from '@/stores/companies'
import { companyService } from '@/services/companyService'
import type {
  CompanyIdentityImportConfig,
  CompanyIdentityImportSavedConfig,
  CompanyImportColumnMap,
  CompanyImportResult,
} from '@/types/company'
import { parseColumnInput, columnsToDisplay } from '@/utils/excelColumns'
import { formatImportUploadError } from '@/utils/apiError'

const store = useCompaniesStore()
const search = ref('')
const dinhDanhStatus = ref<'true' | 'false' | ''>('')
const showImportModal = ref(false)
const showImportHistoryModal = ref(false)
const importing = ref(false)
const importError = ref<string | null>(null)
const importResult = ref<CompanyImportResult | null>(null)
const importQueuedMessage = ref<string | null>(null)
const activeImportJobId = ref<number | null>(null)
const importFileInput = ref<HTMLInputElement | null>(null)
const selectedImportFile = ref<File | null>(null)
const importStartRow = ref(2)
const identityDate = ref(new Date().toISOString().slice(0, 10))
const importColumnInputs = reactive<Record<string, string>>({})
const importColumnLabels = reactive<Record<string, string>>({
  maSoDoanhNghiep: 'Mã số doanh nghiệp',
  tenDoanhNghiep: 'Tên doanh nghiệp',
  daCapNhatDinhDanh: 'Định danh',
})
const savedConfigs = ref<CompanyIdentityImportSavedConfig[]>([])
const selectedSavedConfigId = ref('')
const newConfigName = ref('')
let importPollTimer: ReturnType<typeof setInterval> | null = null

const IDENTITY_CONFIG_STORAGE_KEY = 'company_identity_import_configs_v1'

const buildFilters = () => ({
  page: 1,
  per_page: 20,
  ...(search.value.trim() ? { search: search.value.trim() } : {}),
  ...(dinhDanhStatus.value !== '' ? { daCapNhatDinhDanh: dinhDanhStatus.value === 'true' } : {}),
})

const toggleDinhDanh = async (id: number, currentStatus: boolean) => {
  await store.updateCompanyDinhDanh(id, !currentStatus)
}

const handleSearch = async () => {
  await store.fetchCompanies(buildFilters())
}

const handleReset = async () => {
  search.value = ''
  dinhDanhStatus.value = ''
  await store.fetchCompanies({ page: 1, per_page: 20 })
}

const applyImportConfig = (config: CompanyIdentityImportConfig) => {
  importStartRow.value = config.startRow
  Object.keys(importColumnInputs).forEach((key) => delete importColumnInputs[key])
  const labels = config.columnLabels ?? importColumnLabels
  Object.keys(importColumnLabels).forEach((key) => delete importColumnLabels[key])
  Object.entries(labels).forEach(([key, label]) => {
    importColumnLabels[key] = label
    importColumnInputs[key] = key in config.columnMap ? columnsToDisplay(config.columnMap[key]) : ''
  })
}

const loadSavedConfigs = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(IDENTITY_CONFIG_STORAGE_KEY) ?? '[]')
    savedConfigs.value = Array.isArray(parsed) ? parsed : []
  } catch {
    savedConfigs.value = []
  }
}

const persistSavedConfigs = () => {
  localStorage.setItem(IDENTITY_CONFIG_STORAGE_KEY, JSON.stringify(savedConfigs.value))
}

const buildImportColumnMap = (): CompanyImportColumnMap => {
  const map: CompanyImportColumnMap = {}
  for (const [key, input] of Object.entries(importColumnInputs)) {
    const columns = parseColumnInput(input)
    if (columns.length > 0) {
      map[key] = columns
    }
  }
  return map
}

const openImportModal = async () => {
  showImportModal.value = true
  importError.value = null
  importResult.value = null
  selectedImportFile.value = null
  identityDate.value = new Date().toISOString().slice(0, 10)
  loadSavedConfigs()
  try {
    const defaults = await companyService.getIdentityImportColumnMap()
    applyImportConfig(defaults)
  } catch {
    applyImportConfig({
      startRow: 2,
      columnMap: { maSoDoanhNghiep: ['A'], tenDoanhNghiep: ['B'], daCapNhatDinhDanh: ['C'] },
      columnLabels: importColumnLabels,
    })
  }
}

const closeImportModal = () => {
  showImportModal.value = false
  selectedImportFile.value = null
  if (importFileInput.value) importFileInput.value.value = ''
}

const onImportFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedImportFile.value = input.files?.[0] ?? null
}

const saveCurrentConfig = () => {
  const name = newConfigName.value.trim()
  if (!name) return
  const payload: CompanyIdentityImportSavedConfig = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    startRow: importStartRow.value,
    columnMap: buildImportColumnMap(),
    columnLabels: { ...importColumnLabels },
    identityDate: identityDate.value,
    createdAt: new Date().toISOString(),
  }
  savedConfigs.value.unshift(payload)
  persistSavedConfigs()
  selectedSavedConfigId.value = payload.id
  newConfigName.value = ''
}

const applySelectedSavedConfig = () => {
  if (!selectedSavedConfigId.value) return
  const config = savedConfigs.value.find((item) => item.id === selectedSavedConfigId.value)
  if (!config) return
  applyImportConfig(config)
  identityDate.value = config.identityDate || new Date().toISOString().slice(0, 10)
}

const deleteSelectedConfig = () => {
  if (!selectedSavedConfigId.value) return
  savedConfigs.value = savedConfigs.value.filter((item) => item.id !== selectedSavedConfigId.value)
  selectedSavedConfigId.value = ''
  persistSavedConfigs()
}

const handleImportIdentity = async () => {
  if (!selectedImportFile.value) return
  importing.value = true
  importError.value = null
  importResult.value = null
  try {
    const queued = await companyService.importIdentityExcel(selectedImportFile.value, {
      startRow: importStartRow.value,
      columnMap: buildImportColumnMap(),
      identityDate: identityDate.value,
      daCapNhatDinhDanh: true,
    })
    activeImportJobId.value = queued.importJobId
    importQueuedMessage.value = `Đã đưa vào hàng đợi: ${queued.originalFilename || selectedImportFile.value.name}`
    startImportPolling(queued.importJobId)
  } catch (err: unknown) {
    importError.value = formatImportUploadError(err, 'Import định danh thất bại.')
  } finally {
    importing.value = false
  }
}

const stopImportPolling = () => {
  if (importPollTimer) {
    clearInterval(importPollTimer)
    importPollTimer = null
  }
}

const startImportPolling = (importJobId: number) => {
  stopImportPolling()
  importPollTimer = setInterval(async () => {
    try {
      const status = await companyService.getImportJobStatus(importJobId)
      if (status.status === 'completed' && status.result) {
        importResult.value = status.result
        importing.value = false
        activeImportJobId.value = null
        importQueuedMessage.value = null
        stopImportPolling()
    await store.fetchCompanies(buildFilters())
      } else if (status.status === 'failed') {
        importError.value = status.errorMessage ?? 'Import định danh thất bại.'
        importing.value = false
        activeImportJobId.value = null
        importQueuedMessage.value = null
        stopImportPolling()
      }
    } catch {
      // ignore transient polling errors
    }
  }, 4000)
}

const formatDateTime = (value: string) => {
  try {
    return new Date(value).toLocaleString('vi-VN')
  } catch {
    return value
  }
}

onMounted(() => {
  store.fetchCompanies({ page: 1, per_page: 20 })
})
</script>

