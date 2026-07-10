<template>
  <AdminLayout>
    <div class="flex min-h-0 flex-1 flex-col max-lg:flex-none max-lg:overflow-visible lg:overflow-hidden">
      <ComponentCard
        title="Lịch sử định danh doanh nghiệp"
        className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
        bodyClass="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-3"
        slotClass="flex min-h-0 flex-1 flex-col gap-2"
      >
        <p class="shrink-0 text-sm text-gray-500 dark:text-gray-400">
          Theo dõi các lần đăng ký / huỷ đăng ký định danh doanh nghiệp trong hệ thống.
        </p>

        <div class="shrink-0 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <input
              v-model="filter.search"
              type="text"
              placeholder="Tìm MST, tên doanh nghiệp..."
              class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
            <select
              v-model="filter.nguon"
              class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option v-for="opt in IDENTITY_SOURCE_OPTIONS" :key="opt.value || 'all'" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <select
              v-model="filter.hanhDong"
              class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option v-for="opt in IDENTITY_ACTION_OPTIONS" :key="opt.value || 'all'" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <input
              v-model="filter.dateFrom"
              type="date"
              title="Từ ngày"
              class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
            <input
              v-model="filter.dateTo"
              type="date"
              title="Đến ngày"
              class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
            <div class="flex items-center gap-2 sm:col-span-2 xl:col-span-2">
              <button
                type="button"
                class="inline-flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                @click="resetFilters"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        <div v-if="error" class="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {{ error }}
        </div>

        <div class="min-h-0 flex-1 overflow-auto">
          <div v-if="loading" class="py-12 text-center text-sm text-gray-500">Đang tải...</div>
          <div v-else-if="items.length === 0" class="py-12 text-center text-sm text-gray-500">
            Không có lịch sử định danh.
          </div>
          <div v-else class="min-w-max">
            <table class="min-w-full text-sm">
              <thead class="sticky top-0 z-10 bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th class="px-3 py-2">STT</th>
                  <th class="px-3 py-2">Thời gian</th>
                  <th class="px-3 py-2">Mã số DN</th>
                  <th class="px-3 py-2">Tên doanh nghiệp</th>
                  <th class="px-3 py-2">Hành động</th>
                  <th class="px-3 py-2">Nguồn</th>
                  <th class="px-3 py-2">Người thực hiện</th>
                  <th class="px-3 py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in items"
                  :key="item.id"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <td class="px-3 py-2">{{ rowNumber(index) }}</td>
                  <td class="px-3 py-2 whitespace-nowrap">{{ formatDate(item.createdAt) }}</td>
                  <td class="px-3 py-2">{{ item.maSoDoanhNghiep || '—' }}</td>
                  <td class="px-3 py-2 max-w-[260px]">{{ item.tenDoanhNghiep || '—' }}</td>
                  <td class="px-3 py-2">
                    <span
                      class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      :class="actionClass(item.hanhDong)"
                    >
                      {{ item.hanhDongLabel }}
                    </span>
                  </td>
                  <td class="px-3 py-2">{{ item.nguonLabel }}</td>
                  <td class="px-3 py-2">{{ item.userName || '—' }}</td>
                  <td class="px-3 py-2 max-w-[220px] truncate" :title="item.ghiChu || undefined">
                    {{ item.ghiChu || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="meta.total > 0"
          class="shrink-0 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-2 text-sm dark:border-gray-700"
        >
          <span class="text-gray-500 dark:text-gray-400">
            Tổng {{ meta.total }} bản ghi · Trang {{ meta.current_page }}/{{ meta.last_page }}
          </span>
          <div class="flex items-center gap-2">
            <select
              v-model.number="perPage"
              class="h-8 rounded-lg border border-gray-300 bg-transparent px-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option :value="20">20 / trang</option>
              <option :value="50">50 / trang</option>
              <option :value="100">100 / trang</option>
            </select>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
              :disabled="page <= 1 || loading"
              @click="page--"
            >
              Trước
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
              :disabled="page >= meta.last_page || loading"
              @click="page++"
            >
              Sau
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { reportService } from '@/services/reportService'
import type { IdentityHistoryItem } from '@/types/identityHistory'
import { IDENTITY_ACTION_OPTIONS, IDENTITY_SOURCE_OPTIONS } from '@/types/identityHistory'

const filter = reactive({
  search: '',
  nguon: '',
  hanhDong: '',
  dateFrom: '',
  dateTo: '',
})

const items = ref<IdentityHistoryItem[]>([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const perPage = ref(20)
const meta = ref({ current_page: 1, last_page: 1, per_page: 20, total: 0 })

const currentFilters = () => ({
  search: filter.search || undefined,
  nguon: filter.nguon || undefined,
  hanhDong: filter.hanhDong || undefined,
  dateFrom: filter.dateFrom || undefined,
  dateTo: filter.dateTo || undefined,
  page: page.value,
  per_page: perPage.value,
})

async function loadHistory() {
  loading.value = true
  error.value = ''
  try {
    const response = await reportService.getIdentityHistory(currentFilters())
    items.value = response.data
    meta.value = response.meta
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không tải được lịch sử định danh.'
    items.value = []
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filter.search = ''
  filter.nguon = ''
  filter.hanhDong = ''
  filter.dateFrom = ''
  filter.dateTo = ''
  page.value = 1
}

function rowNumber(index: number) {
  return (meta.value.current_page - 1) * meta.value.per_page + index + 1
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('vi-VN')
}

function actionClass(hanhDong: string) {
  return hanhDong === 'dang_ky'
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
}

onMounted(async () => {
  await loadHistory()
})

let filterTimer: ReturnType<typeof setTimeout> | null = null
watch([filter, page, perPage], () => {
  if (filterTimer) clearTimeout(filterTimer)
  filterTimer = setTimeout(() => {
    void loadHistory()
  }, 300)
}, { deep: true })

watch(perPage, () => {
  page.value = 1
})
</script>
