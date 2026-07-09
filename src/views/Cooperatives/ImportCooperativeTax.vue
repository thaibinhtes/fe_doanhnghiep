<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Import thuế hợp tác xã">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Upload file Excel để cập nhật danh sách hợp tác xã đóng thuế. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất.
        </p>
        <CooperativeTaxImportPanel :show-header="false" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import CooperativeTaxImportPanel from '@/components/cooperatives/CooperativeTaxImportPanel.vue'
</script>
