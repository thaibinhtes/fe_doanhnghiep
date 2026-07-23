<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Cấu hình menu (ROOT)">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Chỉ được sửa <strong>tên hiển thị</strong> và <strong>thứ tự</strong> menu. Danh sách mục và phân quyền là cố định — không xóa được.
          Dashboard luôn đứng đầu.
        </p>

        <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {{ error }}
        </div>
        <div v-if="success" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          {{ success }}
        </div>

        <TableSkeleton v-if="loading" :rows="8" :columns="3" />

        <div v-else class="space-y-4">
          <div
            v-if="dashboardItem"
            class="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 dark:border-brand-800 dark:bg-brand-500/10"
          >
            <span class="text-lg text-gray-400">🔒</span>
            <div class="min-w-0 flex-1 space-y-1">
              <input
                v-model="dashboardItem.label"
                type="text"
                class="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Tên menu"
                @mousedown.stop
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ dashboardItem.path }} · Cố định đầu menu</p>
            </div>
          </div>

          <draggable
            v-model="categories"
            item-key="id"
            handle=".category-handle"
            class="space-y-3"
            animation="200"
          >
            <template #item="{ element: category }">
              <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <div class="flex items-center gap-2 border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
                  <button type="button" class="category-handle cursor-grab px-1 text-gray-400 hover:text-gray-600" title="Kéo danh mục">
                    ⋮⋮
                  </button>
                  <div class="min-w-0 flex-1 space-y-1">
                    <input
                      v-model="category.label"
                      type="text"
                      class="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      placeholder="Tên danh mục"
                      @mousedown.stop
                    />
                    <p v-if="category.icon" class="text-xs text-gray-500">Icon: {{ category.icon }}</p>
                  </div>
                </div>

                <draggable
                  v-model="category.children"
                  item-key="id"
                  group="menu-leaves"
                  handle=".item-handle"
                  class="space-y-1 p-2"
                  animation="200"
                >
                  <template #item="{ element: child }">
                    <div class="rounded-lg border border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/40">
                      <div class="flex items-start gap-2 px-2 py-2">
                        <button type="button" class="item-handle mt-1.5 cursor-grab px-1 text-gray-400 hover:text-gray-600" title="Kéo mục">
                          ⋮⋮
                        </button>
                        <div class="min-w-0 flex-1 space-y-1">
                          <input
                            v-model="child.label"
                            type="text"
                            class="h-8 w-full rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                            placeholder="Tên mục menu"
                            @mousedown.stop
                          />
                          <p v-if="child.path" class="truncate text-xs text-gray-500">{{ child.path }}</p>
                          <p v-if="child.isRootOnly" class="text-xs text-amber-600">ROOT</p>
                        </div>
                      </div>

                      <draggable
                        v-if="child.children?.length"
                        v-model="child.children"
                        item-key="id"
                        group="menu-leaves"
                        handle=".nested-handle"
                        class="space-y-1 border-t border-gray-200 p-2 pl-6 dark:border-gray-700"
                        animation="200"
                      >
                        <template #item="{ element: nested }">
                          <div class="flex items-start gap-2 rounded-md bg-white px-2 py-1.5 dark:bg-gray-900">
                            <button type="button" class="nested-handle mt-1.5 cursor-grab px-1 text-xs text-gray-400">⋮⋮</button>
                            <div class="min-w-0 flex-1 space-y-1">
                              <input
                                v-model="nested.label"
                                type="text"
                                class="h-8 w-full rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                placeholder="Tên mục menu"
                                @mousedown.stop
                              />
                              <p v-if="nested.path" class="truncate text-xs text-gray-500">{{ nested.path }}</p>
                            </div>
                          </div>
                        </template>
                      </draggable>
                    </div>
                  </template>
                </draggable>
              </div>
            </template>
          </draggable>

          <div class="flex flex-wrap justify-end gap-2 pt-2">
            <button
              type="button"
              class="inline-flex h-10 items-center rounded-lg border border-amber-400 px-4 text-sm font-medium text-amber-700 dark:border-amber-600 dark:text-amber-400"
              :disabled="saving || syncing"
              @click="syncDefaults"
            >
              {{ syncing ? 'Đang đồng bộ...' : 'Đồng bộ menu mặc định' }}
            </button>
            <button
              type="button"
              class="inline-flex h-10 items-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
              :disabled="saving || syncing"
              @click="loadMenu"
            >
              Tải lại
            </button>
            <button
              type="button"
              class="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              :disabled="saving || syncing"
              @click="saveOrder"
            >
              {{ saving ? 'Đang lưu...' : 'Lưu cấu hình menu' }}
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import TableSkeleton from '@/components/common/TableSkeleton.vue'
import { navMenuService } from '@/services/navMenuService'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth'
import type { NavMenuNode, NavMenuReorderItem } from '@/types/navMenu'

const auth = useAuthStore()
const router = useRouter()
const menuStore = useMenuStore()

const loading = ref(true)
const saving = ref(false)
const syncing = ref(false)
const error = ref('')
const success = ref('')
const tree = ref<NavMenuNode[]>([])

const dashboardItem = computed(() => tree.value.find((node) => node.isDashboard) ?? null)

const categories = computed({
  get: () => tree.value.filter((node) => !node.isDashboard),
  set: (value: NavMenuNode[]) => {
    const dashboard = dashboardItem.value
    tree.value = dashboard ? [dashboard, ...value] : value
  },
})

function flattenTree(nodes: NavMenuNode[], parentId: number | null = null): NavMenuReorderItem[] {
  const items: NavMenuReorderItem[] = []

  nodes.forEach((node, index) => {
    items.push({
      id: node.id,
      parentId: node.isDashboard ? null : parentId,
      sortOrder: node.isDashboard ? 0 : index * 10,
      label: node.label.trim(),
    })

    if (node.children?.length) {
      items.push(...flattenTree(node.children, node.id))
    }
  })

  return items
}

async function loadMenu() {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    tree.value = await navMenuService.getAdminMenu()
  } catch {
    error.value = 'Không tải được cấu hình menu.'
  } finally {
    loading.value = false
  }
}

async function syncDefaults() {
  syncing.value = true
  error.value = ''
  success.value = ''
  try {
    await navMenuService.syncDefaults()
    tree.value = await navMenuService.getAdminMenu()
    await menuStore.fetchMenu(true)
    success.value = 'Đã đồng bộ menu mặc định (giữ tên và thứ tự đã cấu hình).'
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không đồng bộ được menu mặc định.'
  } finally {
    syncing.value = false
  }
}

async function saveOrder() {
  const hasEmptyLabel = flattenTree(tree.value).some((item) => !item.label)
  if (hasEmptyLabel) {
    error.value = 'Tên menu không được để trống.'
    return
  }

  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const dashboard = dashboardItem.value
    const ordered = dashboard ? [dashboard, ...categories.value] : categories.value
    tree.value = await navMenuService.reorder(flattenTree(ordered))
    await menuStore.fetchMenu(true)
    success.value = 'Đã lưu cấu hình menu.'
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không lưu được cấu hình menu.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (auth.user?.role?.slug !== 'root') {
    await router.replace('/dashboard')
    return
  }
  await loadMenu()
})
</script>
