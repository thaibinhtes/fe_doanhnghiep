<template>
  <SearchableSelect
    :model-value="modelValue"
    :options="wardOptions"
    :placeholder="placeholder"
    :search-placeholder="searchPlaceholder"
    :empty-label="emptyLabel"
    :disabled="disabled || !provinceCode"
    :loading="loading"
    :dense="dense"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SearchableSelect, { type SearchableSelectOption } from './SearchableSelect.vue'
import { locationService } from '@/services/locationService'
import type { WardItem } from '@/types/location'

const props = withDefaults(
  defineProps<{
    modelValue: string
    provinceCode?: string
    placeholder?: string
    searchPlaceholder?: string
    emptyLabel?: string
    disabled?: boolean
    dense?: boolean
  }>(),
  {
    provinceCode: '',
    placeholder: 'Chọn xã/phường',
    searchPlaceholder: 'Tìm phường/xã...',
    emptyLabel: 'Chọn xã/phường',
    disabled: false,
    dense: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const loading = ref(false)
const wards = ref<WardItem[]>([])

const wardOptions = computed<SearchableSelectOption[]>(() =>
  wards.value.map((ward) => ({
    value: ward.code,
    label: ward.fullName,
    searchText: `${ward.code} ${ward.fullName}`,
  })),
)

const loadWards = async () => {
  if (!props.provinceCode) {
    wards.value = []
    if (props.modelValue) {
      emit('update:modelValue', '')
    }
    return
  }

  loading.value = true
  try {
    wards.value = await locationService.getWardsByProvince(props.provinceCode)
    if (props.modelValue && !wards.value.some((ward) => ward.code === props.modelValue)) {
      emit('update:modelValue', '')
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => props.provinceCode,
  () => {
    void loadWards()
  },
  { immediate: true },
)

defineExpose({
  get wards() {
    return wards.value
  },
})
</script>
