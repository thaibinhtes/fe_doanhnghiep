<template>
  <div class="relative min-w-0" ref="rootRef">
    <div
      @click="toggleDropdown"
      class="dark:bg-dark-900 flex h-11 w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
    >
      <span v-if="selectedItems.length === 0" class="min-w-0 flex-1 truncate text-gray-400">
        {{ placeholder }}
      </span>
      <div
        v-else
        class="min-w-0 flex-1 overflow-hidden"
        :class="multiple ? 'flex flex-wrap items-center gap-2' : ''"
      >
        <div
          v-for="item in selectedItems"
          :key="item.ma"
          class="group flex min-w-0 items-center overflow-hidden rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
          :class="[
            multiple ? 'max-w-[calc(100%-0.25rem)] pr-2' : 'w-full pr-2',
          ]"
        >
          <span
            class="block min-w-0 truncate"
            :title="formatLabel(item)"
          >{{ formatLabel(item) }}</span>
          <button
            v-if="multiple"
            type="button"
            @click.stop="removeCode(item.ma)"
            class="ml-1 shrink-0 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400"
            aria-label="Xóa ngành nghề"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      <svg
        class="shrink-0"
        :class="{ 'transform rotate-180': isOpen }"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

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
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo mã hoặc tên ngành nghề..."
            class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            @click.stop
          />
        </div>
        <ul class="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
          <li v-if="loading" class="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
            Đang tải...
          </li>
          <li
            v-else-if="options.length === 0"
            class="px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
          >
            Không tìm thấy ngành nghề
          </li>
          <li
            v-for="item in options"
            :key="item.ma"
            @click.stop="selectItem(item)"
            class="cursor-pointer px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            :class="{ 'bg-gray-50 dark:bg-white/[0.03]': isSelected(item.ma) }"
          >
            <div class="flex min-w-0 items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <span class="font-medium text-gray-900 dark:text-white/90">{{ item.ma }}</span>
                <span class="text-gray-600 dark:text-gray-400"> — {{ item.ten }}</span>
              </div>
              <span
                v-if="isSelected(item.ma)"
                class="shrink-0 text-xs font-medium text-brand-500"
              >
                Đã chọn
              </span>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { industryCategoryService } from '@/services/industryCategoryService'
import type { IndustryCategory } from '@/types/industryCategory'

const props = withDefaults(
  defineProps<{
    modelValue: string | string[] | null
    multiple?: boolean
    placeholder?: string
  }>(),
  {
    multiple: false,
    placeholder: 'Chọn ngành nghề...',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
}>()

const rootRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const loading = ref(false)
const options = ref<IndustryCategory[]>([])
const selectedCatalog = ref<Record<string, IndustryCategory>>({})
let searchTimer: ReturnType<typeof setTimeout> | null = null

const selectedCodes = computed<string[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue ? [props.modelValue as string] : []
})

const selectedItems = computed(() =>
  selectedCodes.value.map((code) => selectedCatalog.value[code] ?? { ma: code, ten: code } as IndustryCategory),
)

const formatLabel = (item: IndustryCategory) => `${item.ma} — ${item.ten}`

const isSelected = (code: string) => selectedCodes.value.includes(code)

const emitValue = (codes: string[]) => {
  if (props.multiple) {
    emit('update:modelValue', codes)
    return
  }
  emit('update:modelValue', codes[0] ?? null)
}

const mergeCatalog = (items: IndustryCategory[]) => {
  items.forEach((item) => {
    selectedCatalog.value[item.ma] = item
  })
}

const loadSelectedCatalog = async (codes: string[]) => {
  const missing = codes.filter((code) => !selectedCatalog.value[code]?.ten || selectedCatalog.value[code].ten === code)
  if (missing.length === 0) return

  const items = await industryCategoryService.getByCodes(missing)
  mergeCatalog(items)
}

const fetchOptions = async (search: string) => {
  loading.value = true
  try {
    const response = await industryCategoryService.getList({
      search: search.trim() || undefined,
      isActive: true,
      perPage: 30,
    })
    options.value = response.data
    mergeCatalog(response.data)
  } finally {
    loading.value = false
  }
}

const scheduleSearch = (search: string) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    void fetchOptions(search)
  }, 300)
}

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await fetchOptions(searchQuery.value)
    await nextTick()
    searchInputRef.value?.focus()
  }
}

const selectItem = (item: IndustryCategory) => {
  mergeCatalog([item])

  if (props.multiple) {
    const next = isSelected(item.ma)
      ? selectedCodes.value.filter((code) => code !== item.ma)
      : [...selectedCodes.value, item.ma]
    emitValue(next)
    return
  }

  emitValue([item.ma])
  isOpen.value = false
}

const removeCode = (code: string) => {
  emitValue(selectedCodes.value.filter((item) => item !== code))
}

const handleClickOutside = (event: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

watch(searchQuery, (value) => {
  if (isOpen.value) scheduleSearch(value)
})

watch(
  () => props.modelValue,
  (value) => {
    const codes = props.multiple
      ? (Array.isArray(value) ? value : [])
      : (value ? [value as string] : [])
    void loadSelectedCatalog(codes)
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchTimer) clearTimeout(searchTimer)
})
</script>
