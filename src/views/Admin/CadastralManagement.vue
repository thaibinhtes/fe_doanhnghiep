<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Quản lý địa chính" />

    <div class="space-y-5 sm:space-y-6">
      <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-1 dark:border-gray-700">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium transition"
          :class="
            activeTab === tab.key
              ? 'bg-brand-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          "
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tra cứu dữ liệu mới -->
      <ComponentCard v-if="activeTab === 'lookup'" title="Tra cứu mã tỉnh/thành và xã/phường (mới)">
        <div class="mb-5">
          <AdministrativeFilter
            v-model:provinceCode="selectedProvinceCode"
            v-model:wardCode="selectedWardCode"
            province-label="Tỉnh/thành"
            ward-label="Xã/phường"
            province-placeholder="Chọn tỉnh/thành"
            ward-placeholder="Tất cả xã/phường"
            :show-province-code="true"
            @change="handleAdministrativeFilterChange"
          />
        </div>

        <div class="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <p>
            Tỉnh/thành:
            <span class="font-semibold">{{ selectedProvinceLabel || '-' }}</span>
          </p>
          <p>
            Tổng xã/phường:
            <span class="font-semibold">{{ displayedWards.length }}</span>
          </p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-10">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[700px] w-full border-collapse text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Mã</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Tên xã/phường</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Mã tỉnh/thành</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ward in displayedWards" :key="ward.code">
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.code }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.fullName }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.tinhThanhCode }}</td>
              </tr>
              <tr v-if="displayedWards.length === 0">
                <td colspan="3" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Không có dữ liệu xã/phường.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- Import & đồng bộ -->
      <ComponentCard v-else-if="activeTab === 'import'" title="Import dữ liệu & đồng bộ doanh nghiệp">
        <div v-if="!canManage" class="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Bạn chỉ có quyền xem. Cần quyền <strong>feature.cadastral.manage</strong> để import và đồng bộ.
        </div>

        <div v-else class="space-y-6">
          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">1. Import dữ liệu hành chính mới</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Nạp tỉnh/xã mới từ file <code>vn_provinces.json</code>. Nên import trước khi import mapping cũ → mới.
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                :disabled="importing"
                @click="importNewDataset(['91'])"
              >
                Import An Giang (91)
              </button>
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                :disabled="importing"
                @click="importNewDataset()"
              >
                Import toàn bộ dataset
              </button>
            </div>
            <p v-if="newImportResult" class="text-sm text-green-600 dark:text-green-400">
              Đã import mới: {{ newImportResult.provinces ?? 0 }} tỉnh, {{ newImportResult.wards ?? 0 }} xã/phường.
            </p>
          </section>

          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">2. Import dữ liệu cũ + mapping</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Dán JSON theo format bảng mapping (nhiều dòng cũ → một đơn vị mới). Mỗi dòng là một đơn vị hành chính cũ.
            </p>
            <textarea
              v-model="legacyImportJson"
              rows="10"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-xs text-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              placeholder='{"items":[{"groupNo":1,"tinhThanhCu":"An Giang","quanHuyenCu":"Huyện An Phú","xaPhuongCu":"An Phú","loaiCu":"Thị trấn","xaPhuongMoi":"An Phú","loaiMoi":"Xã","tinhThanhMoiCode":"91"}]}'
            />
            <button
              type="button"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              :disabled="importing"
              @click="importLegacy"
            >
              Import dữ liệu cũ & mapping
            </button>
            <p v-if="legacyImportResult" class="text-sm text-green-600 dark:text-green-400">
              Tỉnh: {{ legacyImportResult.provinces ?? 0 }}, huyện: {{ legacyImportResult.districts ?? 0 }}, xã cũ:
              {{ legacyImportResult.wards ?? 0 }}, mapping: {{ legacyImportResult.mappings ?? 0 }}.
            </p>
          </section>

          <section class="space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">3. Đồng bộ doanh nghiệp</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Khớp doanh nghiệp theo quận/huyện + phường/xã cũ, cập nhật sang đơn vị hành chính mới.
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                :disabled="syncing"
                @click="runSync(true)"
              >
                Dry-run (xem trước)
              </button>
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                :disabled="syncing"
                @click="runSync(false)"
              >
                Đồng bộ thực tế
              </button>
            </div>
            <div v-if="syncResult" class="rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/60">
              <p>Khớp: {{ syncResult.matched }} · Cập nhật: {{ syncResult.updated }} · Bỏ qua: {{ syncResult.skipped }}</p>
              <p v-if="syncResult.unmapped.length" class="mt-1 text-amber-700 dark:text-amber-300">
                Chưa map được: {{ syncResult.unmapped.length }} doanh nghiệp
              </p>
            </div>
          </section>

          <p v-if="actionError" class="text-sm text-red-600 dark:text-red-400">{{ actionError }}</p>
        </div>
      </ComponentCard>

      <!-- Mapping -->
      <ComponentCard v-else title="Danh sách mapping cũ → mới">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <input
            v-model="mappingSearch"
            type="search"
            placeholder="Tìm theo tên xã cũ/mới..."
            class="h-9 min-w-[220px] flex-1 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
            @keyup.enter="loadMappings(1)"
          />
          <button
            type="button"
            class="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
            @click="loadMappings(1)"
          >
            Tìm
          </button>
        </div>

        <div v-if="mappingLoading" class="flex items-center justify-center py-10">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[960px] w-full border-collapse text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Nhóm</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Tỉnh/Huyện (cũ)</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Xã/phường cũ</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Xã/phường mới</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Tỉnh mới</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in mappings" :key="item.id">
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.groupNo ?? '-' }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ legacyLocationLabel(item) }}
                </td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ item.xaPhuongCu?.fullName ?? item.xaPhuongCuCode }}
                  <span v-if="item.xaPhuongCu?.unitType" class="text-gray-500">({{ item.xaPhuongCu.unitType }})</span>
                </td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ item.xaPhuongMoi?.fullName ?? item.xaPhuongMoiCode }}
                  <span v-if="item.newUnitType" class="text-gray-500">({{ item.newUnitType }})</span>
                </td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ item.xaPhuongMoi?.tinhThanh?.fullName ?? item.xaPhuongMoi?.tinhThanhCode ?? '-' }}
                </td>
              </tr>
              <tr v-if="mappings.length === 0">
                <td colspan="5" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Chưa có mapping. Import dữ liệu cũ + mapping ở tab Import & đồng bộ.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="mappingTotalPages > 1" class="mt-4 flex items-center justify-end gap-2 text-sm">
          <button
            type="button"
            class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
            :disabled="mappingPage <= 1"
            @click="loadMappings(mappingPage - 1)"
          >
            Trước
          </button>
          <span>{{ mappingPage }} / {{ mappingTotalPages }}</span>
          <button
            type="button"
            class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
            :disabled="mappingPage >= mappingTotalPages"
            @click="loadMappings(mappingPage + 1)"
          >
            Sau
          </button>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import AdministrativeFilter from '@/components/filters/AdministrativeFilter.vue'
