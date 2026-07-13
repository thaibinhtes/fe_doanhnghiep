<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard :title="pageTitle">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Quản lý mẫu ánh xạ cột Excel dùng chung khi import. Các mẫu đang bật sẽ hiện trong màn hình import.
        </p>

        <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {{ error }}
        </div>
        <div v-if="success" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          {{ success }}
        </div>

        <div class="mb-4 flex justify-end">
          <button
            v-if="canManage"
            type="button"
            class="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
            @click="openCreate"
          >
            Thêm format ánh xạ
          </button>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else-if="configs.length === 0" class="py-12 text-center text-sm text-gray-500">
          Chưa có cấu hình format ánh xạ.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left dark:border-gray-700">
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Tên</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Mã</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Dòng bắt đầu</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Thứ tự</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Trạng thái</th>
                <th v-if="canManage" class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in configs" :key="item.id" class="border-b border-gray-100 dark:border-gray-800">
                <td class="px-3 py-3">
                  <p class="font-medium text-gray-800 dark:text-white/90">{{ item.name }}</p>
                  <p v-if="item.description" class="text-xs text-gray-500">{{ item.description }}</p>
                </td>
                <td class="px-3 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{{ item.code }}</td>
                <td class="px-3 py-3">{{ item.startRow }}</td>
                <td class="px-3 py-3">{{ item.sortOrder ?? 0 }}</td>
                <td class="px-3 py-3">
                  <span
                    class="rounded-full px-2 py-1 text-xs"
                    :class="item.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                  >
                    {{ item.isActive ? 'Đang dùng' : 'Tắt' }}
                  </span>
                </td>
                <td v-if="canManage" class="px-3 py-3">
                  <div class="flex gap-2">
                    <button type="button" class="text-brand-600 hover:underline" @click="openEdit(item)">Sửa</button>
                    <button type="button" class="text-red-600 hover:underline" @click="removeConfig(item)">Xóa</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <Modal v-if="showForm" @close="closeForm">
        <div class="no-scrollbar relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingId ? 'Sửa format ánh xạ' : 'Thêm format ánh xạ' }}
          </h3>

          <form class="space-y-4" @submit.prevent="saveConfig">
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Tên hiển thị</span>
                <input
                  v-model="form.name"
                  required
                  type="text"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Mã (code)</span>
                <input
                  v-model="form.code"
                  required
                  type="text"
                  pattern="[a-z0-9][a-z0-9_-]*"
                  placeholder="vd: stc_example"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label class="block space-y-1 sm:col-span-2">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Mô tả</span>
                <input
                  v-model="form.description"
                  type="text"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Dòng bắt đầu dữ liệu</span>
                <input
                  v-model.number="form.startRow"
                  required
                  type="number"
                  min="1"
                  max="1000"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Thứ tự</span>
                <input
                  v-model.number="form.sortOrder"
                  type="number"
                  min="0"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label class="flex items-center gap-2 pt-6 text-sm text-gray-700 dark:text-gray-300">
                <input v-model="form.isActive" type="checkbox" class="rounded border-gray-300" />
                Đang dùng (hiện trong import)
              </label>
            </div>

            <div>
              <p class="mb-2 text-sm font-medium text-gray-800 dark:text-white/90">Ánh xạ cột Excel</p>
              <p class="mb-3 text-xs text-gray-500">Nhập cột dạng A, B-D, AA-AB hoặc AA,AC</p>
              <div class="grid max-h-[40vh] gap-2 overflow-y-auto sm:grid-cols-2">
                <label
                  v-for="key in fieldKeys"
                  :key="key"
                  class="block space-y-1 rounded-lg border border-gray-100 p-2 dark:border-gray-800"
                >
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ columnLabels[key] || key }}
                  </span>
                  <input
                    v-model="columnInputs[key]"
                    type="text"
                    placeholder="vd: B hoặc D-G"
                    class="h-9 w-full rounded-lg border border-gray-300 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  />
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button
                type="button"
                class="inline-flex h-10 items-center rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700"
                @click="closeForm"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                :disabled="saving"
              >
                {{ saving ? 'Đang lưu...' : 'Lưu' }}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/profile/Modal.vue'
import { companyService } from '@/services/companyService'
import { cooperativeService } from '@/services/cooperativeService'
import { useAuthStore } from '@/stores/auth'
import { columnsToDisplay, parseColumnInput } from '@/utils/excelColumns'
import type { CompanyImportExampleConfig } from '@/types/company'
import type { CooperativeImportExampleConfig } from '@/types/cooperative'

type Entity = 'companies' | 'cooperatives'
type MappingConfig = CompanyImportExampleConfig & { isActive?: boolean }

const route = useRoute()
const auth = useAuthStore()

