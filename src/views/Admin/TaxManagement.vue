<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard v-if="activeTab === 'companies'" title="Danh sách doanh nghiệp đóng thuế">
        <ImportLoadingSkeleton
          v-if="showCompanyBackgroundSkeleton"
          class="mb-4"
          title="Đang import doanh nghiệp đóng thuế..."
          subtitle="Job đang chạy nền, bạn có thể tiếp tục thao tác và chờ thông báo hoàn tất."
        />
        <div class="mb-4 flex justify-end">
          <div class="relative" ref="importDropdownRef">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium dark:border-gray-700" @click="showImportMenu = !showImportMenu">
              Nhập
            </button>
            <div v-if="showImportMenu" class="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow dark:border-gray-700 dark:bg-gray-900">
              <button type="button" class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="openImportModal">
                Import Excel
              </button>
              <button type="button" class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="openTaxPaymentHistoryModal">
                Lịch sử đóng thuế
              </button>
              <button type="button" class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="openHistoryModal">
                Lịch sử import
              </button>
            </div>
          </div>
        </div>

        <div class="mb-4 flex gap-2">
          <input
            v-model="companySearch"
            type="search"
            placeholder="Tìm mã số thuế / tên doanh nghiệp..."
            class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
            @keyup.enter="loadCompanies(1)"
          />
          <button type="button" class="h-10 rounded-lg bg-brand-500 px-4 text-sm text-white" @click="loadCompanies(1)">Tìm</button>
        </div>

        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[760px] w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">MST</th>
                <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Tên doanh nghiệp</th>
                <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Đơn vị thuế</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in companyRows" :key="item.id">
                <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">{{ item.taxCode || '-' }}</td>
                <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">{{ item.companyName }}</td>
                <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">
                  <select
                    class="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900"
                    :value="item.taxUnitId ?? ''"
                    @change="updateCompanyTax(item.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="">Chưa gán</option>
                    <option v-for="unit in taxUnitOptions" :key="unit.id" :value="unit.id">
                      {{ unit.unitCode }} - {{ unit.unitName }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr v-if="companyRows.length === 0">
                <td colspan="3" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Không có dữ liệu.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ComponentCard v-else title="Danh sách đơn vị thuế">
        <ImportLoadingSkeleton
          v-if="showTaxUnitBackgroundSkeleton"
          class="mb-4"
          title="Đang import đơn vị thuế..."
          subtitle="Job đang chạy nền, bạn có thể tiếp tục thao tác và chờ thông báo hoàn tất."
        />
        <form class="mb-4 rounded-xl border border-gray-200 bg-gray-50/60 p-3 dark:border-gray-700 dark:bg-gray-800/40" @submit.prevent="saveTaxUnit">
          <div class="grid grid-cols-1 gap-2 xl:grid-cols-12">
            <input
              v-model.trim="taxUnitForm.unitCode"
              placeholder="ID đơn vị thuế"
              class="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 xl:col-span-3"
            />
            <input
              v-model.trim="taxUnitForm.unitName"
              placeholder="Tên đơn vị thuế"
              class="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 xl:col-span-4"
            />
            <div class="flex gap-2 xl:col-span-2">
              <button type="submit" class="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white">
              {{ editingTaxUnitId ? 'Cập nhật' : 'Thêm' }}
              </button>
              <button
                v-if="editingTaxUnitId"
                type="button"
                class="h-9 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700"
                @click="resetTaxUnitForm"
              >
                Hủy
              </button>
            </div>
            <div class="flex gap-2 xl:col-span-2">
              <input
                v-model="taxUnitSearch"
                type="search"
                placeholder="Tìm mã/tên..."
                class="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                @keyup.enter="loadTaxUnits(1)"
              />
              <button type="button" class="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white" @click="loadTaxUnits(1)">Tìm</button>
            </div>
            <div class="relative xl:col-span-1" ref="importDropdownRef">
              <button
                type="button"
                class="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium dark:border-gray-700 dark:bg-gray-900"
                @click="showImportMenu = !showImportMenu"
              >
                Nhập
              </button>
              <div
                v-if="showImportMenu"
                class="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow dark:border-gray-700 dark:bg-gray-900"
              >
                <button
                  type="button"
                  class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click="openImportModal"
                >
                  Import Excel
                </button>
                <button
                  type="button"
                  class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click="openHistoryModal"
                >
                  Lịch sử import
                </button>
              </div>
            </div>
          </div>
        </form>

        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[640px] w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">ID đơn vị thuế</th>
                <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Tên đơn vị thuế</th>
                <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="unit in taxUnits" :key="unit.id">
                <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">{{ unit.unitCode }}</td>
                <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">{{ unit.unitName }}</td>
                <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">
                  <div class="flex gap-2">
                    <button type="button" class="text-brand-600 hover:underline" @click="editTaxUnit(unit)">Sửa</button>
                    <button type="button" class="text-red-600 hover:underline" @click="removeTaxUnit(unit.id)">Xóa</button>
                  </div>
                </td>
              </tr>
              <tr v-if="taxUnits.length === 0">
                <td colspan="3" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Không có dữ liệu.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <p>
            Trang {{ taxUnitMeta.currentPage }} / {{ taxUnitMeta.lastPage }}
            <span class="ml-2">Tổng: {{ taxUnitMeta.total }}</span>
          </p>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
              :disabled="taxUnitMeta.currentPage <= 1"
              @click="loadTaxUnits(taxUnitMeta.currentPage - 1)"
            >
              Trước
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
              :disabled="taxUnitMeta.currentPage >= taxUnitMeta.lastPage"
              @click="loadTaxUnits(taxUnitMeta.currentPage + 1)"
            >
              Sau
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>

    <Modal v-if="showImportModal" @close="closeImportModal">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
          <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Import Excel</h3>
          <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {{ activeTab === 'companies' ? 'Import doanh nghiệp đóng thuế' : 'Import đơn vị thuế' }}
          </p>
          <ImportLoadingSkeleton
            v-if="showImportDispatchingSkeleton"
            :title="activeTab === 'companies' ? 'Đang khởi tạo import doanh nghiệp...' : 'Đang khởi tạo import đơn vị thuế...'"
            subtitle="Đang đưa file vào hàng đợi xử lý."
          />
          <div v-if="showImportDispatchingSkeleton" class="mt-4 flex justify-end">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700" @click="closeImportModal">
              Đóng
            </button>
          </div>
          <template v-else>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div class="md:col-span-2">
                <input type="file" accept=".xlsx,.xls,.csv" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" @change="onImportFileChange" />
              </div>
              <div>
                <input v-model.number="activeImportStartRow" type="number" min="1" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
              </div>
            </div>
            <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div v-for="(label, key) in activeImportLabels" :key="`import-${key}`" class="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                <p class="mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">{{ label }}</p>
                <input v-model="activeImportInputs[key]" type="text" class="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900" placeholder="VD: A" />
              </div>
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700" @click="closeImportModal">Hủy</button>
              <button type="button" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" :disabled="!activeImportFile" @click="submitImport">
                Thực hiện import
              </button>
            </div>
          </template>
        </div>
      </template>
    </Modal>

    <Modal v-if="showHistoryModal" @close="showHistoryModal = false">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
          <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Lịch sử import</h3>
          <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">Các lần import gần đây của module Thuế.</p>
          <div v-if="importHistory.length === 0" class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
            Chưa có lịch sử import.
          </div>
          <div v-else class="space-y-2">
            <div v-for="item in importHistory" :key="item.id" class="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
              <p class="font-medium text-gray-900 dark:text-white">{{ item.label }}</p>
              <p class="mt-1 text-gray-600 dark:text-gray-300">
                Tạo mới: {{ item.result.created }}, cập nhật: {{ item.result.updated }}, bỏ qua: {{ item.result.skipped ?? 0 }}, dòng đọc: {{ item.result.rows }}.
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ item.createdAt }}</p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
    <Modal v-if="showTaxPaymentHistoryModal" @close="showTaxPaymentHistoryModal = false">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
          <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Lịch sử đóng thuế doanh nghiệp</h3>
          <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">Chỉnh sửa ngày đóng thuế và lưu trực tiếp theo từng doanh nghiệp.</p>
          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table class="min-w-[960px] w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">MST</th>
                  <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Tên doanh nghiệp</th>
                  <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Đơn vị thuế</th>
                  <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Ngày đóng thuế</th>
                  <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Người import</th>
                  <th class="border border-gray-200 px-3 py-2 text-left dark:border-gray-700">Lưu</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in taxPaymentHistoryRows" :key="item.id">
                  <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">{{ item.taxCode || '-' }}</td>
                  <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">{{ item.companyName }}</td>
                  <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">{{ item.taxUnit ? `${item.taxUnit.unitCode} - ${item.taxUnit.unitName}` : '-' }}</td>
                  <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">
                    <input
                      v-model="taxPaidDateEdits[item.id]"
                      type="date"
                      class="h-9 rounded border border-gray-300 px-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                    />
                  </td>
                  <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">{{ item.importedBy?.name || '-' }}</td>
                  <td class="border border-gray-200 px-3 py-2 dark:border-gray-700">
                    <button
                      type="button"
                      class="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                      :disabled="!item.taxUnitId"
                      @click="saveTaxPaidDate(item)"
                    >
                      Lưu ngày
                    </button>
                  </td>
                </tr>
                <tr v-if="taxPaymentHistoryRows.length === 0">
                  <td colspan="6" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                    Chưa có dữ liệu đóng thuế.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import Modal from '@/components/profile/Modal.vue'
