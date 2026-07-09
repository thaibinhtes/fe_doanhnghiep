<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Import hợp tác xã">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Upload file Excel từ đơn vị. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất.
        </p>
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
