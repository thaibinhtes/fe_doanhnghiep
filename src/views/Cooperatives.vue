<template>
  <AdminLayout>
    <div class="flex min-h-0 flex-1 flex-col max-lg:flex-none max-lg:overflow-visible lg:overflow-hidden">
      <ComponentCard title="Danh sách hợp tác xã" hide-header className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" bodyClass="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-3" slotClass="flex min-h-0 flex-1 flex-col gap-2">
        <div class="shrink-0 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
          <div class="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div class="grid min-w-0 flex-1 grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-[minmax(180px,1.2fr)_minmax(220px,1fr)] xl:items-center">
              <input v-model="filter.search" type="text" placeholder="Tìm kiếm tên, mã số thuế..." class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              <AdministrativeFilter
                v-model:provinceCode="filterProvinceCode"
                v-model:wardCode="filterWardCode"
                :hide-province="HIDE_PROVINCE_FILTER"
                :default-province-code="DEFAULT_PROVINCE_CODE"
                ward-placeholder="Phường/xã"
                ward-search-placeholder="Tìm phường/xã..."
                compact dense
                @change="handleAdministrativeFilterChange"
              />
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-1.5 xl:justify-end">
              <button type="button" class="inline-flex h-8 items-center rounded-lg border border-gray-300 bg-white px-2.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" @click="resetFilters">Đặt lại</button>
              <button
                v-if="hasUnrestrictedOrgScopeFlag && (auth.hasPermission('feature.cooperatives.delete') || auth.hasPermission('feature.companies.delete'))"
                type="button"
                :disabled="!implicitDonViId || clearingByUnit"
                title="Xóa toàn bộ hợp tác xã theo đơn vị trực thuộc"
                class="inline-flex h-8 items-center rounded-lg border border-red-300 bg-white px-2.5 text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-gray-900 dark:text-red-400"
                @click="openClearByUnitModal"
              >
                Xóa theo đơn vị
              </button>
              <button v-if="canExportCooperatives" type="button" :disabled="exporting" class="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-500 px-2.5 text-xs font-medium text-emerald-600 disabled:opacity-50" @click="handleExport">
                {{ exporting ? 'Đang xuất...' : 'Xuất' }}
              </button>
              <details v-if="canImportCooperatives" class="relative">
                <summary class="inline-flex h-8 list-none cursor-pointer items-center gap-1 rounded-lg border border-amber-500 px-2.5 text-xs font-medium text-amber-600">Nhập</summary>
                <div class="absolute right-0 z-50 mt-1 min-w-[220px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  <button type="button" class="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="openImportModal">Import danh sách</button>
                  <button type="button" class="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="openImportHistory">Lịch sử import</button>
                  <button type="button" class="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="downloadTemplate">Tải mẫu Excel</button>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div v-if="store.error" class="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">{{ store.error }}</div>

        <div class="min-h-0 flex-1 overflow-auto">
          <div v-if="store.loading" class="py-12 text-center text-sm text-gray-500">Đang tải...</div>
          <div v-else-if="store.cooperatives.length === 0" class="py-12 text-center text-sm text-gray-500">Không có hợp tác xã.</div>

          <template v-else>
            <div class="grid gap-3 p-1 lg:hidden">
              <CooperativeMobileCard v-for="(item, index) in store.cooperatives" :key="item.id" :cooperative="item" :index="index" show-actions @delete="confirmDelete" />
            </div>

            <div class="hidden min-w-max lg:block">
            <table class="min-w-full text-sm">
              <thead class="sticky top-0 z-10 bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th class="px-3 py-2">STT</th>
                  <th class="px-3 py-2">Tên HTX</th>
                  <th class="px-3 py-2">Mã số thuế</th>
                  <th class="px-3 py-2">Tình trạng hoạt động</th>
                  <th class="px-3 py-2">Năm TL</th>
                  <th class="px-3 py-2">CT HĐQT</th>
                  <th class="px-3 py-2">Điện thoại</th>
                  <th class="px-3 py-2">Địa chỉ cũ</th>
                  <th class="px-3 py-2">Địa chỉ mới</th>
                  <th class="px-3 py-2">Cấp xã cũ</th>
                  <th class="px-3 py-2">Cấp xã mới</th>
                  <th class="px-3 py-2">Cấp huyện cũ</th>
                  <th class="px-3 py-2">Cấp huyện mới</th>
                  <th class="px-3 py-2">Cấp tỉnh cũ</th>
                  <th class="px-3 py-2">Diện tích</th>
                  <th class="px-3 py-2">Vốn ĐL</th>
                  <th class="px-3 py-2">TV</th>
                  <th class="px-3 py-2">Lao động</th>
                  <th class="px-3 py-2">Lĩnh vực</th>
                  <th class="px-3 py-2">Hoạt động</th>
                  <th class="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in store.cooperatives" :key="item.id" class="border-t border-gray-100 dark:border-gray-800">
                  <td class="px-3 py-2">{{ item.tt ?? '—' }}</td>
                  <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ item.tenHtx }}</td>
                  <td class="px-3 py-2">{{ item.maSoThue || '—' }}</td>
                  <td class="px-3 py-2">
                    <span
                      v-if="item.tinhTrangThue"
                      class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      :class="taxStatusClass(item.tinhTrangThue)"
                    >
                      {{ item.tinhTrangThue }}
                    </span>
                    <span v-else>—</span>
                  </td>
                  <td class="px-3 py-2">{{ item.namThanhLap || '—' }}</td>
                  <td class="px-3 py-2">{{ item.chuTichHdqtTen || '—' }}</td>
                  <td class="px-3 py-2">{{ item.dienThoai || '—' }}</td>
                  <td class="px-3 py-2 max-w-[200px] truncate">{{ item.diaChiCu || item.diaChi || '—' }}</td>
                  <td class="px-3 py-2 max-w-[200px] truncate">{{ item.diaChiMoi || '—' }}</td>
                  <td class="px-3 py-2">{{ item.phuongXaCu || item.phuongXa || '—' }}</td>
                  <td class="px-3 py-2">{{ item.phuongXaMoi || '—' }}</td>
                  <td class="px-3 py-2">{{ item.quanHuyenCu || '—' }}</td>
                  <td class="px-3 py-2">{{ item.quanHuyenMoi || '—' }}</td>
                  <td class="px-3 py-2">{{ item.tinhThanhCu || '—' }}</td>
                  <td class="px-3 py-2">{{ item.dienTichHa ?? '—' }}</td>
                  <td class="px-3 py-2">{{ item.vonDieuLe || '—' }}</td>
                  <td class="px-3 py-2">{{ item.soThanhVien ?? '—' }}</td>
                  <td class="px-3 py-2">{{ item.soNguoiLaoDong ?? '—' }}</td>
                  <td class="px-3 py-2">{{ item.linhVuc || '—' }}</td>
                  <td class="px-3 py-2">{{ item.hoatDong || '—' }}</td>
                  <td class="px-3 py-2">
                    <button type="button" class="text-xs text-red-600 hover:underline" @click="confirmDelete(item)">Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </template>
        </div>

        <div class="shrink-0 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-2 text-sm dark:border-gray-700">
          <div class="flex items-center gap-2">
            <span class="text-gray-500">Hiển thị</span>
            <select v-model.number="pageSize" class="h-8 rounded-lg border border-gray-300 bg-transparent px-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
            <span class="text-gray-500">/ {{ store.total }} bản ghi</span>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="rounded-lg border px-2 py-1 disabled:opacity-50" :disabled="store.page <= 1" @click="store.setPage(store.page - 1)">Trước</button>
            <span class="px-2 text-gray-600 dark:text-gray-300">{{ store.page }} / {{ store.totalPages }}</span>
            <button type="button" class="rounded-lg border px-2 py-1 disabled:opacity-50" :disabled="store.page >= store.totalPages" @click="store.setPage(store.page + 1)">Sau</button>
          </div>
        </div>
      </ComponentCard>
    </div>

    <Modal v-if="showImportModal" @close="closeImportModal">
      <template #body>
        <div class="no-scrollbar relative z-10 w-full max-w-[640px] max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-8">
          <CooperativeImportPanel
            show-close
            @close="closeImportModal"
            @imported="handleImportCompleted"
          />
        </div>
      </template>
    </Modal>

    <ImportHistoryModal :open="showImportHistory" @close="showImportHistory = false" />

    <Modal v-if="deleteTarget" @close="deleteTarget = null">
      <template #body>
        <div class="mx-auto w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
          <h3 class="text-lg font-semibold">Xóa hợp tác xã?</h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Bạn có chắc muốn xóa <strong>{{ deleteTarget.tenHtx }}</strong>?</p>
          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="rounded-lg border px-4 py-2 text-sm" @click="deleteTarget = null">Hủy</button>
            <button type="button" class="rounded-lg bg-red-600 px-4 py-2 text-sm text-white" @click="handleDelete">Xóa</button>
          </div>
        </div>
      </template>
    </Modal>

    <Modal v-if="isClearByUnitOpen" @close="closeClearByUnitModal">
      <template #body>
        <div class="mx-auto w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Xóa toàn bộ HTX theo đơn vị</h3>
          <p v-if="clearByUnitPreview" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Đơn vị: <strong>{{ clearByUnitPreview.donViMa }} — {{ clearByUnitPreview.donViTen }}</strong>
            <span v-if="clearByUnitPreview.scopeDonViCount > 1" class="mt-1 block text-xs text-gray-500">
              Bao gồm {{ clearByUnitPreview.scopeDonViCount }} đơn vị (đơn vị chọn + đơn vị con).
            </span>
          </p>
          <p v-if="clearByUnitPreview" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Sẽ xóa <strong class="text-red-600">{{ clearByUnitPreview.count.toLocaleString('vi-VN') }}</strong> hợp tác xã.
          </p>
          <p v-if="clearByUnitError" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ clearByUnitError }}</p>
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">Hành động này không thể hoàn tác.</p>
          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="rounded-lg border px-4 py-2 text-sm" :disabled="clearingByUnit" @click="closeClearByUnitModal">Hủy</button>
            <button
              type="button"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              :disabled="clearingByUnit || !clearByUnitPreview || clearByUnitPreview.count === 0"
              @click="confirmClearByUnit"
            >
              {{ clearingByUnit ? 'Đang xóa...' : 'Xóa toàn bộ' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/profile/Modal.vue'
import AdministrativeFilter from '@/components/filters/AdministrativeFilter.vue'
import CooperativeMobileCard from '@/components/cooperatives/CooperativeMobileCard.vue'
import CooperativeImportPanel from '@/components/cooperatives/CooperativeImportPanel.vue'
import ImportHistoryModal from '@/components/cooperatives/ImportHistoryModal.vue'
import { useCooperativesStore } from '@/stores/cooperatives'
import { useAuthStore } from '@/stores/auth'
import { cooperativeService } from '@/services/cooperativeService'
import { hasUnrestrictedOrgScope } from '@/types/orgUnit'
import { DEFAULT_PROVINCE_CODE, HIDE_PROVINCE_FILTER } from '@/config/hanhChinh'
import type { Cooperative, CooperativeFilters } from '@/types/cooperative'

const store = useCooperativesStore()
const auth = useAuthStore()
const canExportCooperatives = computed(
  () => auth.hasPermission('feature.cooperatives.export') || auth.hasPermission('feature.companies.export'),
)
const canImportCooperatives = computed(
  () => auth.hasPermission('feature.cooperatives.import') || auth.hasPermission('feature.companies.import'),
)
const hasUnrestrictedOrgScopeFlag = computed(() => hasUnrestrictedOrgScope(auth.user))
const implicitDonViId = computed(() => auth.user?.donViId ?? null)

const pageSizeOptions = [15, 25, 50, 100, 200, 300, 400, 500]
const pageSize = computed({
  get: () => store.perPage,
  set: (value: number) => store.setPerPage(value),
})

const filter = reactive({ search: '', phuongXa: '' })
const filterProvinceCode = ref(DEFAULT_PROVINCE_CODE)
const filterWardCode = ref('')
const exporting = ref(false)

const showImportModal = ref(false)
const showImportHistory = ref(false)

const deleteTarget = ref<Cooperative | null>(null)
const isClearByUnitOpen = ref(false)
const clearingByUnit = ref(false)
const clearByUnitPreview = ref<{
  donViId: number
  donViMa?: string
  donViTen?: string
  scopeDonViCount: number
  count: number
} | null>(null)
const clearByUnitError = ref<string | null>(null)

const taxStatusClass = (status?: string | null) => {
  if (status === 'Đang hoạt động') {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }
  if (status === 'Ngừng hoạt động' || status === 'Không hoạt động') {
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }

  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

function currentFilters(): CooperativeFilters {
  return {
    page: store.page,
    per_page: store.perPage,
    search: filter.search || undefined,
    phuongXa: filter.phuongXa || undefined,
  }
}

function handleAdministrativeFilterChange(payload: { provinceName: string; wardName: string }) {
  filter.phuongXa = payload.wardName
}

function resetFilters() {
  filter.search = ''
  filter.phuongXa = ''
  filterWardCode.value = ''
  filterProvinceCode.value = DEFAULT_PROVINCE_CODE
  store.setPage(1)
}

async function handleExport() {
  exporting.value = true
  try {
    const blob = await cooperativeService.exportExcel(currentFilters())
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hop-tac-xa_${new Date().toISOString().slice(0, 10)}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  } finally {
    exporting.value = false
  }
}

async function downloadTemplate() {
  try {
    const blob = await cooperativeService.exportTemplate()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'mau-import-hop-tac-xa.xlsx'
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    alert('Tải file mẫu thất bại.')
  }
}

function confirmDelete(item: Cooperative) {
  deleteTarget.value = item
}

async function handleDelete() {
  if (!deleteTarget.value) return
  await store.deleteCooperative(deleteTarget.value.id)
  deleteTarget.value = null
}

async function openClearByUnitModal() {
  const donViId = implicitDonViId.value
  if (!donViId) return

  clearByUnitError.value = null
  clearByUnitPreview.value = null
  isClearByUnitOpen.value = true

  try {
    clearByUnitPreview.value = await cooperativeService.previewClearByDonVi(donViId)
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    clearByUnitError.value = axiosErr.response?.data?.message ?? 'Không tải được thông tin xóa theo đơn vị.'
  }
}

function closeClearByUnitModal() {
  if (clearingByUnit.value) return
  isClearByUnitOpen.value = false
  clearByUnitPreview.value = null
  clearByUnitError.value = null
}

async function confirmClearByUnit() {
  const donViId = implicitDonViId.value
  if (!donViId || !clearByUnitPreview.value) return

  clearingByUnit.value = true
  clearByUnitError.value = null
  try {
    await cooperativeService.clearByDonVi(donViId)
    store.setPage(1)
    await store.fetchCooperatives(currentFilters())
    closeClearByUnitModal()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    clearByUnitError.value = axiosErr.response?.data?.message ?? 'Xóa theo đơn vị thất bại.'
  } finally {
    clearingByUnit.value = false
  }
}

function openImportModal() {
  showImportModal.value = true
}

function closeImportModal() {
  showImportModal.value = false
}

function handleImportCompleted() {
  void store.fetchCooperatives(currentFilters())
}

function openImportHistory() {
  showImportHistory.value = true
}

onMounted(async () => {
  await store.fetchCooperatives(currentFilters())
})

let filterTimer: ReturnType<typeof setTimeout> | null = null
watch([filter, () => store.page, () => store.perPage], () => {
  if (filterTimer) clearTimeout(filterTimer)
  filterTimer = setTimeout(() => {
    void store.fetchCooperatives(currentFilters())
  }, 300)
}, { deep: true })
</script>
