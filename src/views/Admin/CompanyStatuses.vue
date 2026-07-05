<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">Tổng trạng thái</p>
          <p class="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">{{ statuses.length }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">Định danh</p>
          <p class="mt-1 text-2xl font-semibold text-emerald-600">{{ countByLoai('dinh_danh') }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">Báo cáo</p>
          <p class="mt-1 text-2xl font-semibold text-brand-600">{{ countByLoai('bao_cao') }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p class="text-sm text-gray-500 dark:text-gray-400">DN đang gán</p>
          <p class="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">{{ totalCompanies }}</p>
        </div>
      </div>

      <ComponentCard title="Danh sách trạng thái">
        <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div class="grid gap-3 sm:grid-cols-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Loại</label>
              <select
                v-model="filter.loai"
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">Tất cả</option>
                <option value="dinh_danh">Định danh</option>
                <option value="hoat_dong">Hoạt động</option>
                <option value="bao_cao">Báo cáo</option>
              </select>
            </div>
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
            Thêm trạng thái
          </button>
        </div>

        <div v-if="message" class="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          {{ message }}
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else-if="filteredStatuses.length === 0" class="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Không có trạng thái nào phù hợp bộ lọc.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left dark:border-gray-700">
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">STT</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Mã</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Tên trạng thái</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Loại</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Yêu cầu lý do</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Báo cáo</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Mặc định</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Số DN</th>
                <th class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Trạng thái</th>
                <th v-if="canManage" class="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(status, index) in filteredStatuses"
                :key="status.id"
                class="border-b border-gray-100 dark:border-gray-800"
              >
                <td class="px-3 py-3 text-gray-500">{{ index + 1 }}</td>
                <td class="px-3 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{{ status.ma }}</td>
                <td class="px-3 py-3 text-gray-800 dark:text-white/90">{{ status.ten }}</td>
                <td class="px-3 py-3">
                  <span :class="loaiClass(status.loai)" class="rounded-full px-2 py-1 text-xs">
                    {{ loaiLabel(status.loai) }}
                  </span>
                </td>
                <td class="px-3 py-3">{{ status.yeuCauLyDo ? 'Có' : 'Không' }}</td>
                <td class="px-3 py-3">{{ status.hienThiBaoCao ? 'Có' : 'Không' }}</td>
                <td class="px-3 py-3">{{ status.macDinh ? 'Có' : 'Không' }}</td>
                <td class="px-3 py-3 font-medium">{{ status.companiesCount ?? 0 }}</td>
                <td class="px-3 py-3">
                  <span
                    :class="status.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                    class="rounded-full px-2 py-1 text-xs"
                  >
                    {{ status.isActive ? 'Đang dùng' : 'Ngừng' }}
                  </span>
                </td>
                <td v-if="canManage" class="px-3 py-3">
                  <div class="flex items-center gap-3">
                    <button @click="openEdit(status)" class="text-brand-500 hover:text-brand-600">Sửa</button>
                    <button
                      @click="handleDelete(status)"
                      :disabled="(status.companiesCount ?? 0) > 0 || deletingId === status.id"
                      class="text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {{ deletingId === status.id ? 'Đang xóa...' : 'Xóa' }}
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
        <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
          <h3 class="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
            {{ editingId ? 'Cập nhật trạng thái' : 'Thêm trạng thái' }}
          </h3>

          <form @submit.prevent="saveStatus" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Loại</label>
              <select v-model="form.loai" class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option value="dinh_danh">Định danh</option>
                <option value="hoat_dong">Hoạt động</option>
                <option value="bao_cao">Báo cáo</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Tên trạng thái</label>
              <input v-model="form.ten" required class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Thứ tự báo cáo</label>
              <input v-model.number="form.thuTuBaoCao" type="number" min="1" class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div class="flex flex-col justify-end gap-2">
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input v-model="form.yeuCauLyDo" type="checkbox" class="h-4 w-4 rounded text-brand-500" />
                Yêu cầu lý do
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input v-model="form.hienThiBaoCao" type="checkbox" class="h-4 w-4 rounded text-brand-500" />
                Hiển thị trong báo cáo
              </label>
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
import Modal from '@/components/ui/Modal.vue'
import { statusService } from '@/services/statusService'
import { useAuthStore } from '@/stores/auth'
import type { CompanyStatus, CompanyStatusPayload, StatusLoai } from '@/types/status'

const auth = useAuthStore()
const canManage = computed(() => auth.hasPermission('feature.statuses.manage'))

const loading = ref(true)
const saving = ref(false)
const deletingId = ref<number | null>(null)
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const error = ref<string | null>(null)
const message = ref('')
const statuses = ref<CompanyStatus[]>([])

const filter = reactive({
  loai: '',
  isActive: '',
})

const form = reactive<CompanyStatusPayload>({
  ma: '',
  ten: '',
  loai: 'bao_cao',
  yeuCauLyDo: false,
  hienThiBaoCao: false,
  thuTuBaoCao: null,
  macDinh: false,
  isActive: true,
  moTa: '',
})

const filteredStatuses = computed(() => {
  return statuses.value.filter((status) => {
    if (filter.loai && status.loai !== filter.loai) return false
    if (filter.isActive === 'true' && !status.isActive) return false
    if (filter.isActive === 'false' && status.isActive) return false
    return true
  })
})

const totalCompanies = computed(() =>
  statuses.value.reduce((sum, status) => sum + (status.companiesCount ?? 0), 0),
)

const countByLoai = (loai: StatusLoai) => statuses.value.filter((s) => s.loai === loai).length

const loaiLabel = (loai: StatusLoai) => {
  if (loai === 'dinh_danh') return 'Định danh'
  if (loai === 'hoat_dong') return 'Hoạt động'
  return 'Báo cáo'
}

const loaiClass = (loai: StatusLoai) => {
  if (loai === 'dinh_danh') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  if (loai === 'hoat_dong') return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
}

const loadStatuses = async () => {
  loading.value = true
  try {
    statuses.value = await statusService.getAll()
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filter.loai = ''
  filter.isActive = ''
}

const resetForm = () => {
  Object.assign(form, {
    ma: '',
    ten: '',
    loai: 'bao_cao',
    yeuCauLyDo: false,
    hienThiBaoCao: false,
    thuTuBaoCao: null,
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

const openEdit = (status: CompanyStatus) => {
  editingId.value = status.id
  Object.assign(form, {
    ma: status.ma,
    ten: status.ten,
    loai: status.loai,
    yeuCauLyDo: status.yeuCauLyDo,
    hienThiBaoCao: status.hienThiBaoCao,
    thuTuBaoCao: status.thuTuBaoCao,
    macDinh: status.macDinh,
    isActive: status.isActive,
    moTa: status.moTa ?? '',
  })
  error.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveStatus = async () => {
  saving.value = true
  error.value = null
  message.value = ''
  try {
    if (editingId.value) {
      const { ma, ...payload } = form
      await statusService.update(editingId.value, payload)
      message.value = 'Cập nhật trạng thái thành công.'
    } else {
      await statusService.create(form)
      message.value = 'Thêm trạng thái thành công.'
    }
    isModalOpen.value = false
    await loadStatuses()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Lưu trạng thái thất bại.'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (status: CompanyStatus) => {
  if ((status.companiesCount ?? 0) > 0) {
    alert('Không thể xóa trạng thái đang được gán cho doanh nghiệp.')
    return
  }
  if (!confirm(`Xóa trạng thái "${status.ten}"?`)) return

  deletingId.value = status.id
  message.value = ''
  try {
    await statusService.delete(status.id)
    message.value = 'Xóa trạng thái thành công.'
    await loadStatuses()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    alert(axiosErr.response?.data?.message ?? 'Xóa trạng thái thất bại.')
  } finally {
    deletingId.value = null
  }
}

onMounted(loadStatuses)
</script>
