<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Import doanh nghiệp">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Upload file Excel từ đơn vị. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất.
        </p>
        <CompanyImportPanel :show-header="false" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import CompanyImportPanel from '@/components/companies/CompanyImportPanel.vue'
</script>