import { taxManagementService } from '@/services/taxManagementService'
import { useImportNotifications } from '@/composables/useImportNotifications'
import { columnsToDisplay, parseColumnInput } from '@/utils/excelColumns'
import type { TaxCompanyItem, TaxImportColumnMap, TaxImportResult, TaxUnit } from '@/types/taxManagement'

type TabKey = 'companies' | 'tax-units'

const route = useRoute()

const resolveTabFromQuery = (value: unknown): TabKey => {
  const tab = String(value ?? 'companies')
  return tab === 'tax-units' ? 'tax-units' : 'companies'
}

const activeTab = ref<TabKey>(resolveTabFromQuery(route.query.tab))
const companyRows = ref<TaxCompanyItem[]>([])
const companySearch = ref('')
const taxUnits = ref<TaxUnit[]>([])
const taxUnitMeta = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 20,
})
const taxUnitOptions = ref<TaxUnit[]>([])
const taxUnitSearch = ref('')
const editingTaxUnitId = ref<number | null>(null)
const taxUnitForm = reactive({
  unitCode: '',
  unitName: '',
})
const taxUnitImportStartRow = ref(2)
const taxUnitImportColumnLabels = ref<Record<string, string>>({})
const taxUnitImportColumnInputs = ref<Record<string, string>>({})
const selectedTaxUnitImportFile = ref<File | null>(null)
const taxUnitImportResult = ref<TaxImportResult | null>(null)
const companyImportStartRow = ref(2)
const companyImportColumnLabels = ref<Record<string, string>>({})
const companyImportColumnInputs = ref<Record<string, string>>({})
const selectedCompanyImportFile = ref<File | null>(null)
const companyImportResult = ref<TaxImportResult | null>(null)
const showImportMenu = ref(false)
const showImportModal = ref(false)
const showHistoryModal = ref(false)
const showTaxPaymentHistoryModal = ref(false)
const importDropdownRef = ref<HTMLElement | null>(null)
const importHistory = ref<Array<{ id: string; label: string; result: TaxImportResult; createdAt: string }>>([])
const taxPaymentHistoryRows = ref<TaxCompanyItem[]>([])
const taxPaidDateEdits = reactive<Record<number, string>>({})
const taxUnitImportDispatching = ref(false)
const companyImportDispatching = ref(false)
const activeBackgroundImportEntity = ref<'tax-unit' | 'company-tax' | null>(null)
const { trackImportJob, onImportCompleted, onImportFailed } = useImportNotifications()
const importUnsubscribers: Array<() => void> = []
const showImportDispatchingSkeleton = computed(() => taxUnitImportDispatching.value || companyImportDispatching.value)
const showTaxUnitBackgroundSkeleton = computed(
  () => activeTab.value === 'tax-units' && activeBackgroundImportEntity.value === 'tax-unit',
)
const showCompanyBackgroundSkeleton = computed(
  () => activeTab.value === 'companies' && activeBackgroundImportEntity.value === 'company-tax',
)

