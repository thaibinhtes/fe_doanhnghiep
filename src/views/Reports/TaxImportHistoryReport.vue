<template>
  <AdminLayout>
    <div class="space-y-4">
      <ComponentCard title="Lịch sử import đơn vị thuế với trạng thái thuế">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Theo dõi các lần import đơn vị thuế và cập nhật tình trạng thuế (doanh nghiệp / hợp tác xã), kèm trạng thái từng bản ghi.
        </p>

        <TaxImportHistoryPanel />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import TaxImportHistoryPanel from '@/components/admin/TaxImportHistoryPanel.vue'
</script>
