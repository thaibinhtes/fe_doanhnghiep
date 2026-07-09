<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard title="Lịch sử import">
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Theo dõi các lần import doanh nghiệp và thuế doanh nghiệp.
        </p>

        <div class="mb-5 flex flex-wrap gap-2 border-b border-gray-200 pb-3 dark:border-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="rounded-lg px-4 py-2 text-sm font-medium transition"
            :class="
              activeTab === tab.key
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            "
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <CompanyImportHistoryPanel v-if="activeTab === 'companies'" embedded />
        <TaxImportHistoryPanel v-else fixed-type="company_tax" hide-type-filter />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import CompanyImportHistoryPanel from '@/components/companies/CompanyImportHistoryPanel.vue'
import TaxImportHistoryPanel from '@/components/admin/TaxImportHistoryPanel.vue'

const tabs = [
  { key: 'companies', label: 'Import doanh nghiệp' },
  { key: 'company_tax', label: 'Import thuế doanh nghiệp' },
] as const

const activeTab = ref<(typeof tabs)[number]['key']>('companies')
</script>
