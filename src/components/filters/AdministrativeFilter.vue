<template>
  <div ref="rootRef" :class="compact ? 'grid gap-2 md:grid-cols-2' : 'grid gap-4 md:grid-cols-2'">
    <div class="relative">
      <label v-if="!compact" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ provinceLabel }}
      </label>
      <button
        type="button"
        @click="toggleProvinceDropdown"
        :class="compact
          ? 'h-10 w-full rounded-lg border border-gray-300 px-3 text-left text-sm dark:border-gray-700 dark:bg-gray-900'
          : 'h-11 w-full rounded-lg border border-gray-300 px-4 text-left text-sm dark:border-gray-700 dark:bg-gray-900'"
      >
        <span class="block truncate text-gray-800 dark:text-gray-100">{{ selectedProvinceLabel }}</span>
      </button>
      <div
        v-if="provinceDropdownOpen"
        class="absolute z-40 mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      >
        <input
          ref="provinceSearchInputRef"
          v-model="provinceKeyword"
          type="text"
          :placeholder="provinceSearchPlaceholder"
          class="mb-2 h-9 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <ul class="max-h-52 overflow-auto text-sm">
          <li>
            <button
              type="button"
              @click="selectProvince('')"
              class="w-full rounded-md px-3 py-2 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {{ provincePlaceholder }}
            </button>
          </li>
          <li v-for="province in visibleProvinces" :key="province.code">
            <button
              type="button"
              @click="selectProvince(province.code)"
              class="w-full rounded-md px-3 py-2 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {{ showProvinceCode ? `${province.code} - ${province.fullName}` : province.fullName }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="relative">
      <label v-if="!compact" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ wardLabel }}
      </label>
      <button
        type="button"
        @click="toggleWardDropdown"
        :disabled="!localProvinceCode || loadingWards"
        :class="compact
          ? 'h-10 w-full rounded-lg border border-gray-300 px-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900'
          : 'h-11 w-full rounded-lg border border-gray-300 px-4 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900'"
      >
        <span class="block truncate text-gray-800 dark:text-gray-100">{{ selectedWardLabel }}</span>
      </button>
      <div
        v-if="wardDropdownOpen && localProvinceCode"
        class="absolute z-40 mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      >
        <input
          ref="wardSearchInputRef"
          v-model="wardKeyword"
          type="text"
          :placeholder="wardSearchPlaceholder"
          class="mb-2 h-9 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <ul class="max-h-52 overflow-auto text-sm">
          <li>
            <button
              type="button"
              @click="selectWard('')"
              class="w-full rounded-md px-3 py-2 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {{ wardPlaceholder }}
            </button>
          </li>
          <li v-for="ward in visibleWards" :key="ward.code">
            <button
              type="button"
              @click="selectWard(ward.code)"
              class="w-full rounded-md px-3 py-2 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {{ ward.fullName }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { locationService } from '@/services/locationService'
import type { ProvinceItem, WardItem } from '@/types/location'

const props = withDefaults(defineProps<{
  provinceCode?: string
  wardCode?: string
  provinceLabel?: string
  wardLabel?: string
  provincePlaceholder?: string
  wardPlaceholder?: string
  provinceSearchPlaceholder?: string
  wardSearchPlaceholder?: string
  showProvinceCode?: boolean
  compact?: boolean
}>(), {
  provinceCode: '',
  wardCode: '',
  provinceLabel: 'Tỉnh / Thành',
  wardLabel: 'Phường / Xã',
  provincePlaceholder: 'Tất cả tỉnh/thành',
  wardPlaceholder: 'Tất cả phường/xã',
  provinceSearchPlaceholder: 'Tìm tỉnh/thành...',
  wardSearchPlaceholder: 'Tìm phường/xã...',
  showProvinceCode: false,
  compact: false,
})

const emit = defineEmits<{
  (e: 'update:provinceCode', value: string): void
  (e: 'update:wardCode', value: string): void
  (e: 'change', payload: { provinceCode: string; wardCode: string; provinceName: string; wardName: string }): void
}>()

