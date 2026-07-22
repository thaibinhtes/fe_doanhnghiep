<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard
        title="Import hợp tác xã"
        desc="Upload file Excel từ đơn vị. Import chạy nền trên queue HTX — bạn sẽ nhận thông báo khi hoàn tất."
      >
        <template #header-right>
          <router-link
            to="/cooperatives/import-history"
            class="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4.167 5.833h11.666M4.167 10h11.666M4.167 14.167H10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            Lịch sử import
          </router-link>
        </template>

        <CooperativeImportPanel :show-header="false" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import CooperativeImportPanel from '@/components/cooperatives/CooperativeImportPanel.vue'
</script>
