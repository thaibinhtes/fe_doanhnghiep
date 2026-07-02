<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Bản đồ doanh nghiệp">
        <div class="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <AdministrativeFilter
            v-model:provinceCode="filterProvinceCode"
            v-model:wardCode="filterWardCode"
            province-placeholder="Tất cả tỉnh/thành"
            ward-placeholder="Tất cả phường/xã"
            @change="handleAdministrativeFilterChange"
          />
        </div>

        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị <span class="font-medium text-gray-900 dark:text-white">{{ mappedCompanies.length }}</span>
            doanh nghiệp có tọa độ trên bản đồ
          </p>
          <router-link
            to="/companies"
            class="inline-flex h-10 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Quay lại danh sách
          </router-link>
        </div>

        <div v-if="loading" class="flex h-[480px] items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {{ error }}
        </div>

        <div v-else-if="mappedCompanies.length === 0" class="flex h-[480px] items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Chưa có doanh nghiệp nào có tọa độ. Vui lòng bấm <strong>Cập nhật bản đồ</strong> tại danh sách doanh nghiệp để chọn vị trí.
          </p>
        </div>

        <div
          v-show="!loading && mappedCompanies.length > 0"
          class="flex flex-col gap-4 lg:flex-row lg:items-stretch"
        >
          <!-- Sidebar danh sách doanh nghiệp -->
          <aside
            v-show="isSidebarOpen"
            class="flex w-full flex-col rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 lg:w-80 lg:shrink-0"
          >
            <div class="border-b border-gray-200 p-3 dark:border-gray-700">
              <div class="mb-2 flex items-center justify-between gap-2">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Danh sách doanh nghiệp</h3>
                <button
                  type="button"
                  @click="toggleSidebar"
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  title="Ẩn danh sách"
                  aria-label="Ẩn danh sách doanh nghiệp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <label class="sr-only" for="map-company-search">Tìm doanh nghiệp</label>
              <input
                id="map-company-search"
                v-model="sidebarSearch"
                type="text"
                placeholder="Tìm tên, MST, địa chỉ..."
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ filteredSidebarCompanies.length }} / {{ mappedCompanies.length }} doanh nghiệp
              </p>
            </div>

            <ul class="max-h-[280px] flex-1 overflow-y-auto p-2 lg:max-h-[640px]">
              <li v-for="company in filteredSidebarCompanies" :key="company.id">
                <button
                  type="button"
                  @click="focusCompany(company)"
                  :class="[
                    'w-full rounded-lg px-3 py-2.5 text-left transition',
                    selectedCompanyId === company.id
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-gray-800 hover:bg-white dark:text-gray-200 dark:hover:bg-gray-800',
                  ]"
                >
                  <p class="truncate text-sm font-medium">{{ company.tenDoanhNghiep }}</p>
                  <p
                    v-if="company.maSoDoanhNghiep"
                    :class="[
                      'mt-0.5 truncate text-xs',
                      selectedCompanyId === company.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400',
                    ]"
                  >
                    MST: {{ company.maSoDoanhNghiep }}
                  </p>
                  <p
                    v-if="company.diaChi && company.diaChi !== '-'"
                    :class="[
                      'mt-1 line-clamp-2 text-xs leading-relaxed',
                      selectedCompanyId === company.id ? 'text-white/75' : 'text-gray-500 dark:text-gray-400',
                    ]"
                  >
                    {{ company.diaChi }}
                  </p>
                </button>
              </li>
              <li
                v-if="filteredSidebarCompanies.length === 0"
                class="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                Không tìm thấy doanh nghiệp phù hợp
              </li>
            </ul>
          </aside>

          <!-- Bản đồ -->
          <div class="relative min-w-0 flex-1">
            <button
              v-show="!isSidebarOpen"
              type="button"
              @click="toggleSidebar"
              class="absolute right-3 top-3 z-[1000] inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-md transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Hiện danh sách
            </button>
            <div
              ref="mapContainer"
              class="min-h-[480px] w-full rounded-lg border border-gray-200 dark:border-gray-700 sm:min-h-[560px] lg:min-h-[640px]"
            ></div>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { defaultMarkerIcon, setupLeafletIcons } from '@/utils/leafletIcons'
import { companyService } from '@/services/companyService'
import type { Company } from '@/types/company'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import AdministrativeFilter from '@/components/filters/AdministrativeFilter.vue'

const FOCUS_ZOOM = 16

const currentPageTitle = 'Bản đồ doanh nghiệp'

setupLeafletIcons()

const mapContainer = ref<HTMLElement | null>(null)
const companies = ref<Company[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const sidebarSearch = ref('')
const selectedCompanyId = ref<number | null>(null)
const isSidebarOpen = ref(true)
const filterProvinceCode = ref('')
const filterWardCode = ref('')
const filterQuanHuyen = ref('')
const filterPhuongXa = ref('')

let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
const markersById = new Map<number, L.Marker>()

const mappedCompanies = computed(() =>
  companies.value.filter(
    (c) => c.lat != null && c.long != null && !Number.isNaN(c.lat) && !Number.isNaN(c.long)
  )
)

const filteredSidebarCompanies = computed(() => {
  const q = sidebarSearch.value.trim().toLowerCase()
  if (!q) return mappedCompanies.value

  return mappedCompanies.value.filter((c) => {
    const haystack = [
      c.tenDoanhNghiep,
      c.maSoDoanhNghiep,
      c.diaChi,
      c.dienThoai,
    ]
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
    map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] })
  } else {
    map.setView([16.0544, 108.2022], 6)
  }
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
  nextTick(() => {
    setTimeout(() => map?.invalidateSize(), 150)
  })
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
  if (!mapContainer.value || map) return

  map = L.map(mapContainer.value, {
    center: [16.0544, 108.2022],
    zoom: 6,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  renderMarkers()

  setTimeout(() => {
    map?.invalidateSize()
  }, 100)
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
  await loadCompanies()
  if (mappedCompanies.value.length > 0) {
    await initMap()
  }
})

watch(mappedCompanies, async (list) => {
  if (list.length === 0) return
  if (!map) {
    await initMap()
  } else {
    renderMarkers()
  }
})

watch([filterQuanHuyen, filterPhuongXa], async () => {
  await loadCompanies()
  if (!map && mappedCompanies.value.length > 0) {
    await initMap()
    return
  }
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
