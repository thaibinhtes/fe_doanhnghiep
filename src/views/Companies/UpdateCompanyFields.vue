<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Cập nhật field từ Excel">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Upload Excel để cập nhật hàng loạt field doanh nghiệp theo ánh xạ cột. Chỉ cập nhật bản ghi đã tồn tại trong phạm vi đơn vị của bạn.
        </p>
        <CompanyFieldUpdatePanel :show-header="false" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import CompanyFieldUpdatePanel from '@/components/companies/CompanyFieldUpdatePanel.vue'
</script>
