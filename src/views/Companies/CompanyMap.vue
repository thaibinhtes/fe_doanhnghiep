<template>
  <AdminLayout>
    <ComponentCard title="Bản đồ doanh nghiệp" hide-header className="!p-0 overflow-hidden" bodyClass="!p-0" slotClass="!p-0">
      <div v-if="error" class="absolute left-3 right-3 top-3 z-[1100] rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 shadow dark:bg-red-900/90 dark:text-red-300">
        {{ error }}
      </div>

      <div class="relative h-[calc(100vh-7.5rem)] min-h-[480px] w-full">
        <div
          v-if="loading && !mapReady"
          class="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-gray-900/70"
        >
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div ref="mapContainer" class="absolute inset-0 z-0"></div>

        <!-- Widget cố định trên bản đồ -->
        <div
          class="absolute left-3 top-3 z-[1000] flex w-[min(340px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-lg border border-gray-200/90 bg-white/95 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95"
        >
          <div class="shrink-0 space-y-2 p-2.5">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs text-gray-600 dark:text-gray-400">
                <span class="font-semibold text-gray-900 dark:text-white">{{ mappedCompanies.length }}</span> DN có tọa độ
              </p>
              <button
                type="button"
                class="inline-flex h-7 items-center rounded-md px-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                @click="listExpanded = !listExpanded"
              >
                {{ listExpanded ? 'Thu gọn' : 'Danh sách' }}
              </button>
            </div>

            <AdministrativeFilter
              v-model:provinceCode="filterProvinceCode"
              v-model:wardCode="filterWardCode"
              :hide-province="HIDE_PROVINCE_FILTER"
              :default-province-code="DEFAULT_PROVINCE_CODE"
              ward-label="Phường / Xã"
              ward-placeholder="Tất cả phường/xã"
              ward-search-placeholder="Tìm phường/xã..."
              compact
              dense
              @change="handleAdministrativeFilterChange"
            />

            <label class="sr-only" for="map-company-search">Tìm doanh nghiệp</label>
            <input
              id="map-company-search"
              v-model="sidebarSearch"
              type="search"
              placeholder="Tìm tên, MST, địa chỉ..."
              class="h-9 w-full rounded-md border border-gray-300 bg-white px-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>

          <div
            v-show="listExpanded"
            class="max-h-[min(320px,calc(100vh-16rem))] overflow-auto border-t border-gray-200 dark:border-gray-700"
          >
            <div v-if="loading" class="flex items-center justify-center py-8">
              <div class="h-6 w-6 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
            </div>

            <table v-else-if="filteredSidebarCompanies.length > 0" class="min-w-full text-xs">
              <thead class="sticky top-0 bg-gray-50 text-left uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th class="px-2.5 py-1.5">Tên DN</th>
                  <th class="px-2.5 py-1.5">MST</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="company in filteredSidebarCompanies"
                  :key="company.id"
                  class="cursor-pointer border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60"
                  :class="selectedCompanyId === company.id ? 'bg-brand-50 dark:bg-brand-500/10' : ''"
                  @click="focusCompany(company)"
                >
                  <td class="max-w-[160px] truncate px-2.5 py-2 font-medium text-gray-900 dark:text-white" :title="company.tenDoanhNghiep">
                    {{ company.tenDoanhNghiep }}
                  </td>
                  <td class="whitespace-nowrap px-2.5 py-2 text-gray-600 dark:text-gray-400">
                    {{ company.maSoDoanhNghiep || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="px-3 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
              <template v-if="mappedCompanies.length === 0">
                Chưa có DN có tọa độ.
                <span class="mt-1 block">Cập nhật bản đồ tại danh sách DN.</span>
              </template>
              <template v-else>
                Không tìm thấy kết quả
              </template>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { defaultMarkerIcon, setupLeafletIcons } from '@/utils/leafletIcons'
import { companyService } from '@/services/companyService'
import type { Company } from '@/types/company'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import AdministrativeFilter from '@/components/filters/AdministrativeFilter.vue'
import { DEFAULT_PROVINCE_CODE, HIDE_PROVINCE_FILTER } from '@/config/hanhChinh'
import { locationService } from '@/services/locationService'

const FOCUS_ZOOM = 16

setupLeafletIcons()

const mapContainer = ref<HTMLElement | null>(null)
const companies = ref<Company[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const mapReady = ref(false)
const sidebarSearch = ref('')
const selectedCompanyId = ref<number | null>(null)
const listExpanded = ref(true)
const filterProvinceCode = ref(DEFAULT_PROVINCE_CODE)
const filterWardCode = ref('')
const filterQuanHuyen = ref('')
const filterPhuongXa = ref('')

let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
const markersById = new Map<number, L.Marker>()

const mappedCompanies = computed(() =>
  companies.value.filter(
    (c) => c.lat != null && c.long != null && !Number.isNaN(c.lat) && !Number.isNaN(c.long),
  ),
)

const filteredSidebarCompanies = computed(() => {
  const q = sidebarSearch.value.trim().toLowerCase()
  if (!q) return mappedCompanies.value

  return mappedCompanies.value.filter((c) => {
    const haystack = [c.tenDoanhNghiep, c.maSoDoanhNghiep, c.diaChi, c.dienThoai]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
})

function buildPopup(company: Company): string {
  const parts = [
    `<strong>${company.tenDoanhNghiep}</strong>`,
    company.maSoDoanhNghiep ? `MST: ${company.maSoDoanhNghiep}` : '',
    company.diaChi && company.diaChi !== '-' ? `Địa chỉ: ${company.diaChi}` : '',
    company.dienThoai && company.dienThoai !== '-' ? `ĐT: ${company.dienThoai}` : '',
  ].filter(Boolean)

  return `<div class="text-sm leading-relaxed">${parts.join('<br/>')}</div>`
}

function renderMarkers() {
  if (!map) return

  if (markerLayer) {
    markerLayer.clearLayers()
  } else {
    markerLayer = L.layerGroup().addTo(map)
  }
  markersById.clear()

  const bounds: L.LatLngTuple[] = []

  mappedCompanies.value.forEach((company) => {
    const lat = Number(company.lat)
    const lng = Number(company.long)
    const marker = L.marker([lat, lng], { icon: defaultMarkerIcon }).bindPopup(buildPopup(company))
    marker.on('click', () => {
      selectedCompanyId.value = company.id
    })
    markerLayer!.addLayer(marker)
    markersById.set(company.id, marker)
    bounds.push([lat, lng])
  })

  if (bounds.length === 1) {
    map.setView(bounds[0], FOCUS_ZOOM)
    selectedCompanyId.value = mappedCompanies.value[0]?.id ?? null
  } else if (bounds.length > 1) {
    map.fitBounds(L.latLngBounds(bounds), { padding: [48, 48] })
  } else {
    map.setView([16.0544, 108.2022], 6)
  }
}

function focusCompany(company: Company) {
  if (!map || company.lat == null || company.long == null) return

  selectedCompanyId.value = company.id
  const lat = Number(company.lat)
  const lng = Number(company.long)

  map.flyTo([lat, lng], FOCUS_ZOOM, { duration: 0.8 })

  map.once('moveend', () => {
    markersById.get(company.id)?.openPopup()
  })
}

async function initMap() {
  await nextTick()
  if (!mapContainer.value) return

  if (!map) {
    map = L.map(mapContainer.value, {
      center: [16.0544, 108.2022],
      zoom: 6,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
  }

  renderMarkers()
  mapReady.value = true

  setTimeout(() => {
    map?.invalidateSize()
  }, 150)
}

async function loadCompanies() {
  loading.value = true
  error.value = null
  try {
    const response = await companyService.getAll({
      hasCoordinates: true,
      quanHuyen: filterQuanHuyen.value || undefined,
      phuongXa: filterPhuongXa.value || undefined,
      per_page: 500,
      page: 1,
    })
    companies.value = response.data
  } catch (err: unknown) {
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = message || 'Không thể tải dữ liệu bản đồ'
  } finally {
    loading.value = false
  }
}

const handleAdministrativeFilterChange = (payload: {
  provinceCode: string
  wardCode: string
  provinceName: string
  wardName: string
}) => {
  filterQuanHuyen.value = payload.provinceName
  filterPhuongXa.value = payload.wardName
}

onMounted(async () => {
  if (HIDE_PROVINCE_FILTER) {
    const provinces = await locationService.getProvinces()
    const province = provinces.find((item) => item.code === DEFAULT_PROVINCE_CODE)
    if (province) {
      filterQuanHuyen.value = province.fullName
    }
  }

  await loadCompanies()
  await initMap()
})

watch(mappedCompanies, () => {
  if (map) {
    renderMarkers()
  }
})

watch([filterQuanHuyen, filterPhuongXa], async () => {
  await loadCompanies()
  if (map) {
    renderMarkers()
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
    markerLayer = null
    markersById.clear()
  }
})
</script>
