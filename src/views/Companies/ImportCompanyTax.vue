<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Import thuế doanh nghiệp">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Upload file Excel để cập nhật danh sách doanh nghiệp đóng thuế. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất.
        </p>
        <CompanyTaxImportPanel :show-header="false" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import CompanyTaxImportPanel from '@/components/companies/CompanyTaxImportPanel.vue'
</script>