const applyImportColumnMap = (
  labelsRef: { value: Record<string, string> },
  inputsRef: { value: Record<string, string> },
  columnMap: TaxImportColumnMap,
  labels?: Record<string, string>,
) => {
  if (labels) {
    labelsRef.value = { ...labels }
  }
  const nextInputs: Record<string, string> = {}
  for (const [key, label] of Object.entries(labelsRef.value)) {
    const mapped = columnMap[key] ?? []
    nextInputs[key] = columnsToDisplay(mapped)
    if (!label) {
      labelsRef.value[key] = key
    }
  }
  inputsRef.value = nextInputs
}

const buildImportColumnMap = (inputs: Record<string, string>): TaxImportColumnMap => {
  const map: TaxImportColumnMap = {}
  for (const [key, input] of Object.entries(inputs)) {
    const parsed = parseColumnInput(input)
    if (parsed.length > 0) {
      map[key] = parsed
    }
  }
  return map
}

const loadImportConfigs = async () => {
  const [taxUnitCfg, companyCfg] = await Promise.all([
    taxManagementService.getTaxUnitImportColumnMap(),
    taxManagementService.getCompanyTaxImportColumnMap(),
  ])

  taxUnitImportStartRow.value = taxUnitCfg.startRow
  companyImportStartRow.value = companyCfg.startRow

  applyImportColumnMap(taxUnitImportColumnLabels, taxUnitImportColumnInputs, taxUnitCfg.columnMap, taxUnitCfg.columnLabels)
  applyImportColumnMap(companyImportColumnLabels, companyImportColumnInputs, companyCfg.columnMap, companyCfg.columnLabels)
}

