<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Định danh công ty">
        <div class="mb-4 flex flex-col gap-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Chọn công ty và cập nhật trạng thái định danh.
          </p>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              v-model="search"
              type="text"
              placeholder="Tìm theo tên công ty hoặc MST..."
              class="dark:bg-dark-900 h-10 w-full lg:w-[200px] rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
            <select
              v-model="dinhDanhStatus"
              class="dark:bg-dark-900 h-10 rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">Tất cả trạng thái định danh</option>
              <option value="true">Đã định danh</option>
              <option value="false">Chưa định danh</option>
            </select>
            <button
              type="button"
              @click="handleSearch"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Tìm kiếm
            </button>
            <button
              type="button"
              @click="handleReset"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Đặt lại
            </button>
          </div>
        </div>

        <div v-if="store.loading" class="py-10 text-center text-sm text-gray-500">Đang tải...</div>
        <div v-else-if="store.error" class="py-10 text-center text-sm text-red-500">{{ store.error }}</div>
        <div v-else-if="store.companies.length === 0" class="py-10 text-center text-sm text-gray-400">
          Chưa có công ty nào
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="company in store.companies"
            :key="company.id"
            class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-w-0">
                <p class="truncate text-base font-semibold text-gray-900 dark:text-white/90">
                  {{ company.tenDoanhNghiep }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  MST: {{ company.maSoDoanhNghiep || '-' }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Người đại diện: {{ company.nguoiDaiDienTen || company.nguoiDaiDien?.fullName || '-' }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Số điện thoại: {{ company.dienThoai || '-' }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 break-words">
                  Địa chỉ: {{ company.diaChi || '-' }}
                </p>
              </div>
              <div class="flex flex-col items-start gap-2 sm:items-end">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    company.daCapNhatDinhDanh
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                  ]"
                >
                  {{ company.daCapNhatDinhDanh ? 'Đã đăng ký định danh' : 'Chưa đăng ký định danh' }}
                </span>
                <button
                  type="button"
                  @click="toggleDinhDanh(company.id, !!company.daCapNhatDinhDanh)"
                  :class="company.daCapNhatDinhDanh ? 'inline-flex h-9 items-center justify-center rounded-lg bg-red-500 px-3 text-sm font-medium text-white transition hover:bg-red-600' : 'inline-flex h-9 items-center justify-center rounded-lg bg-brand-500 px-3 text-sm font-medium text-white transition hover:bg-brand-600' "
                >
                  {{ company.daCapNhatDinhDanh ? 'Huỷ đăng ký định danh' : 'Đăng ký định danh' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useCompaniesStore } from '@/stores/companies'

const store = useCompaniesStore()
const currentPageTitle = computed(() => 'Định danh công ty')
const search = ref('')
const dinhDanhStatus = ref<'true' | 'false' | ''>('')

const buildFilters = () => ({
  page: 1,
  per_page: 20,
  ...(search.value.trim() ? { search: search.value.trim() } : {}),
  ...(dinhDanhStatus.value !== '' ? { daCapNhatDinhDanh: dinhDanhStatus.value === 'true' } : {}),
})

const toggleDinhDanh = async (id: number, currentStatus: boolean) => {
  await store.updateCompanyDinhDanh(id, !currentStatus)
}

const handleSearch = async () => {
  await store.fetchCompanies(buildFilters())
}

const handleReset = async () => {
  search.value = ''
  dinhDanhStatus.value = ''
  await store.fetchCompanies({ page: 1, per_page: 20 })
}

onMounted(() => {
  store.fetchCompanies({ page: 1, per_page: 20 })
})
</script>

