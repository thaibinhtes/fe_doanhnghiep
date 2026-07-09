<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Danh sách hợp tác xã đóng thuế">
        <ImportLoadingSkeleton
          v-if="showBackgroundSkeleton"
          class="mb-4"
          title="Đang import hợp tác xã đóng thuế..."
          subtitle="Job đang chạy nền, bạn có thể tiếp tục thao tác và chờ thông báo hoàn tất."
        />

        <div class="mb-3 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-1.5">
            <input
              v-model="search"
              type="search"
              placeholder="Tìm mã số thuế / tên hợp tác xã..."
              class="h-9 w-[220px] shrink-0 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              @keyup.enter="loadRows(1)"
            />
            <button
              type="button"
              class="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 px-3 text-xs font-medium text-white transition hover:bg-brand-600"
              @click="loadRows(1)"
            >
              Tìm
            </button>
            <button
              type="button"
              class="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="resetFilters"
            >
              Đặt lại
            </button>
            <div class="ml-auto flex shrink-0 items-center gap-1.5">
              <div class="relative" ref="importDropdownRef">
                <button
                  type="button"
                  class="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-amber-500 bg-white px-2.5 text-xs font-medium text-amber-600 transition hover:bg-amber-50 dark:border-amber-400 dark:bg-gray-900 dark:text-amber-400 dark:hover:bg-amber-500/10"
                  @click="showImportMenu = !showImportMenu"
                >
                  Nhập
                </button>
                <div
                  v-if="showImportMenu"
                  class="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow dark:border-gray-700 dark:bg-gray-900"
                >
                  <RouterLink
                    to="/cooperatives/import-tax"
                    class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click="showImportMenu = false"
                  >
                    Import Excel
                  </RouterLink>
                  <button
                    type="button"
                    class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click="openHistoryModal"
                  >
                    Lịch sử import
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="flex min-h-[240px] items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>
        <div
          v-else-if="rows.length === 0"
          class="flex min-h-[240px] items-center justify-center rounded-xl border border-gray-200 text-sm text-gray-400 dark:border-gray-700"
        >
          Không có dữ liệu.
        </div>
        <div v-else class="overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="min-w-max w-full">
            <div class="sticky top-0 z-10 flex border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <div class="flex-none w-[50px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">TT</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">ID đơn vị thuế</div>
              <div class="flex-none w-[min(280px,28vw)] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Đơn vị thuế</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">MST</div>
              <div class="flex-none w-[min(360px,34vw)] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Tên hợp tác xã</div>
              <div class="flex-none w-[130px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Trạng thái</div>
              <div class="flex-none w-[130px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Ngày tạo</div>
            </div>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="(item, index) in rows"
                :key="item.id"
                class="flex items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div class="flex-none w-[50px] p-[5px] text-sm text-gray-700 dark:text-gray-300">
                  {{ (meta.currentPage - 1) * meta.perPage + index + 1 }}
                </div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words">
                  {{ item.taxUnit?.unitCode || '-' }}
                </div>
                <div class="flex-none w-[min(280px,28vw)] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words">
                  {{ item.taxUnit?.unitName || '-' }}
                </div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words">
                  {{ item.taxCode || '-' }}
                </div>
                <div class="flex-none w-[min(360px,34vw)] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words">
                  {{ item.cooperativeName }}
                </div>
                <div class="flex-none w-[130px] p-[5px]">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="item.isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'"
                  >
                    {{ item.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                  </span>
                </div>
                <div class="flex-none w-[130px] p-[5px] text-sm text-gray-700 dark:text-gray-300">
                  {{ formatTaxDate(item.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="meta.lastPage > 1" class="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Trang {{ meta.currentPage }} / {{ meta.lastPage }} · {{ meta.total }} hợp tác xã</span>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
              :disabled="meta.currentPage <= 1"
              @click="loadRows(meta.currentPage - 1)"
            >
              Trước
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
              :disabled="meta.currentPage >= meta.lastPage"
              @click="loadRows(meta.currentPage + 1)"
            >
              Sau
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>

    <Modal v-if="showHistoryModal" @close="showHistoryModal = false">
      <div class="no-scrollbar relative z-1 mx-auto w-full max-w-5xl max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Lịch sử import thuế hợp tác xã</h3>
        <p class="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
          Theo dõi các lần import hợp tác xã đóng thuế.
        </p>
        <TaxImportHistoryPanel fixed-type="cooperative_tax" hide-type-filter />
      </div>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/profile/Modal.vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import TaxImportHistoryPanel from '@/components/admin/TaxImportHistoryPanel.vue'
import { useImportNotifications } from '@/composables/useImportNotifications'
import { taxManagementService } from '@/services/taxManagementService'
import type { TaxCooperativeItem } from '@/types/taxManagement'

const formatTaxDate = (value?: string | null) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('vi-VN')
}

const rows = ref<TaxCooperativeItem[]>([])
const search = ref('')
const loading = ref(false)
const meta = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 50,
})
const showImportMenu = ref(false)
const showHistoryModal = ref(false)
const importDropdownRef = ref<HTMLElement | null>(null)
const showBackgroundSkeleton = ref(false)
const { onImportCompleted, onImportFailed } = useImportNotifications()
const importUnsubscribers: Array<() => void> = []

const loadRows = async (page = 1) => {
  loading.value = true
  try {
    const response = await taxManagementService.getCooperativeTaxList({
      page,
      perPage: meta.perPage,
      search: search.value.trim() || undefined,
    })
    rows.value = response.data
    meta.currentPage = response.meta?.current_page ?? page
    meta.lastPage = response.meta?.last_page ?? 1
    meta.total = response.meta?.total ?? response.data.length
    meta.perPage = response.meta?.per_page ?? meta.perPage
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  search.value = ''
  void loadRows(1)
}

const openHistoryModal = () => {
  showImportMenu.value = false
  showHistoryModal.value = true
}

const handleClickOutside = (event: MouseEvent) => {
  if (importDropdownRef.value && !importDropdownRef.value.contains(event.target as Node)) {
    showImportMenu.value = false
  }
}

onMounted(() => {
  void loadRows(1)
  document.addEventListener('click', handleClickOutside)

  importUnsubscribers.push(
    onImportCompleted(async (payload) => {
      if (payload.entity === 'cooperative-tax') {
        showBackgroundSkeleton.value = false
        await loadRows(meta.currentPage)
      }
    }),
    onImportFailed((payload) => {
      if (payload.entity === 'cooperative-tax') {
        showBackgroundSkeleton.value = false
      }
    }),
  )
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  importUnsubscribers.forEach((unsub) => unsub())
})
</script>