const entity = computed<Entity>(() =>
  route.meta.importMappingEntity === 'cooperatives' ? 'cooperatives' : 'companies',
)

const pageTitle = computed(() =>
  entity.value === 'cooperatives'
    ? 'Cấu hình format ánh xạ import HTX'
    : 'Cấu hình format ánh xạ import doanh nghiệp',
)

const canManage = computed(() => auth.hasPermission('feature.import-mapping.manage'))

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')
const configs = ref<MappingConfig[]>([])
const columnLabels = ref<Record<string, string>>({})
const fieldKeys = ref<string[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const columnInputs = reactive<Record<string, string>>({})

const form = reactive({
  name: '',
  code: '',
  description: '',
  startRow: 2,
  sortOrder: 0,
  isActive: true,
})

function resetForm() {
  form.name = ''
  form.code = ''
  form.description = ''
  form.startRow = entity.value === 'companies' ? 13 : 10
  form.sortOrder = 0
  form.isActive = true
  editingId.value = null
  Object.keys(columnInputs).forEach((key) => {
    delete columnInputs[key]
  })
  fieldKeys.value.forEach((key) => {
    columnInputs[key] = ''
  })
}

function buildColumnMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const key of fieldKeys.value) {
    const cols = parseColumnInput(columnInputs[key] || '')
    if (cols.length > 0) {
      map[key] = cols
    }
  }
  return map
}

async function loadDefaults() {
  if (entity.value === 'cooperatives') {
    const defaults = await cooperativeService.getImportColumnMap()
    columnLabels.value = defaults.columnLabels || {}
    fieldKeys.value = Object.keys(columnLabels.value)
    form.startRow = defaults.startRow
  } else {
    const defaults = await companyService.getImportColumnMap()
    columnLabels.value = defaults.columnLabels || {}
    fieldKeys.value = Object.keys(columnLabels.value)
    form.startRow = defaults.startRow
  }
}

async function loadConfigs() {
  loading.value = true
  error.value = ''
  try {
    configs.value =
      entity.value === 'cooperatives'
        ? await cooperativeService.getAdminImportConfigs()
        : await companyService.getAdminImportConfigs()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không tải được danh sách cấu hình.'
    configs.value = []
  } finally {
    loading.value = false
  }
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function openEdit(item: MappingConfig) {
  editingId.value = item.id
  form.name = item.name
  form.code = item.code
  form.description = item.description || ''
  form.startRow = item.startRow
  form.sortOrder = item.sortOrder ?? 0
  form.isActive = item.isActive !== false
  const map = item.columnMap || {}
  const legacyAliases: Record<string, string> = {
    quanHuyenCu: 'quanHuyen',
    phuongXaCu: 'phuongXa',
    diaChiCu: 'diaChi',
  }
  fieldKeys.value.forEach((key) => {
    if (key in map) {
      columnInputs[key] = columnsToDisplay(map[key])
      return
    }
    const legacyKey = legacyAliases[key]
    columnInputs[key] =
      legacyKey && legacyKey in map ? columnsToDisplay(map[legacyKey]) : ''
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  resetForm()
}

async function saveConfig() {
  const columnMap = buildColumnMap()
  if (Object.keys(columnMap).length === 0) {
    error.value = 'Cần ánh xạ ít nhất một cột.'
    return
  }

  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim() || null,
      startRow: form.startRow,
      sortOrder: form.sortOrder,
      isActive: form.isActive,
      columnMap,
    }

    if (entity.value === 'cooperatives') {
      if (editingId.value) {
        await cooperativeService.updateImportConfig(editingId.value, payload)
      } else {
        await cooperativeService.createImportConfig(payload)
      }
    } else if (editingId.value) {
      await companyService.updateImportConfig(editingId.value, payload)
    } else {
      await companyService.createImportConfig(payload)
    }

    success.value = 'Đã lưu cấu hình format ánh xạ.'
    closeForm()
    await loadConfigs()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không lưu được cấu hình.'
  } finally {
    saving.value = false
  }
}

async function removeConfig(item: MappingConfig) {
  if (!confirm(`Xóa format "${item.name}"?`)) return
  error.value = ''
  success.value = ''
  try {
    if (entity.value === 'cooperatives') {
      await cooperativeService.deleteImportConfig(item.id)
    } else {
      await companyService.deleteImportConfig(item.id)
    }
    success.value = 'Đã xóa cấu hình.'
    await loadConfigs()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không xóa được cấu hình.'
  }
}

onMounted(async () => {
  await loadDefaults()
  resetForm()
  await loadConfigs()
})

watch(entity, async () => {
  closeForm()
  await loadDefaults()
  resetForm()
  await loadConfigs()
})
</script>
