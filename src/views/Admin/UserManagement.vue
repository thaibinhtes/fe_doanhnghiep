<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Danh sách người dùng">
        <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div class="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              v-model="filter.search"
              type="search"
              placeholder="Tìm tên / email..."
              class="h-11 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
            <select
              v-model="filter.donViId"
              class="h-11 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="">Tất cả đơn vị</option>
              <option v-for="opt in orgUnitOptions" :key="opt.id" :value="String(opt.id)">
                {{ opt.label }}
              </option>
            </select>
            <select
              v-model="filter.roleId"
              class="h-11 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="">Tất cả vai trò</option>
              <option v-for="role in roles" :key="role.id" :value="String(role.id)">
                {{ role.name }}
              </option>
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
            @click="openCreate"
          >
            Thêm người dùng
          </button>
        </div>

        <div v-if="message" class="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          {{ message }}
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else-if="users.length === 0" class="py-12 text-center text-sm text-gray-500">
          Không có người dùng nào.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left dark:border-gray-700">
                <th class="px-3 py-3 font-medium">Họ tên</th>
                <th class="px-3 py-3 font-medium">Email</th>
                <th class="px-3 py-3 font-medium">Vai trò</th>
                <th class="px-3 py-3 font-medium">Đơn vị</th>
                <th class="px-3 py-3 font-medium">Trạng thái</th>
                <th v-if="canManage" class="px-3 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b border-gray-100 dark:border-gray-800">
                <td class="px-3 py-3 font-medium text-gray-800 dark:text-white/90">{{ user.name }}</td>
                <td class="px-3 py-3">{{ user.email }}</td>
                <td class="px-3 py-3">{{ user.role?.name ?? '-' }}</td>
                <td class="px-3 py-3">{{ user.donVi ? `${user.donVi.ma} — ${user.donVi.ten}` : '-' }}</td>
                <td class="px-3 py-3">
                  <span
                    class="rounded-full px-2 py-1 text-xs"
                    :class="user.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                  >
                    {{ user.isActive ? 'Hoạt động' : 'Ngừng' }}
                  </span>
                </td>
                <td v-if="canManage" class="px-3 py-3">
                  <div class="flex items-center gap-3">
                    <button type="button" class="text-brand-500 hover:text-brand-600" @click="openEdit(user)">Sửa</button>
                    <button
                      type="button"
                      class="text-red-500 hover:text-red-600 disabled:opacity-40"
                      :disabled="deletingId === user.id"
                      @click="handleDelete(user)"
                    >
                      {{ deletingId === user.id ? 'Đang xóa...' : 'Xóa' }}
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
            {{ editingId ? 'Cập nhật người dùng' : 'Thêm người dùng' }}
          </h3>

          <form class="grid grid-cols-1 gap-4 sm:grid-cols-2" @submit.prevent="saveUser">
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium">Họ tên</label>
              <input v-model="form.name" required class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium">Email</label>
              <input v-model="form.email" type="email" required class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium">
                Mật khẩu
                <span v-if="editingId" class="font-normal text-gray-500">(để trống nếu không đổi)</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                :required="!editingId"
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium">Vai trò</label>
              <select v-model.number="form.roleId" class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option :value="null">Không gán</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium">Đơn vị</label>
              <select v-model.number="form.donViId" class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option :value="null">Không gán</option>
                <option v-for="opt in orgUnitOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
              </select>
            </div>
            <div class="sm:col-span-2">
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/profile/Modal.vue'
import { useAuthStore } from '@/stores/auth'
import { orgUnitService } from '@/services/orgUnitService'
import { roleService } from '@/services/roleService'
import { userService } from '@/services/userService'
import type { OrgUnit } from '@/types/orgUnit'
import { buildOrgUnitOptions } from '@/types/orgUnit'
import type { AppUser } from '@/types/user'
import type { RoleItem } from '@/types/auth'

const auth = useAuthStore()
const canManage = computed(() => auth.hasPermission('feature.users.manage'))

const loading = ref(false)
const message = ref('')
const deletingId = ref<number | null>(null)
const users = ref<AppUser[]>([])
const roles = ref<RoleItem[]>([])
const orgUnits = ref<OrgUnit[]>([])
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)

const filter = reactive({
  search: '',
  donViId: '',
  roleId: '',
})

const form = reactive({
  name: '',
  email: '',
  password: '',
  roleId: null as number | null,
  donViId: null as number | null,
  isActive: true,
})

const orgUnitOptions = computed(() => buildOrgUnitOptions(orgUnits.value))

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await userService.getList({
      search: filter.search.trim() || undefined,
      donViId: filter.donViId ? Number(filter.donViId) : undefined,
      roleId: filter.roleId ? Number(filter.roleId) : undefined,
      perPage: 100,
    })
    users.value = response.data
  } finally {
    loading.value = false
  }
}

const loadLookups = async () => {
  const [roleList, unitTree] = await Promise.all([
    roleService.getRoles(),
    orgUnitService.getTree(),
  ])
  roles.value = roleList
  orgUnits.value = unitTree
}

const resetFilters = () => {
  filter.search = ''
  filter.donViId = ''
  filter.roleId = ''
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.roleId = null
  form.donViId = null
  form.isActive = true
}

const openCreate = () => {
  editingId.value = null
  resetForm()
  isModalOpen.value = true
}

const openEdit = (user: AppUser) => {
  editingId.value = user.id
  form.name = user.name
  form.email = user.email
  form.password = ''
  form.roleId = user.roleId ?? user.role?.id ?? null
  form.donViId = user.donViId ?? user.donVi?.id ?? null
  form.isActive = user.isActive
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingId.value = null
}

const saveUser = async () => {
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    roleId: form.roleId,
    donViId: form.donViId,
    isActive: form.isActive,
    ...(form.password ? { password: form.password } : {}),
  }

  if (editingId.value) {
    await userService.update(editingId.value, payload)
    message.value = 'Cập nhật người dùng thành công'
  } else {
    await userService.create({ ...payload, password: form.password })
    message.value = 'Tạo người dùng thành công'
  }

  closeModal()
  await loadUsers()
}

const handleDelete = async (user: AppUser) => {
  if (!confirm(`Xóa người dùng "${user.name}"?`)) return
  deletingId.value = user.id
  try {
    await userService.delete(user.id)
    message.value = 'Xóa người dùng thành công'
    await loadUsers()
  } finally {
    deletingId.value = null
  }
}

watch(
  () => [filter.search, filter.donViId, filter.roleId],
  () => {
    void loadUsers()
  },
)

onMounted(async () => {
  await loadLookups()
  await loadUsers()
})
</script>
