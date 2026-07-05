<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Quản lý phân quyền">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else class="grid gap-6 lg:grid-cols-[280px_1fr]">
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
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { roleService } from '@/services/roleService'
import type { PermissionGroup, RoleItem } from '@/types/auth'

const loading = ref(true)
const saving = ref(false)
const message = ref('')
const roles = ref<RoleItem[]>([])
const permissionGroups = ref<PermissionGroup[]>([])
const selectedRole = ref<RoleItem | null>(null)
const selectedPermissionKeys = ref<string[]>([])

const selectRole = (role: RoleItem) => {
  selectedRole.value = role
  selectedPermissionKeys.value = [...(role.permissionKeys ?? [])]
  message.value = ''
}

const loadData = async () => {
  loading.value = true
  try {
    const [rolesData, permissionsData] = await Promise.all([
      roleService.getRoles(),
      roleService.getPermissions(),
    ])
    roles.value = rolesData
    permissionGroups.value = permissionsData.grouped
    if (rolesData.length > 0) {
      selectRole(rolesData[0])
    }
  } finally {
    loading.value = false
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
    message.value = 'Đã cập nhật phân quyền thành công'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