import { locationService } from '@/services/locationService'
import { hanhChinhService } from '@/services/hanhChinhService'
import { useAuthStore } from '@/stores/auth'
import type { HanhChinhMappingItem, ImportCounts, SyncResult } from '@/types/hanhChinh'
import type { WardItem } from '@/types/location'

const auth = useAuthStore()
const canManage = computed(() => auth.hasPermission('feature.cadastral.manage'))

const tabs = [
  { key: 'lookup', label: 'Tra cứu (mới)' },
  { key: 'import', label: 'Import & đồng bộ' },
  { key: 'mapping', label: 'Mapping cũ → mới' },
] as const

type TabKey = (typeof tabs)[number]['key']

const activeTab = ref<TabKey>('lookup')

const loading = ref(true)
const wards = ref<WardItem[]>([])
const selectedProvinceCode = ref('')
const selectedWardCode = ref('')
const selectedProvinceName = ref('')

const importing = ref(false)
const syncing = ref(false)
const actionError = ref('')
const legacyImportJson = ref('')
const newImportResult = ref<ImportCounts | null>(null)
const legacyImportResult = ref<ImportCounts | null>(null)
const syncResult = ref<SyncResult | null>(null)

const mappingLoading = ref(false)
const mappings = ref<HanhChinhMappingItem[]>([])
const mappingSearch = ref('')
const mappingPage = ref(1)
const mappingTotalPages = ref(1)

const selectedProvinceLabel = computed(() => {
  return selectedProvinceCode.value && selectedProvinceName.value
    ? `${selectedProvinceCode.value} - ${selectedProvinceName.value}`
    : ''
})

const displayedWards = computed(() => {
  if (!selectedWardCode.value) return wards.value
  return wards.value.filter((ward) => ward.code === selectedWardCode.value)
})

const loadWards = async () => {
  if (!selectedProvinceCode.value) {
    wards.value = []
    return
  }
  wards.value = await locationService.getWardsByProvince(selectedProvinceCode.value)
}

const loadAll = async () => {
  loading.value = true
  try {
    await loadWards()
  } finally {
    loading.value = false
  }
}

const handleAdministrativeFilterChange = (payload: {
  provinceCode: string
  wardCode: string
  provinceName: string
  wardName: string
}) => {
  selectedProvinceName.value = payload.provinceName
}

const importNewDataset = async (provinceCodes?: string[]) => {
  importing.value = true
  actionError.value = ''
  try {
    newImportResult.value = await hanhChinhService.importNewFromDataset(provinceCodes)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Import dữ liệu mới thất bại'
  } finally {
    importing.value = false
  }
}

const importLegacy = async () => {
  importing.value = true
  actionError.value = ''
  try {
    const parsed = JSON.parse(legacyImportJson.value) as { items?: unknown[] }
    if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
      throw new Error('JSON phải có mảng items với ít nhất 1 phần tử')
    }
    legacyImportResult.value = await hanhChinhService.importLegacyWithMappings(parsed.items as never)
    await loadMappings(1)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Import dữ liệu cũ thất bại'
  } finally {
    importing.value = false
  }
}

const runSync = async (dryRun: boolean) => {
  syncing.value = true
  actionError.value = ''
  try {
    syncResult.value = await hanhChinhService.syncCompanies(dryRun)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Đồng bộ thất bại'
  } finally {
    syncing.value = false
  }
}

const legacyLocationLabel = (item: HanhChinhMappingItem) => {
  const tinh = item.xaPhuongCu?.quanHuyen?.tinhThanh?.fullName
  const quan = item.xaPhuongCu?.quanHuyen?.fullName
  return [tinh, quan].filter(Boolean).join(' / ') || '-'
}

const loadMappings = async (page = 1) => {
  mappingLoading.value = true
  try {
    const response = await hanhChinhService.getMappings({
      page,
      perPage: 50,
      search: mappingSearch.value.trim() || undefined,
    })
    mappings.value = response.data
    mappingPage.value = response.meta?.current_page ?? page
    mappingTotalPages.value = response.meta?.last_page ?? 1
  } finally {
    mappingLoading.value = false
  }
}

watch(selectedProvinceCode, () => {
  loadAll()
})

watch(activeTab, (tab) => {
  if (tab === 'mapping' && mappings.value.length === 0) {
    loadMappings(1)
  }
})

onMounted(loadAll)
</script>
