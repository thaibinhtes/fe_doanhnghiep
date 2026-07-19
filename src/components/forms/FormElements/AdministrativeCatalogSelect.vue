<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="flex h-11 w-full items-center gap-2 rounded-lg border border-gray-300 bg-transparent px-4 text-left text-sm text-gray-800 shadow-theme-xs transition focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
      @click="toggle"
    >
      <span class="min-w-0 flex-1 truncate" :class="{ 'text-gray-400': !modelValue }">
        {{ modelValue || placeholder }}
      </span>
      <svg class="shrink-0 transition" :class="{ 'rotate-180': open }" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="border-b border-gray-100 p-2 dark:border-gray-800">
        <input
          ref="searchRef"
          v-model="search"
          type="search"
          :placeholder="`Tìm ${label.toLowerCase()}...`"
          class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"
          @click.stop
        />
      </div>

      <div class="max-h-60 overflow-y-auto">
        <p v-if="loading" class="px-3 py-4 text-sm text-gray-500">Đang tìm...</p>
        <template v-else>
          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="flex w-full items-start justify-between gap-3 border-b border-gray-100 px-3 py-2.5 text-left text-sm transition last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            @click="selectItem(item)"
          >
            <span class="min-w-0">
              <span class="block font-medium text-gray-800 dark:text-white/90">{{ item.ten }}</span>
              <span v-if="parentName(item)" class="mt-0.5 block truncate text-xs text-gray-500">
                {{ parentName(item) }}
              </span>
            </span>
            <span v-if="selectedId === item.id" class="shrink-0 text-xs font-semibold text-brand-500">Đã chọn</span>
          </button>

          <button
            v-if="canCreate"
            type="button"
            class="flex w-full items-center gap-2 border-t border-gray-100 px-3 py-3 text-left text-sm font-semibold text-brand-600 transition hover:bg-brand-50 disabled:opacity-50 dark:border-gray-800 dark:text-brand-400 dark:hover:bg-brand-500/10"
            :disabled="creating"
            @click="createItem"
          >
            <span class="flex h-5 w-5 items-center justify-center rounded border border-current">+</span>
            {{ creating ? 'Đang tạo...' : `Không tìm thấy — Tạo mới “${normalizedSearch}”` }}
          </button>

          <p v-if="items.length === 0 && !canCreate" class="px-3 py-4 text-sm text-gray-500">
            Nhập tên để tìm hoặc tạo mới.
          </p>
        </template>
      </div>

      <p v-if="error" class="border-t border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { hanhChinhService } from '@/services/hanhChinhService'
import type {
  HanhChinhDanhMucCap,
  HanhChinhDanhMucItem,
  HanhChinhDanhMucLoai,
} from '@/types/hanhChinh'

const props = withDefaults(defineProps<{
  modelValue: string | null
  selectedId?: number | null
  cap: HanhChinhDanhMucCap
  loai: HanhChinhDanhMucLoai
  parentId?: number | null
  label: string
  placeholder?: string
}>(), {
  selectedId: null,
  parentId: null,
  placeholder: 'Chọn đơn vị hành chính',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:selectedId': [value: number | null]
}>()

const rootRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const open = ref(false)
const search = ref('')
const loading = ref(false)
const creating = ref(false)
const error = ref('')
const items = ref<HanhChinhDanhMucItem[]>([])
let timer: ReturnType<typeof setTimeout> | null = null

const normalizedSearch = computed(() => search.value.trim())
const exactMatch = computed(() =>
  items.value.some((item) => item.ten.trim().toLocaleLowerCase('vi') === normalizedSearch.value.toLocaleLowerCase('vi')),
)
const canCreate = computed(() =>
  normalizedSearch.value.length > 0 && !exactMatch.value,
)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await hanhChinhService.getDanhMuc({
      cap: props.cap,
      loai: props.loai,
      search: normalizedSearch.value,
      perPage: 50,
      tinhId: props.cap === 'quan-huyen' ? props.parentId ?? undefined : undefined,
      quanHuyenId: props.cap === 'phuong-xa' ? props.parentId ?? undefined : undefined,
    })
    items.value = response.data
  } catch {
    error.value = 'Không tải được danh mục hành chính.'
  } finally {
    loading.value = false
  }
}

const toggle = async () => {
  open.value = !open.value
  if (!open.value) return
  search.value = props.modelValue ?? ''
  await load()
  await nextTick()
  searchRef.value?.focus()
  searchRef.value?.select()
}

const selectItem = (item: HanhChinhDanhMucItem) => {
  emit('update:modelValue', item.ten)
  emit('update:selectedId', item.id)
  open.value = false
}

const createItem = async () => {
  if (!canCreate.value) return
  creating.value = true
  error.value = ''
  try {
    const item = await hanhChinhService.createDanhMuc({
      cap: props.cap,
      loai: props.loai,
      ten: normalizedSearch.value,
      parentId: props.parentId,
    })
    selectItem(item)
  } catch {
    error.value = 'Không thể tạo đơn vị hành chính này.'
  } finally {
    creating.value = false
  }
}

const parentName = (item: HanhChinhDanhMucItem) =>
  item.quanHuyen?.ten ?? item.tinh?.ten ?? ''

watch(search, () => {
  if (!open.value) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(load, 250)
})

watch(() => props.parentId, (current, previous) => {
  if (previous !== undefined && current !== previous) {
    emit('update:modelValue', '')
    emit('update:selectedId', null)
    open.value = false
  }
})

const closeOutside = (event: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', closeOutside))
onBeforeUnmount(() => {
  document.removeEventListener('click', closeOutside)
  if (timer) clearTimeout(timer)
})
</script>
