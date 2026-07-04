<template>
  <div class="relative min-w-0" ref="rootRef">
    <button
      type="button"
      :disabled="disabled"
      @click="toggleDropdown"
      class="flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-left text-sm text-gray-800 shadow-theme-xs transition focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
      :class="dense ? 'h-9 px-3 py-2 text-sm' : ''"
    >
      <span
        class="min-w-0 flex-1 truncate"
        :class="selectedLabel ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-500'"
      >
        {{ selectedLabel || (loading ? 'Đang tải...' : placeholder) }}
      </span>
      <svg
        class="shrink-0 text-gray-500 transition dark:text-gray-400"
        :class="{ 'rotate-180': isOpen }"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 p-2 dark:border-gray-700">
          <input
            ref="searchInputRef"
            v-model="keyword"
            type="text"
            :placeholder="searchPlaceholder"
            class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            @click.stop
          />
        </div>
        <ul class="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
          <li v-if="allowEmpty">
            <button
              type="button"
              class="w-full px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              @click.stop="selectOption('')"
            >
              {{ emptyLabel }}
            </button>
          </li>
          <li
            v-if="loading"
            class="px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
          >
            Đang tải...
          </li>
          <li
            v-else-if="filteredOptions.length === 0"
            class="px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
          >
            {{ noResultsText }}
          </li>
          <li v-for="option in filteredOptions" :key="option.value">
            <button
              type="button"
              class="w-full px-3 py-2.5 text-left text-sm transition hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="
                option.value === modelValue
                  ? 'bg-gray-50 font-medium text-brand-600 dark:bg-white/[0.03] dark:text-brand-400'
                  : 'text-gray-800 dark:text-white/90'
              "
              @click.stop="selectOption(option.value)"
            >
              {{ option.label }}
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface SearchableSelectOption {
  value: string
  label: string
  searchText?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: SearchableSelectOption[]
    placeholder?: string
    searchPlaceholder?: string
    emptyLabel?: string
    noResultsText?: string
    disabled?: boolean
    loading?: boolean
    allowEmpty?: boolean
    dense?: boolean
  }>(),
  {
    placeholder: 'Chọn...',
    searchPlaceholder: 'Tìm kiếm...',
    emptyLabel: 'Bỏ chọn',
    noResultsText: 'Không tìm thấy kết quả',
    disabled: false,
    loading: false,
    allowEmpty: true,
    dense: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const rootRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const keyword = ref('')

const selectedLabel = computed(() => {
  if (!props.modelValue) return ''
  return props.options.find((option) => option.value === props.modelValue)?.label ?? props.modelValue
})

const filteredOptions = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return props.options

  return props.options.filter((option) => {
    const haystack = (option.searchText ?? `${option.label} ${option.value}`).toLowerCase()
    return haystack.includes(query)
  })
})

const toggleDropdown = async () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    keyword.value = ''
    await nextTick()
    searchInputRef.value?.focus()
  }
}

const selectOption = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
  keyword.value = ''
}

const handleClickOutside = (event: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      isOpen.value = false
    }
  },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
