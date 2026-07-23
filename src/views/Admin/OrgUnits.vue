<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Danh sách đơn vị">
        <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div class="grid flex-1 gap-3 sm:grid-cols-3">
            <input
              v-model="filter.search"
              type="search"
              placeholder="Tìm mã / tên đơn vị..."
              class="h-11 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
            <select
              v-model="filter.isActive"
              class="h-11 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Ngừng</option>
            </select>
            <button
              type="button"
              class="h-11 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700"
              @click="resetFilters"
            >
              Xóa lọc
            </button>
          </div>

          <button
            v-if="canManage"
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
            @click="openCreateRoot"
          >
            Thêm đơn vị gốc
          </button>
        </div>

        <div v-if="message" class="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          {{ message }}
        </div>

        <TableSkeleton v-if="loading" :rows="8" :columns="7" />

        <div v-else-if="displayRows.length === 0" class="py-12 text-center text-sm text-gray-500">
          Không có đơn vị nào.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left dark:border-gray-700">
                <th class="px-3 py-3 font-medium">Mã</th>
                <th class="px-3 py-3 font-medium">Tên đơn vị</th>
                <th class="px-3 py-3 font-medium">Cấp</th>
                <th class="px-3 py-3 font-medium">User</th>
                <th class="px-3 py-3 font-medium">DN</th>
                <th class="px-3 py-3 font-medium">Trạng thái</th>
                <th v-if="canManage" class="px-3 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in displayRows"
                :key="row.id"
                class="border-b border-gray-100 dark:border-gray-800"
                :class="{ 'opacity-60': !row.isActive }"
              >
                <td class="px-3 py-3 font-mono text-xs">{{ row.ma }}</td>
                <td class="px-3 py-3">
                  <span :style="{ paddingLeft: `${row.depth * 1.25}rem` }" class="inline-block">
                    {{ row.ten }}
                  </span>
                </td>
                <td class="px-3 py-3">Cấp {{ row.cap }}</td>
                <td class="px-3 py-3">{{ row.usersCount ?? 0 }}</td>
                <td class="px-3 py-3">{{ row.companiesCount ?? 0 }}</td>
                <td class="px-3 py-3">
                  <span
                    class="rounded-full px-2 py-1 text-xs"
                    :class="row.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                  >
                    {{ row.isActive ? 'Hoạt động' : 'Ngừng' }}
                  </span>
                </td>
                <td v-if="canManage" class="px-3 py-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <button type="button" class="text-brand-500 hover:text-brand-600" @click="openCreateChild(row)">
                      + Con
                    </button>
                    <button type="button" class="text-brand-500 hover:text-brand-600" @click="openEdit(row)">
                      Sửa
                    </button>
                    <button
                      type="button"
                      class="text-red-500 hover:text-red-600 disabled:opacity-40"
                      :disabled="(row.childrenCount ?? 0) > 0 || (row.usersCount ?? 0) > 0 || (row.companiesCount ?? 0) > 0 || deletingId === row.id"
                      @click="handleDelete(row)"
                    >
                      {{ deletingId === row.id ? 'Đang xóa...' : 'Xóa' }}
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
            {{ editingId ? 'Cập nhật đơn vị' : 'Thêm đơn vị' }}
          </h3>

          <form class="grid grid-cols-1 gap-4 sm:grid-cols-2" @submit.prevent="saveItem">
            <div v-if="!editingId">
              <label class="mb-1.5 block text-sm font-medium">Cấp</label>
              <input :value="`Cấp ${form.cap}`" disabled class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>

            <div v-if="!editingId && form.cap > 1">
              <label class="mb-1.5 block text-sm font-medium">Đơn vị cha</label>
              <select
                v-model.number="form.parentId"
                required
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option :value="null" disabled>Chọn đơn vị cha</option>
                <option v-for="opt in parentOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
              </select>
            </div>

            <div v-if="!editingId">
              <label class="mb-1.5 block text-sm font-medium">Mã đơn vị</label>
              <input v-model="form.ma" required class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div v-else>
              <label class="mb-1.5 block text-sm font-medium">Mã đơn vị</label>
              <input :value="form.ma" disabled class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium">Tên đơn vị</label>
              <input v-model="form.ten" required class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium">Mô tả</label>
              <textarea v-model="form.moTa" rows="2" class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"></textarea>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium">Thứ tự</label>
              <input v-model.number="form.thuTu" type="number" min="0" class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>

            <div class="flex items-end">
              <label class="inline-flex items-center gap-2 text-sm">
                <input v-model="form.isActive" type="checkbox" class="rounded border-gray-300" />
                Đang hoạt động
              </label>
            </div>

            <div class="flex justify-end gap-3 sm:col-span-2">
              <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700" @click="closeModal">
                Hủy
              </button>
              <button type="submit" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
                Lưu
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
import Modal from '@/components/profile/Modal.vue'
import { useAuthStore } from '@/stores/auth'
import { orgUnitService } from '@/services/orgUnitService'
import type { OrgUnit, OrgUnitPayload, OrgUnitTreeRow } from '@/types/orgUnit'
import { buildOrgUnitOptions, flattenOrgUnitTree } from '@/types/orgUnit'

