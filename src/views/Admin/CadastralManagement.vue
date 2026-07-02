<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Quản lý địa chính (ProvinceCode)" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Tra cứu mã tỉnh/thành và xã/phường">
        <div class="mb-5">
          <AdministrativeFilter
            v-model:provinceCode="selectedProvinceCode"
            v-model:wardCode="selectedWardCode"
            province-label="ProvinceCode"
            ward-label="Mã xã/phường"
            province-placeholder="Chọn tỉnh/thành"
            ward-placeholder="Tất cả xã/phường"
            :show-province-code="true"
            @change="handleAdministrativeFilterChange"
          />
        </div>

        <div class="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <p>
            Tỉnh/thành: <span class="font-semibold">{{ selectedProvinceLabel || '-' }}</span>
          </p>
          <p>Tổng xã/phường: <span class="font-semibold">{{ displayedWards.length }}</span></p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-10">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[700px] w-full border-collapse text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Mã xã/phường</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Tên xã/phường</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">ProvinceCode</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ward in displayedWards" :key="ward.code">
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.code }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.fullName }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.tinhThanhCode }}</td>
              </tr>
              <tr v-if="displayedWards.length === 0">
                <td colspan="3" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Không có dữ liệu xã/phường.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import AdministrativeFilter from '@/components/filters/AdministrativeFilter.vue'
import { locationService } from '@/services/locationService'
import type { WardItem } from '@/types/location'

const loading = ref(true)
const wards = ref<WardItem[]>([])
const selectedProvinceCode = ref('')
const selectedWardCode = ref('')
const selectedProvinceName = ref('')

const selectedProvinceLabel = computed(() => {
  return selectedProvinceCode.value && selectedProvinceName.value
    ? `${selectedProvinceCode.value} - ${selectedProvinceName.value}`
    : ''
})

const loadWards = async () => {
  if (!selectedProvinceCode.value) {
    wards.value = []
    return
  }

  wards.value = await locationService.getWardsByProvince(selectedProvinceCode.value)
}

const loadAll = async () => {
  loading.value = true
  try {
    await loadWards()
  } finally {
    loading.value = false
  }
}

const displayedWards = computed(() => {
  if (!selectedWardCode.value) return wards.value
  return wards.value.filter((ward) => ward.code === selectedWardCode.value)
})

const handleAdministrativeFilterChange = (payload: {
  provinceCode: string
  wardCode: string
  provinceName: string
  wardName: string
}) => {
  selectedProvinceName.value = payload.provinceName
}

watch(selectedProvinceCode, () => {
  loadAll()
})

onMounted(loadAll)
</script>
