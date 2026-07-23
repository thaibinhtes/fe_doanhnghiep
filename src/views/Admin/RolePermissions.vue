<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Quản lý phân quyền">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else>
          <div
            v-if="isRootUser"
            class="mb-6 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-4 dark:border-brand-700 dark:bg-brand-500/5"
          >
            <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Thêm quyền mới (ROOT)</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Tạo quyền menu/tính năng mới để gán cho các vai trò.
                </p>
              </div>
              <button
                type="button"
                class="inline-flex h-9 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
                @click="showCreatePermission = !showCreatePermission"
              >
                {{ showCreatePermission ? 'Đóng form' : 'Thêm quyền' }}
              </button>
            </div>

            <form
              v-if="showCreatePermission"
              class="grid gap-3 sm:grid-cols-2"
              @submit.prevent="createPermission"
            >
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Mã quyền (key)</span>
                <input
                  v-model="newPermission.key"
                  type="text"
                  required
                  placeholder="menu.reports.custom"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Tên hiển thị</span>
                <input
                  v-model="newPermission.name"
                  type="text"
                  required
                  placeholder="Báo cáo tùy chỉnh"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Loại</span>
                <select
                  v-model="newPermission.type"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="menu">Menu</option>
                  <option value="feature">Tính năng</option>
                </select>
              </label>
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Nhóm</span>
                <input
                  v-model="newPermission.groupName"
                  type="text"
                  required
                  list="permission-group-options"
                  placeholder="Báo cáo"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
                <datalist id="permission-group-options">
                  <option v-for="group in permissionGroups" :key="group.group" :value="group.group" />
                </datalist>
              </label>
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Đường dẫn (menu)</span>
                <input
                  v-model="newPermission.path"
                  type="text"
                  placeholder="/reports/custom"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <label class="block space-y-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Thứ tự</span>
                <input
                  v-model.number="newPermission.sortOrder"
                  type="number"
                  min="0"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </label>
              <div class="flex items-end sm:col-span-2">
                <button
                  type="submit"
                  :disabled="creatingPermission"
                  class="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {{ creatingPermission ? 'Đang tạo...' : 'Tạo quyền' }}
                </button>
              </div>
              <p v-if="createPermissionError" class="text-sm text-red-600 sm:col-span-2 dark:text-red-400">
                {{ createPermissionError }}
              </p>
              <p v-if="createPermissionSuccess" class="text-sm text-emerald-600 sm:col-span-2 dark:text-emerald-400">
                {{ createPermissionSuccess }}
              </p>
            </form>
          </div>

          <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div class="space-y-2">
            <button
              v-for="role in roles"
              :key="role.id"
              @click="selectRole(role)"
              :class="[
                'w-full rounded-lg border px-4 py-3 text-left transition',
                selectedRole?.id === role.id
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
              ]"
            >
              <p class="font-medium text-gray-800 dark:text-white/90">{{ role.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ role.description }}</p>
              <p class="mt-1 text-xs text-gray-400">{{ role.usersCount ?? 0 }} người dùng</p>
            </button>
          </div>

          <div v-if="selectedRole" class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 sm:p-6">
            <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {{ selectedRole.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Chọn menu và tính năng được phép truy cập
                  <span v-if="!isRootUser" class="block text-xs text-amber-600 dark:text-amber-400">
                    Chỉ hiển thị các quyền thấp hơn hoặc bằng quyền của bạn.
                  </span>
                </p>
              </div>
              <button
                @click="savePermissions"
                :disabled="saving"
                class="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
              >
                {{ saving ? 'Đang lưu...' : 'Lưu phân quyền' }}
              </button>
            </div>

            <div v-if="message" class="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              {{ message }}
            </div>

            <div class="space-y-6">
              <div v-for="group in permissionGroups" :key="group.group">
                <h4 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {{ group.group }}
                </h4>
                <div class="grid gap-2 sm:grid-cols-2">
                  <label
                    v-for="permission in group.permissions"
                    :key="permission.key"
                    class="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <input
                      type="checkbox"
                      :value="permission.key"
                      v-model="selectedPermissionKeys"
                      class="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span>
                      <span class="block text-sm font-medium text-gray-800 dark:text-white/90">
                        {{ permission.name }}
                      </span>
                      <span class="block text-xs text-gray-500 dark:text-gray-400">
                        {{ permission.type === 'menu' ? 'Menu' : 'Tính năng' }} · {{ permission.key }}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { roleService } from '@/services/roleService'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import type { PermissionCreatePayload, PermissionGroup, RoleItem } from '@/types/auth'

const auth = useAuthStore()
const isRootUser = computed(() => auth.user?.role?.slug === 'root')

const loading = ref(true)
const saving = ref(false)
const creatingPermission = ref(false)
const showCreatePermission = ref(false)
const message = ref('')
const createPermissionError = ref('')
const createPermissionSuccess = ref('')
const roles = ref<RoleItem[]>([])
const permissionGroups = ref<PermissionGroup[]>([])
const selectedRole = ref<RoleItem | null>(null)
const selectedPermissionKeys = ref<string[]>([])

const defaultNewPermission = (): PermissionCreatePayload => ({
  key: '',
  name: '',
  type: 'menu',
  groupName: '',
  path: '',
  sortOrder: 900,
})

const newPermission = ref<PermissionCreatePayload>(defaultNewPermission())

const selectRole = (role: RoleItem) => {
  selectedRole.value = role
  selectedPermissionKeys.value = [...(role.permissionKeys ?? [])]
  message.value = ''
}

const loadPermissions = async () => {
  const permissionsData = await roleService.getPermissions()
  permissionGroups.value = permissionsData.grouped
}

const loadData = async () => {
  loading.value = true
  try {
    const [rolesData] = await Promise.all([
      roleService.getRoles(),
      loadPermissions(),
    ])
    roles.value = rolesData
    if (rolesData.length > 0 && !selectedRole.value) {
      selectRole(rolesData[0])
    } else if (selectedRole.value) {
      const refreshed = rolesData.find((role) => role.id === selectedRole.value?.id)
      if (refreshed) {
        selectRole(refreshed)
      }
    }
  } finally {
    loading.value = false
  }
}

const createPermission = async () => {
  creatingPermission.value = true
  createPermissionError.value = ''
  createPermissionSuccess.value = ''
  try {
    const created = await roleService.createPermission({
      key: newPermission.value.key.trim(),
      name: newPermission.value.name.trim(),
      type: newPermission.value.type,
      groupName: newPermission.value.groupName.trim(),
      path: newPermission.value.path?.trim() || undefined,
      sortOrder: newPermission.value.sortOrder ?? 900,
    })
    await loadPermissions()
    if (selectedRole.value && !selectedPermissionKeys.value.includes(created.key)) {
      selectedPermissionKeys.value = [...selectedPermissionKeys.value, created.key]
    }
    newPermission.value = defaultNewPermission()
    createPermissionSuccess.value = `Đã tạo quyền "${created.name}" (${created.key}).`
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    createPermissionError.value = axiosErr.response?.data?.message ?? 'Tạo quyền thất bại.'
  } finally {
    creatingPermission.value = false
  }
}

const savePermissions = async () => {
  if (!selectedRole.value) return

  saving.value = true
  message.value = ''
  try {
    const updated = await roleService.updateRolePermissions(
      selectedRole.value.id,
      selectedPermissionKeys.value,
    )
    selectedRole.value = updated
    roles.value = roles.value.map((role) => (role.id === updated.id ? updated : role))
    await useMenuStore().fetchMenu(true)
    message.value = 'Đã cập nhật phân quyền thành công'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