const auth = useAuthStore()
const canManage = computed(() => auth.hasPermission('feature.org-units.manage'))

const loading = ref(false)
const message = ref('')
const deletingId = ref<number | null>(null)
const tree = ref<OrgUnit[]>([])
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)

const filter = reactive({
  search: '',
  isActive: '',
})

const form = reactive({
  parentId: null as number | null,
  cap: 1,
  ma: '',
  ten: '',
  moTa: '',
  thuTu: 0,
  isActive: true,
})

const displayRows = computed(() => {
  const rows = flattenOrgUnitTree(tree.value)
  const keyword = filter.search.trim().toLowerCase()
  const activeFilter = filter.isActive

  return rows.filter((row) => {
    const matchesSearch = !keyword
      || row.ma.toLowerCase().includes(keyword)
      || row.ten.toLowerCase().includes(keyword)
    const matchesActive = activeFilter === ''
      || String(row.isActive) === activeFilter

    return matchesSearch && matchesActive
  })
})

const parentOptions = computed(() =>
  buildOrgUnitOptions(tree.value).filter((item) => item.cap === form.cap - 1),
)

const loadTree = async () => {
  loading.value = true
  try {
    tree.value = await orgUnitService.getTree()
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filter.search = ''
  filter.isActive = ''
}

const resetForm = () => {
  form.parentId = null
  form.cap = 1
  form.ma = ''
  form.ten = ''
  form.moTa = ''
  form.thuTu = 0
  form.isActive = true
}

const openCreateRoot = () => {
  editingId.value = null
  resetForm()
  form.cap = 1
  isModalOpen.value = true
}

const openCreateChild = (row: OrgUnitTreeRow) => {
  editingId.value = null
  resetForm()
  form.cap = row.cap + 1
  form.parentId = row.id
  isModalOpen.value = true
}

const openEdit = (row: OrgUnit) => {
  editingId.value = row.id
  form.parentId = row.parentId
  form.cap = row.cap
  form.ma = row.ma
  form.ten = row.ten
  form.moTa = row.moTa ?? ''
  form.thuTu = row.thuTu
  form.isActive = row.isActive
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingId.value = null
}

const saveItem = async () => {
  const payload: OrgUnitPayload = {
    parentId: form.cap === 1 ? null : form.parentId,
    cap: form.cap,
    ma: form.ma.trim(),
    ten: form.ten.trim(),
    moTa: form.moTa.trim() || null,
    thuTu: form.thuTu,
    isActive: form.isActive,
  }

  if (editingId.value) {
    await orgUnitService.update(editingId.value, {
      ten: payload.ten,
      moTa: payload.moTa,
      thuTu: payload.thuTu,
      isActive: payload.isActive,
    })
    message.value = 'Cập nhật đơn vị thành công'
  } else {
    await orgUnitService.create(payload)
    message.value = 'Tạo đơn vị thành công'
  }

  closeModal()
  await loadTree()
}

const handleDelete = async (row: OrgUnit) => {
  if (!confirm(`Xóa đơn vị "${row.ten}"?`)) return
  deletingId.value = row.id
  try {
    await orgUnitService.delete(row.id)
    message.value = 'Xóa đơn vị thành công'
    await loadTree()
  } finally {
    deletingId.value = null
  }
}

onMounted(loadTree)
</script>