const activeImportLabels = computed(() =>
  activeTab.value === 'companies' ? companyImportColumnLabels.value : taxUnitImportColumnLabels.value,
)

const activeImportInputs = computed(() =>
  activeTab.value === 'companies' ? companyImportColumnInputs.value : taxUnitImportColumnInputs.value,
)

const activeImportStartRow = computed({
  get: () => (activeTab.value === 'companies' ? companyImportStartRow.value : taxUnitImportStartRow.value),
  set: (value: number) => {
    if (activeTab.value === 'companies') {
      companyImportStartRow.value = value
    } else {
      taxUnitImportStartRow.value = value
    }
  },
})

const activeImportFile = computed(() =>
  activeTab.value === 'companies' ? selectedCompanyImportFile.value : selectedTaxUnitImportFile.value,
)

const loadCompanies = async (page = 1) => {
  const response = await taxManagementService.getCompanyTaxList({
    page,
    perPage: 100,
    search: companySearch.value.trim() || undefined,
  })
  companyRows.value = response.data
}

const loadTaxPaymentHistory = async () => {
  const response = await taxManagementService.getCompanyTaxList({
    page: 1,
    perPage: 300,
  })
  taxPaymentHistoryRows.value = response.data.filter((item) => !!item.taxUnitId)
  for (const item of taxPaymentHistoryRows.value) {
    taxPaidDateEdits[item.id] = item.taxPaidAt ?? ''
  }
}

const loadTaxUnits = async (page = 1) => {
  const response = await taxManagementService.getTaxUnits({
    page,
    perPage: taxUnitMeta.perPage,
    search: taxUnitSearch.value.trim() || undefined,
  })
  taxUnits.value = response.data
  taxUnitMeta.currentPage = response.meta?.current_page ?? page
  taxUnitMeta.lastPage = response.meta?.last_page ?? 1
  taxUnitMeta.total = response.meta?.total ?? response.data.length
  taxUnitMeta.perPage = response.meta?.per_page ?? taxUnitMeta.perPage
}

const loadTaxUnitOptions = async () => {
  const response = await taxManagementService.getTaxUnits({ page: 1, perPage: 500 })
  taxUnitOptions.value = response.data
}

const updateCompanyTax = async (doanhNghiepId: number, rawTaxUnitId: string) => {
  const taxUnitId = rawTaxUnitId ? Number(rawTaxUnitId) : null
  await taxManagementService.updateCompanyTaxUnit({ doanhNghiepId, taxUnitId })
  await loadCompanies()
}

const saveTaxPaidDate = async (item: TaxCompanyItem) => {
  if (!item.taxUnitId) return

  await taxManagementService.updateCompanyTaxUnit({
    doanhNghiepId: item.id,
    taxUnitId: item.taxUnitId,
    taxPaidAt: taxPaidDateEdits[item.id] || null,
  })

  await Promise.all([loadCompanies(), loadTaxPaymentHistory()])
}

const resetTaxUnitForm = () => {
  editingTaxUnitId.value = null
  taxUnitForm.unitCode = ''
  taxUnitForm.unitName = ''
}

const editTaxUnit = (item: TaxUnit) => {
  editingTaxUnitId.value = item.id
  taxUnitForm.unitCode = item.unitCode
  taxUnitForm.unitName = item.unitName
}

const saveTaxUnit = async () => {
  if (!taxUnitForm.unitCode || !taxUnitForm.unitName) return

  if (editingTaxUnitId.value) {
    await taxManagementService.updateTaxUnit(editingTaxUnitId.value, {
      unitCode: taxUnitForm.unitCode,
      unitName: taxUnitForm.unitName,
    })
  } else {
    await taxManagementService.createTaxUnit({
      unitCode: taxUnitForm.unitCode,
      unitName: taxUnitForm.unitName,
    })
  }

  resetTaxUnitForm()
  await Promise.all([loadTaxUnits(), loadTaxUnitOptions()])
}

const removeTaxUnit = async (id: number) => {
  if (!confirm('Xóa đơn vị thuế này?')) return
  await taxManagementService.deleteTaxUnit(id)
  await Promise.all([loadTaxUnits(), loadTaxUnitOptions()])
}

const onTaxUnitImportFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedTaxUnitImportFile.value = input.files?.[0] ?? null
}

const onCompanyImportFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedCompanyImportFile.value = input.files?.[0] ?? null
}

const onImportFileChange = (event: Event) => {
  if (activeTab.value === 'companies') {
    onCompanyImportFileChange(event)
  } else {
    onTaxUnitImportFileChange(event)
  }
}

const importTaxUnitExcel = async () => {
  if (!selectedTaxUnitImportFile.value) return
  taxUnitImportDispatching.value = true
  try {
    const dispatchResult = await taxManagementService.importTaxUnitsFromExcel(selectedTaxUnitImportFile.value, {
      startRow: taxUnitImportStartRow.value,
      columnMap: buildImportColumnMap(taxUnitImportColumnInputs.value),
    })
    trackImportJob(dispatchResult.importJobId)
    activeBackgroundImportEntity.value = 'tax-unit'
    closeImportModal()
  } finally {
    taxUnitImportDispatching.value = false
  }
}

const importCompanyTaxExcel = async () => {
  if (!selectedCompanyImportFile.value) return
  companyImportDispatching.value = true
  try {
    const dispatchResult = await taxManagementService.importCompanyTaxFromExcel(selectedCompanyImportFile.value, {
      startRow: companyImportStartRow.value,
      columnMap: buildImportColumnMap(companyImportColumnInputs.value),
    })
    trackImportJob(dispatchResult.importJobId)
    activeBackgroundImportEntity.value = 'company-tax'
    closeImportModal()
  } finally {
    companyImportDispatching.value = false
  }
}

const pushImportHistory = (label: string, result: TaxImportResult) => {
  importHistory.value.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    result,
    createdAt: new Date().toLocaleString('vi-VN'),
  })
}

const submitImport = async () => {
  if (activeTab.value === 'companies') {
    await importCompanyTaxExcel()
  } else {
    await importTaxUnitExcel()
  }
}

const openImportModal = () => {
  showImportMenu.value = false
  showImportModal.value = true
}

const closeImportModal = () => {
  showImportModal.value = false
}

const openHistoryModal = () => {
  showImportMenu.value = false
  showHistoryModal.value = true
}

const openTaxPaymentHistoryModal = async () => {
  showImportMenu.value = false
  await loadTaxPaymentHistory()
  showTaxPaymentHistoryModal.value = true
}

const handleClickOutside = (event: MouseEvent) => {
  if (importDropdownRef.value && !importDropdownRef.value.contains(event.target as Node)) {
    showImportMenu.value = false
  }
}

onMounted(async () => {
  importUnsubscribers.push(
    onImportCompleted(async (payload) => {
      const result = payload.result
      if (payload.entity === 'tax-unit' && result) {
        taxUnitImportResult.value = {
          created: result.imported ?? 0,
          updated: result.updated ?? result.duplicates ?? 0,
          skipped: (result as { skipped?: number }).skipped ?? ((result.duplicates ?? 0) + (result.failed ?? 0)),
          rows: (result as { rows?: number }).rows ?? 0,
        }
        pushImportHistory('Import đơn vị thuế', taxUnitImportResult.value)
        selectedTaxUnitImportFile.value = null
        activeBackgroundImportEntity.value = null

        await Promise.all([loadTaxUnits(), loadTaxUnitOptions()])
        return
      }

      if (payload.entity === 'company-tax' && result) {
        companyImportResult.value = {
          created: result.imported ?? 0,
          updated: result.updated ?? result.duplicates ?? 0,
          skipped: (result as { skipped?: number }).skipped ?? (result.failed ?? 0),
          rows: (result as { rows?: number }).rows ?? 0,
        }
        pushImportHistory('Import doanh nghiệp đóng thuế', companyImportResult.value)
        selectedCompanyImportFile.value = null
        activeBackgroundImportEntity.value = null

        await loadCompanies()
      }
    }),
  )

  importUnsubscribers.push(
    onImportFailed((payload) => {
      if (payload.entity === 'tax-unit') {
        taxUnitImportResult.value = null
        taxUnitImportDispatching.value = false
        activeBackgroundImportEntity.value = null
        return
      }

      if (payload.entity === 'company-tax') {
        companyImportResult.value = null
        companyImportDispatching.value = false
        activeBackgroundImportEntity.value = null
      }
    }),
  )

  await Promise.all([loadCompanies(), loadTaxUnits(), loadTaxUnitOptions(), loadImportConfigs()])
  document.addEventListener('click', handleClickOutside)
})

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = resolveTabFromQuery(tab)
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  importUnsubscribers.forEach((unsubscribe) => unsubscribe())
})
</script>
