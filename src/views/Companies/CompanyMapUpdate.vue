<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Cập nhật tọa độ trên bản đồ">
        <div v-if="loading" class="flex h-[520px] items-center justify-center">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else-if="loadError" class="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {{ loadError }}
        </div>

        <template v-else-if="company">
          <div class="mb-4 space-y-3">
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ company.tenDoanhNghiep }}</h3>
              <p v-if="company.maSoDoanhNghiep" class="text-sm text-gray-500 dark:text-gray-400">
                MST: {{ company.maSoDoanhNghiep }}
              </p>
              <p v-if="company.diaChi && company.diaChi !== '-'" class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ company.diaChi }}
              </p>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400">
              Nhấn vào bản đồ hoặc kéo marker để chọn vị trí. Bạn cũng có thể dùng vị trí GPS hiện tại.
            </p>

            <div class="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60">
              <span class="text-gray-500 dark:text-gray-400">Tọa độ đã chọn:</span>
              <span v-if="selectedLat != null && selectedLong != null" class="font-medium text-gray-900 dark:text-white">
                lat {{ selectedLat.toFixed(6) }}, long {{ selectedLong.toFixed(6) }}
              </span>
              <span v-else class="italic text-gray-400">Chưa chọn — nhấn vào bản đồ</span>
            </div>

            <div v-if="geoError" class="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              {{ geoError }}
            </div>

            <div v-if="saveSuccess" class="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              Đã lưu tọa độ thành công.
            </div>

            <div v-if="saveError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {{ saveError }}
            </div>
          </div>

          <div
            ref="mapContainer"
            class="h-[480px] w-full rounded-lg border border-gray-200 dark:border-gray-700 sm:h-[520px] lg:h-[560px]"
          ></div>

          <div class="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <router-link
              to="/companies"
              class="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Quay lại danh sách
            </router-link>

            <div class="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                :disabled="locating"
                @click="useCurrentLocation"
                class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-brand-500 bg-white px-4 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:opacity-60 sm:w-auto dark:border-brand-400 dark:bg-gray-900 dark:text-brand-400 dark:hover:bg-brand-500/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06z" fill="currentColor"/>
                </svg>
                {{ locating ? 'Đang lấy vị trí...' : 'Vị trí hiện tại' }}
              </button>
              <button
                type="button"
                :disabled="saving || selectedLat == null || selectedLong == null"
                @click="saveCoordinates"
                class="inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {{ saving ? 'Đang lưu...' : 'Lưu tọa độ' }}
              </button>
            </div>
          </div>
        </template>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { defaultMarkerIcon, setupLeafletIcons } from '@/utils/leafletIcons'
import { companyService } from '@/services/companyService'
import type { Company } from '@/types/company'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const DEFAULT_CENTER: L.LatLngTuple = [16.0544, 108.2022]
const DEFAULT_ZOOM = 6
const SELECTED_ZOOM = 16

setupLeafletIcons()

const route = useRoute()
const currentPageTitle = 'Cập nhật tọa độ'

const mapContainer = ref<HTMLElement | null>(null)
const company = ref<Company | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)
const saving = ref(false)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)
const locating = ref(false)
const geoError = ref<string | null>(null)

const selectedLat = ref<number | null>(null)
const selectedLong = ref<number | null>(null)

let map: L.Map | null = null
let marker: L.Marker | null = null

function hasValidCoords(lat: number | null | undefined, lng: number | null | undefined): boolean {
  return lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)
}

function setMarkerPosition(lat: number, lng: number, pan = true) {
  selectedLat.value = lat
  selectedLong.value = lng
  saveSuccess.value = false

  if (!map) return

  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], { draggable: true, icon: defaultMarkerIcon }).addTo(map)
    marker.on('dragend', () => {
      const pos = marker!.getLatLng()
      selectedLat.value = pos.lat
      selectedLong.value = pos.lng
      saveSuccess.value = false
    })
  }

  if (pan) {
    map.setView([lat, lng], Math.max(map.getZoom(), SELECTED_ZOOM))
  }
}

function initMap() {
  if (!mapContainer.value || map) return

  const initialLat = hasValidCoords(company.value?.lat, company.value?.long)
    ? Number(company.value!.lat)
    : null
  const initialLng = hasValidCoords(company.value?.lat, company.value?.long)
    ? Number(company.value!.long)
    : null

  map = L.map(mapContainer.value, {
    center: initialLat != null && initialLng != null ? [initialLat, initialLng] : DEFAULT_CENTER,
    zoom: initialLat != null && initialLng != null ? SELECTED_ZOOM : DEFAULT_ZOOM,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  map.on('click', (e: L.LeafletMouseEvent) => {
    setMarkerPosition(e.latlng.lat, e.latlng.lng, false)
  })

  if (initialLat != null && initialLng != null) {
    setMarkerPosition(initialLat, initialLng, false)
  }

  setTimeout(() => {
    map?.invalidateSize()
  }, 100)
}

async function loadCompany() {
  loading.value = true
  loadError.value = null

  const id = Number(route.params.id)
  if (!id || Number.isNaN(id)) {
    loadError.value = 'Không tìm thấy doanh nghiệp'
    loading.value = false
    return
  }

  try {
    company.value = await companyService.getById(id)
  } catch (err: unknown) {
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    loadError.value = message || 'Không thể tải thông tin doanh nghiệp'
  } finally {
    loading.value = false
  }
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    geoError.value = 'Trình duyệt không hỗ trợ định vị GPS'
    return
  }

  locating.value = true
  geoError.value = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setMarkerPosition(position.coords.latitude, position.coords.longitude)
      locating.value = false
    },
    () => {
      geoError.value = 'Không thể lấy vị trí hiện tại. Vui lòng cho phép quyền định vị hoặc chọn thủ công trên bản đồ.'
      locating.value = false
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

async function saveCoordinates() {
  if (!company.value || selectedLat.value == null || selectedLong.value == null) return

  saving.value = true
  saveError.value = null
  saveSuccess.value = false

  try {
    const updated = await companyService.update(company.value.id, {
      long: selectedLong.value,
      lat: selectedLat.value,
    })
    company.value = updated
    saveSuccess.value = true
  } catch (err: unknown) {
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    saveError.value = message || 'Không thể lưu tọa độ'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadCompany()
  if (company.value) {
    await nextTick()
    initMap()
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
    marker = null
  }
})
</script>
