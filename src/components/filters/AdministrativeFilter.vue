<template>
  <div ref="rootRef" :class="rootClass">
    <div>
      <label v-if="!compact" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ provinceLabel }}
      </label>
      <ProvinceSelect
        ref="provinceSelectRef"
        v-model="localProvinceCode"
        :placeholder="provincePlaceholder"
        :search-placeholder="provinceSearchPlaceholder"
        :empty-label="provincePlaceholder"
        :show-code="showProvinceCode"
        :dense="compact && dense"
      />
    </div>
    <div>
      <label v-if="!compact" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ wardLabel }}
      </label>
      <WardSelect
        ref="wardSelectRef"
        v-model="localWardCode"
        :province-code="localProvinceCode"
        :placeholder="wardPlaceholder"
        :search-placeholder="wardSearchPlaceholder"
        :empty-label="wardPlaceholder"
        :dense="compact && dense"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ProvinceSelect from '@/components/forms/FormElements/ProvinceSelect.vue'
import WardSelect from '@/components/forms/FormElements/WardSelect.vue'

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
  dense?: boolean
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
  dense: false,
})

const rootClass = computed(() => {
  if (!props.compact) return 'grid gap-4 md:grid-cols-2'
  if (props.dense) return 'grid grid-cols-2 gap-1.5'
  return 'grid gap-2 md:grid-cols-2'
})

const emit = defineEmits<{
  (e: 'update:provinceCode', value: string): void
  (e: 'update:wardCode', value: string): void
  (e: 'change', payload: { provinceCode: string; wardCode: string; provinceName: string; wardName: string }): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const provinceSelectRef = ref<InstanceType<typeof ProvinceSelect> | null>(null)
const wardSelectRef = ref<InstanceType<typeof WardSelect> | null>(null)
const localProvinceCode = ref(props.provinceCode)
const localWardCode = ref(props.wardCode)

const emitChange = () => {
  const provinces = provinceSelectRef.value?.provinces ?? []
  const wards = wardSelectRef.value?.wards ?? []
  const province = provinces.find((item) => item.code === localProvinceCode.value)
  const ward = wards.find((item) => item.code === localWardCode.value)
  emit('change', {
    provinceCode: localProvinceCode.value,
    wardCode: localWardCode.value,
    provinceName: province?.fullName ?? '',
    wardName: ward?.fullName ?? '',
  })
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

watch(localProvinceCode, (value) => {
  emit('update:provinceCode', value)
  if (localWardCode.value) {
    localWardCode.value = ''
  }
  emitChange()
})

watch(localWardCode, (value) => {
  emit('update:wardCode', value)
  emitChange()
})

onMounted(() => {
  emitChange()
})
</script>
