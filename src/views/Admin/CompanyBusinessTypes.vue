<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">Tổng loại hình</p>
          <p class="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">{{ businessTypes.length }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">Đang dùng</p>
          <p class="mt-1 text-2xl font-semibold text-emerald-600">{{ activeCount }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">DN đang gán</p>
          <p class="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">{{ totalCompanies }}</p>
        </div>
      </div>

      <ComponentCard v-if="canManage" title="Đồng bộ từ dữ liệu doanh nghiệp">
        <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Tạo danh mục từ field Loại hình doanh nghiệp dạng text và cập nhật ID liên kết. Text gốc trên doanh nghiệp được giữ nguyên.
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            :disabled="syncing"
            @click="runSync(true)"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-700"
          >
            Xem trước
          </button>
          <button
            type="button"
            :disabled="syncing"
            @click="runSync(false)"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {{ syncing ? 'Đang đồng bộ...' : 'Đồng bộ danh mục' }}
          </button>
        </div>
        <div v-if="syncResult" class="mt-3 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
          Quét: {{ syncResult.scanned }} · Khớp: {{ syncResult.matched }} · Danh mục mới:
          {{ syncResult.createdTypes }} · DN cập nhật: {{ syncResult.updatedCompanies }} · Bỏ qua:
          {{ syncResult.skipped }}
        </div>
      </ComponentCard>

      <ComponentCard title="Danh sách loại hình">
        <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Trạng thái</label>
              <select
                v-model="filter.isActive"
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">Tất cả</option>
                <option value="true">Đang dùng</option>
                <option value="false">Ngừng dùng</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="resetFilters"
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Xóa lọc
              </button>
            </div>
          </div>

          <button
            v-if="canManage"
            @click="openCreate"
            class="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
          >
            Thêm loại hình
          </button>
        </div>

        <div v-if="message" class="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          {{ message }}
        </div>

        <TableSkeleton v-if="loading" :rows="8" :columns="5" />

        <div v-else-if="filteredTypes.length === 0" class="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Không có loại hình nào phù hợp bộ lọc.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left dark:border-gray-700">
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">STT</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Mã</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Tên loại hình</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Thứ tự</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Mặc định</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Số DN</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Trạng thái</th>
                <th v-if="canManage" class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in filteredTypes"
                :key="item.id"
                class="border-b border-gray-100 dark:border-gray-800"
              >
                <td class="px-3 py-3 text-gray-500">{{ index + 1 }}</td>
                <td class="px-3 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{{ item.ma }}</td>
                <td class="px-3 py-3 text-gray-800 dark:text-white/90">{{ item.ten }}</td>
                <td class="px-3 py-3">{{ item.thuTu }}</td>
                <td class="px-3 py-3">{{ item.macDinh ? 'Có' : 'Không' }}</td>
                <td class="px-3 py-3 font-medium">{{ item.companiesCount ?? 0 }}</td>
                <td class="px-3 py-3">
                  <span
                    :class="item.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                    class="rounded-full px-2 py-1 text-xs"
                  >
                    {{ item.isActive ? 'Đang dùng' : 'Ngừng' }}
                  </span>
                </td>
                <td v-if="canManage" class="px-3 py-3">
                  <div class="flex items-center gap-3">
                    <button @click="openEdit(item)" class="text-brand-500 hover:text-brand-600">Sửa</button>
                    <button
                      @click="handleDelete(item)"
                      :disabled="(item.companiesCount ?? 0) > 0 || deletingId === item.id"
                      class="text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {{ deletingId === item.id ? 'Đang xóa...' : 'Xóa' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>

    <Modal v-if="isModalOpen" @close="closeModal">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-[640px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
          <h3 class="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
            {{ editingId ? 'Cập nhật loại hình' : 'Thêm loại hình' }}
          </h3>

          <form @submit.prevent="saveType" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Mã</label>
              <input
                v-model="form.ma"
                required
                :disabled="!!editingId"
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Thứ tự</label>
              <input
                v-model.number="form.thuTu"
                type="number"
                min="0"
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Tên loại hình</label>
              <input v-model="form.ten" required class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div class="flex flex-col justify-end gap-2 sm:col-span-2">
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input v-model="form.macDinh" type="checkbox" class="h-4 w-4 rounded text-brand-500" />
                Mặc định khi tạo DN
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded text-brand-500" />
                Đang hoạt động
              </label>
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Mô tả</label>
              <textarea v-model="form.moTa" rows="3" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"></textarea>
            </div>

            <div v-if="error" class="sm:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {{ error }}
            </div>

            <div class="sm:col-span-2 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button type="button" @click="closeModal" class="h-10 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700">Hủy</button>
              <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                {{ saving ? 'Đang lưu...' : 'Lưu' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import TableSkeleton from '@/components/common/TableSkeleton.vue'
import Modal from '@/components/ui/Modal.vue'
import { businessTypeService } from '@/services/businessTypeService'
import { useAuthStore } from '@/stores/auth'
import type {
  CompanyBusinessType,
  CompanyBusinessTypePayload,
  CompanyBusinessTypeSyncResult,
} from '@/types/businessType'

const auth = useAuthStore()
const canManage = computed(() => auth.hasPermission('feature.business-types.manage'))

const loading = ref(true)
const saving = ref(false)
const deletingId = ref<number | null>(null)
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const error = ref<string | null>(null)
const message = ref('')
const businessTypes = ref<CompanyBusinessType[]>([])
const syncing = ref(false)
const syncResult = ref<CompanyBusinessTypeSyncResult | null>(null)

const filter = reactive({
  isActive: '',
})

const form = reactive<CompanyBusinessTypePayload>({
  ma: '',
  ten: '',
  thuTu: 0,
  macDinh: false,
  isActive: true,
  moTa: '',
})

const filteredTypes = computed(() => {
  return businessTypes.value.filter((item) => {
    if (filter.isActive === 'true' && !item.isActive) return false
    if (filter.isActive === 'false' && item.isActive) return false
    return true
  })
})

const activeCount = computed(() => businessTypes.value.filter((item) => item.isActive).length)
const totalCompanies = computed(() =>
  businessTypes.value.reduce((sum, item) => sum + (item.companiesCount ?? 0), 0),
)

const loadTypes = async () => {
  loading.value = true
  try {
    businessTypes.value = await businessTypeService.getAll()
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filter.isActive = ''
}

const resetForm = () => {
  Object.assign(form, {
    ma: '',
    ten: '',
    thuTu: 0,
    macDinh: false,
    isActive: true,
    moTa: '',
  })
}

const openCreate = () => {
  editingId.value = null
  resetForm()
  error.value = null
  isModalOpen.value = true
}

const openEdit = (item: CompanyBusinessType) => {
  editingId.value = item.id
  Object.assign(form, {
    ma: item.ma,
    ten: item.ten,
    thuTu: item.thuTu,
    macDinh: item.macDinh,
    isActive: item.isActive,
    moTa: item.moTa ?? '',
  })
  error.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveType = async () => {
  saving.value = true
  error.value = null
  try {
    if (editingId.value) {
      await businessTypeService.update(editingId.value, {
        ten: form.ten,
        thuTu: form.thuTu,
        macDinh: form.macDinh,
        isActive: form.isActive,
        moTa: form.moTa || null,
      })
      message.value = 'Cập nhật loại hình thành công'
    } else {
      await businessTypeService.create(form)
      message.value = 'Thêm loại hình thành công'
    }
    closeModal()
    await loadTypes()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Không thể lưu loại hình'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (item: CompanyBusinessType) => {
  if (!confirm(`Xóa loại hình "${item.ten}"?`)) return
  deletingId.value = item.id
  try {
    await businessTypeService.delete(item.id)
    message.value = 'Xóa loại hình thành công'
    await loadTypes()
  } catch (err: unknown) {
    message.value = ''
    alert(err instanceof Error ? err.message : 'Không thể xóa loại hình')
  } finally {
    deletingId.value = null
  }
}

const runSync = async (dryRun: boolean) => {
  syncing.value = true
  message.value = ''
  try {
    syncResult.value = await businessTypeService.syncFromCompanies(dryRun)
    message.value = dryRun ? 'Đã xem trước đồng bộ loại hình.' : 'Đồng bộ loại hình thành công.'
    if (!dryRun) await loadTypes()
  } catch (err: unknown) {
    message.value = ''
    alert(err instanceof Error ? err.message : 'Không thể đồng bộ loại hình')
  } finally {
    syncing.value = false
  }
}

onMounted(loadTypes)
</script>