const localProvinceCode = ref(props.provinceCode)
const localWardCode = ref(props.wardCode)
const rootRef = ref<HTMLElement | null>(null)
const provinceKeyword = ref('')
const wardKeyword = ref('')
const provinceDropdownOpen = ref(false)
const wardDropdownOpen = ref(false)
const provinceSearchInputRef = ref<HTMLInputElement | null>(null)
const wardSearchInputRef = ref<HTMLInputElement | null>(null)
const provinces = ref<ProvinceItem[]>([])
const wards = ref<WardItem[]>([])
const loadingWards = ref(false)

const selectedProvinceLabel = computed(() => {
  if (!localProvinceCode.value) return props.provincePlaceholder
  const province = provinces.value.find((item) => item.code === localProvinceCode.value)
  if (!province) return props.provincePlaceholder
  return props.showProvinceCode ? `${province.code} - ${province.fullName}` : province.fullName
})

const selectedWardLabel = computed(() => {
  if (!localWardCode.value) return loadingWards.value ? 'Đang tải...' : props.wardPlaceholder
  const ward = wards.value.find((item) => item.code === localWardCode.value)
  return ward?.fullName ?? props.wardPlaceholder
})

const visibleProvinces = computed(() => {
  const keyword = provinceKeyword.value.trim().toLowerCase()
  if (!keyword) return provinces.value
  return provinces.value.filter((province) => province.fullName.toLowerCase().includes(keyword))
})

const visibleWards = computed(() => {
  const keyword = wardKeyword.value.trim().toLowerCase()
  if (!keyword) return wards.value
  return wards.value.filter((ward) => ward.fullName.toLowerCase().includes(keyword))
})

const emitChange = () => {
  const province = provinces.value.find((item) => item.code === localProvinceCode.value)
  const ward = wards.value.find((item) => item.code === localWardCode.value)
  emit('change', {
    provinceCode: localProvinceCode.value,
    wardCode: localWardCode.value,
    provinceName: province?.fullName ?? '',
    wardName: ward?.fullName ?? '',
  })
}

const loadProvinces = async () => {
  provinces.value = await locationService.getProvinces()
}

const loadWards = async () => {
  if (!localProvinceCode.value) {
    wards.value = []
    localWardCode.value = ''
    return
  }

  loadingWards.value = true
  try {
    wards.value = await locationService.getWardsByProvince(localProvinceCode.value)
    if (!wards.value.some((ward) => ward.code === localWardCode.value)) {
      localWardCode.value = ''
    }
  } finally {
    loadingWards.value = false
  }
}

const selectProvince = (code: string) => {
  localProvinceCode.value = code
  provinceDropdownOpen.value = false
}

const selectWard = (code: string) => {
  localWardCode.value = code
  wardDropdownOpen.value = false
}

const toggleProvinceDropdown = async () => {
  provinceDropdownOpen.value = !provinceDropdownOpen.value
  wardDropdownOpen.value = false
  if (provinceDropdownOpen.value) {
    await nextTick()
    provinceSearchInputRef.value?.focus()
  }
}

const toggleWardDropdown = async () => {
  if (!localProvinceCode.value || loadingWards.value) return
  wardDropdownOpen.value = !wardDropdownOpen.value
  provinceDropdownOpen.value = false
  if (wardDropdownOpen.value) {
    await nextTick()
    wardSearchInputRef.value?.focus()
  }
}

const onClickOutside = (event: MouseEvent) => {
  const target = event.target as Node | null
  if (!target || !rootRef.value) return
  if (!rootRef.value.contains(target)) {
    provinceDropdownOpen.value = false
    wardDropdownOpen.value = false
  }
}

watch(
  () => props.provinceCode,
  (value) => {
    localProvinceCode.value = value ?? ''
  },
)

watch(
  () => props.wardCode,
  (value) => {
    localWardCode.value = value ?? ''
  },
)

watch(localProvinceCode, async (value) => {
  emit('update:provinceCode', value)
  emit('update:wardCode', '')
  wardKeyword.value = ''
  await loadWards()
  emitChange()
})

watch(localWardCode, (value) => {
  emit('update:wardCode', value)
  emitChange()
})

onMounted(async () => {
  await loadProvinces()
  await loadWards()
  emitChange()
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
