<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Định danh công ty">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Chọn công ty và cập nhật trạng thái định danh.
          </p>
          <button
            type="button"
            @click="store.fetchCompanies({ page: store.page, per_page: store.perPage })"
            class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Tải lại
          </button>
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
                  {{ company.daCapNhatDinhDanh ? 'Đã cập nhật định danh' : 'Chưa cập nhật định danh' }}
                </span>
                <button
                  type="button"
                  @click="toggleDinhDanh(company.id, !!company.daCapNhatDinhDanh)"
                  class="inline-flex h-9 items-center justify-center rounded-lg bg-brand-500 px-3 text-sm font-medium text-white transition hover:bg-brand-600"
                >
                  {{ company.daCapNhatDinhDanh ? 'Đặt chưa cập nhật' : 'Cập nhật định danh' }}
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
import { computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useCompaniesStore } from '@/stores/companies'

const store = useCompaniesStore()
const currentPageTitle = computed(() => 'Định danh công ty')

const toggleDinhDanh = async (id: number, currentStatus: boolean) => {
  await store.updateCompanyDinhDanh(id, !currentStatus)
}

onMounted(() => {
  store.fetchCompanies({ page: 1, per_page: 20 })
})
</script>

