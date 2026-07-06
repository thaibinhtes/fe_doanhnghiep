<template>
  <SearchableSelect
    :model-value="modelValue"
    :options="provinceOptions"
    :placeholder="placeholder"
    :search-placeholder="searchPlaceholder"
    :empty-label="emptyLabel"
    :disabled="disabled"
    :loading="loading"
    :dense="dense"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SearchableSelect, { type SearchableSelectOption } from './SearchableSelect.vue'
import { locationService } from '@/services/locationService'
import type { ProvinceItem } from '@/types/location'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    searchPlaceholder?: string
    emptyLabel?: string
    showCode?: boolean
    disabled?: boolean
    dense?: boolean
    autoSelectFirst?: boolean
    defaultCode?: string
  }>(),
  {
    placeholder: 'Chọn tỉnh/thành',
    searchPlaceholder: 'Tìm tỉnh/thành...',
    emptyLabel: 'Chọn tỉnh/thành',
    showCode: true,
    disabled: false,
    dense: false,
    autoSelectFirst: false,
    defaultCode: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const loading = ref(false)
const provinces = ref<ProvinceItem[]>([])

const provinceOptions = computed<SearchableSelectOption[]>(() =>
  provinces.value.map((province) => ({
    value: province.code,
    label: props.showCode ? `${province.code} - ${province.fullName}` : province.fullName,
    searchText: `${province.code} ${province.fullName}`,
  })),
)

onMounted(async () => {
  loading.value = true
  try {
    provinces.value = await locationService.getProvinces()
    const initialCode = props.modelValue
      || props.defaultCode
      || (props.autoSelectFirst && provinces.value[0] ? provinces.value[0].code : '')

    if (initialCode && initialCode !== props.modelValue) {
      emit('update:modelValue', initialCode)
    }
  } finally {
    loading.value = false
  }
})

defineExpose({
  get provinces() {
    return provinces.value
  },
})
</script>
