<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Quản lý địa chính (ProvinceCode)" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Tra cứu mã tỉnh/thành và xã/phường">
        <div class="mb-5 grid gap-4 md:grid-cols-3">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tìm tỉnh/thành</label>
            <input
              v-model="provinceSearch"
              type="text"
              placeholder="Ví dụ: An Giang"
              class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">ProvinceCode</label>
            <select
              v-model="selectedProvinceCode"
              class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option disabled value="">Chọn tỉnh/thành</option>
              <option v-for="province in provinces" :key="province.code" :value="province.code">
                {{ province.code }} - {{ province.fullName }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tìm xã/phường</label>
            <input
              v-model="wardSearch"
              type="text"
              placeholder="Ví dụ: Long Xuyên"
              class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
        </div>

        <div class="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <p>
            Tỉnh/thành: <span class="font-semibold">{{ selectedProvinceLabel || '-' }}</span>
          </p>
          <p>Tổng xã/phường: <span class="font-semibold">{{ wards.length }}</span></p>
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
              <tr v-for="ward in wards" :key="ward.code">
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.code }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.fullName }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ ward.tinhThanhCode }}</td>
              </tr>
              <tr v-if="wards.length === 0">
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
import { locationService } from '@/services/locationService'
import type { ProvinceItem, WardItem } from '@/types/location'

const loading = ref(true)
const provinceSearch = ref('')
const wardSearch = ref('')
const provinces = ref<ProvinceItem[]>([])
const wards = ref<WardItem[]>([])
const selectedProvinceCode = ref('')

const selectedProvinceLabel = computed(() => {
  const province = provinces.value.find((item) => item.code === selectedProvinceCode.value)
  return province ? `${province.code} - ${province.fullName}` : ''
})

const loadProvinces = async () => {
  provinces.value = await locationService.getProvinces(provinceSearch.value.trim())

  if (!selectedProvinceCode.value && provinces.value.length > 0) {
    selectedProvinceCode.value = provinces.value[0].code
  }

  if (selectedProvinceCode.value && !provinces.value.some((p) => p.code === selectedProvinceCode.value)) {
    selectedProvinceCode.value = provinces.value[0]?.code ?? ''
  }
}

const loadWards = async () => {
  if (!selectedProvinceCode.value) {
    wards.value = []
    return
  }

  wards.value = await locationService.getWardsByProvince(selectedProvinceCode.value, wardSearch.value.trim())
}

const loadAll = async () => {
  loading.value = true
  try {
    await loadProvinces()
    await loadWards()
  } finally {
    loading.value = false
  }
}

let provinceDebounce: ReturnType<typeof setTimeout> | null = null
watch(provinceSearch, () => {
  if (provinceDebounce) clearTimeout(provinceDebounce)
  provinceDebounce = setTimeout(() => {
    loadAll()
  }, 300)
})

let wardDebounce: ReturnType<typeof setTimeout> | null = null
watch(wardSearch, () => {
  if (wardDebounce) clearTimeout(wardDebounce)
  wardDebounce = setTimeout(() => {
    loadWards()
  }, 300)
})

watch(selectedProvinceCode, () => {
  loadWards()
})

onMounted(loadAll)
</script>
