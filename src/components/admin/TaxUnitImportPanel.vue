<template>
  <div class="space-y-4">
    <div v-if="showHeader" class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
          Import đơn vị thuế
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ánh xạ cột Excel → trường đơn vị thuế, xem trước rồi mới import (chạy nền).
        </p>
      </div>
      <button
        v-if="showClose"
        type="button"
        class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        @click="emit('close')"
      >
        <span class="sr-only">Đóng</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <ImportLoadingSkeleton
      v-if="dispatching"
      title="Đang khởi tạo import đơn vị thuế..."
      subtitle="Đang đưa file vào hàng đợi xử lý."
    />

    <template v-else>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="md:col-span-2">
          <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">File Excel</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
            @change="onFileChange"
          />
          <p v-if="selectedFile" class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ selectedFile.name }}</p>
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Hàng bắt đầu đọc dữ liệu
          </label>
          <input
            v-model.number="startRow"
            type="number"
            min="1"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
          <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Bỏ qua hàng tiêu đề phía trên.</p>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-gray-800 dark:text-gray-100"
          @click="showColumnMap = !showColumnMap"
        >
          <span>Cấu hình ánh xạ cột Excel → trường đơn vị thuế</span>
          <span class="text-xs text-brand-600 dark:text-brand-400">
            {{ showColumnMap ? 'Thu gọn' : 'Mở rộng' }}
          </span>
        </button>
        <div v-if="showColumnMap" class="border-t border-gray-200 p-3 dark:border-gray-700">
          <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Nhập chữ cột Excel (VD: <span class="font-mono">A</span>, <span class="font-mono">B</span>, hoặc
            <span class="font-mono">B,C</span>).
          </p>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div
              v-for="(label, key) in columnLabels"
              :key="key"
              class="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700"
            >
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                {{ label }}
                <span class="ml-1 font-normal text-gray-400">({{ key }})</span>
              </label>
              <input
                v-model="columnInputs[key]"
                type="text"
                class="w-full rounded border border-gray-300 px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
                placeholder="VD: B"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedFile"
        class="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-900/40"
      >
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Số dòng xem trước
          </label>
          <select
            v-model.number="previewLimit"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option :value="3">3</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </div>
        <p class="pb-2 text-xs text-gray-500 dark:text-gray-400">
          Kiểm tra ánh xạ cột trước khi nhập — không ghi dữ liệu vào hệ thống.
        </p>
      </div>

      <div
        v-if="previewing"
        class="rounded-lg border border-brand-200 bg-brand-50/50 px-4 py-3 text-sm text-brand-800 dark:border-brand-800 dark:bg-brand-950/30 dark:text-brand-200"
      >
        Đang đọc file và ánh xạ cột...
      </div>

      <div
        v-if="previewResult && !previewing"
        class="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
      >
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Xem trước ánh xạ cột</p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Hàng bắt đầu {{ previewResult.startRow }} ·
              {{ previewResult.previewCount }}/{{ previewResult.limit }} dòng ·
              File có {{ previewResult.highestRow }} hàng
            </p>
          </div>
          <button
            type="button"
            class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
            @click="previewResult = null; expandedPreviewRow = null"
          >
            Đóng preview
          </button>
        </div>

        <div
          v-if="previewResult.previewCount === 0"
          class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
        >
          Không đọc được dòng dữ liệu nào từ hàng {{ previewResult.startRow }}. Kiểm tra lại hàng bắt đầu hoặc ánh xạ cột.
        </div>

        <div
          v-for="row in previewResult.rows"
          :key="row.excelRow"
          class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 bg-white px-3 py-2.5 text-left hover:bg-gray-50 dark:bg-gray-900/50 dark:hover:bg-gray-800/60"
            @click="expandedPreviewRow = expandedPreviewRow === row.excelRow ? null : row.excelRow"
          >
            <div class="min-w-0">
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Excel hàng {{ row.excelRow }}
              </p>
              <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                <span v-if="row.unitCode">{{ row.unitCode }}</span>
                <span v-else class="text-amber-600 dark:text-amber-400">Thiếu mã đơn vị</span>
                <span class="text-gray-400"> · </span>
                <span>{{ row.unitName || '—' }}</span>
              </p>
            </div>
            <span class="shrink-0 text-xs text-brand-600 dark:text-brand-400">
              {{ expandedPreviewRow === row.excelRow ? 'Thu gọn' : 'Chi tiết cột' }}
            </span>
          </button>

          <div
            v-if="expandedPreviewRow === row.excelRow"
            class="overflow-x-auto border-t border-gray-200 dark:border-gray-700"
          >
            <table class="min-w-full text-left text-xs">
              <thead class="bg-gray-50 text-gray-500 dark:bg-gray-800/80 dark:text-gray-400">
                <tr>
                  <th class="whitespace-nowrap px-3 py-2 font-medium">Trường</th>
                  <th class="whitespace-nowrap px-3 py-2 font-medium">Cột</th>
                  <th class="whitespace-nowrap px-3 py-2 font-medium">Giá trị thô (Excel)</th>
                  <th class="whitespace-nowrap px-3 py-2 font-medium">Giá trị map</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="field in row.fields"
                  :key="field.field"
                  class="bg-white dark:bg-gray-900/40"
                >
                  <td class="px-3 py-2 text-gray-700 dark:text-gray-300">
                    <span class="font-medium">{{ field.label }}</span>
                    <span class="ml-1 text-gray-400">({{ field.field }})</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-2 font-mono text-brand-700 dark:text-brand-300">
                    {{ field.columnsDisplay }}
                  </td>
                  <td class="px-3 py-2 font-mono text-gray-600 dark:text-gray-300">
                    <span v-for="(raw, letter) in field.rawByLetter" :key="letter" class="mr-2">
                      {{ letter }}={{ raw ?? '∅' }}
                    </span>
                  </td>
                  <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">
                    {{ field.value ?? '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {{ error }}
      </div>

      <div
        v-if="showActions"
        class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end"
      >
        <button
          v-if="showClose"
          type="button"
          class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:w-auto"
          @click="emit('close')"
        >
          Hủy
        </button>
        <button
          type="button"
          class="inline-flex w-full items-center justify-center rounded-lg border border-brand-500 bg-white px-5 py-2.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:opacity-50 sm:w-auto dark:bg-transparent dark:hover:bg-brand-500/10"
          :disabled="!selectedFile || previewing || dispatching"
          @click="handlePreview"
        >
          {{ previewing ? 'Đang xem trước...' : 'Xem trước ánh xạ' }}
        </button>
        <button
          type="button"
          class="inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 sm:w-auto"
          :disabled="!selectedFile || dispatching || previewing"
          @click="handleImport"
        >
          Thực hiện import
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import { useImportNotifications } from '@/composables/useImportNotifications'
import { taxManagementService } from '@/services/taxManagementService'
import type {
  TaxImportColumnMap,
  TaxUnitImportPreviewResult,
} from '@/types/taxManagement'
import { columnsToDisplay, parseColumnInput } from '@/utils/excelColumns'

const props = withDefaults(
  defineProps<{
    showHeader?: boolean
    showClose?: boolean
    showActions?: boolean
  }>(),
  {
    showHeader: true,
    showClose: false,
    showActions: true,
  },
)

const emit = defineEmits<{
  close: []
  dispatched: [payload: { importJobId: number }]
}>()

const { trackImportJob } = useImportNotifications()

const selectedFile = ref<File | null>(null)
const startRow = ref(4)
const columnLabels = reactive<Record<string, string>>({})
const columnInputs = reactive<Record<string, string>>({})
const showColumnMap = ref(true)
const previewLimit = ref(5)
const previewing = ref(false)
const previewResult = ref<TaxUnitImportPreviewResult | null>(null)
const expandedPreviewRow = ref<number | null>(null)
const dispatching = ref(false)
const error = ref('')

function applyColumnMap(columnMap: TaxImportColumnMap, labels?: Record<string, string>) {
  for (const key of Object.keys(columnLabels)) {
    delete columnLabels[key]
  }
  for (const key of Object.keys(columnInputs)) {
    delete columnInputs[key]
  }

  const labelSource = labels && Object.keys(labels).length ? labels : Object.fromEntries(
    Object.keys(columnMap).map((key) => [key, key]),
  )

  for (const [key, label] of Object.entries(labelSource)) {
    columnLabels[key] = label
    columnInputs[key] = key in columnMap ? columnsToDisplay(columnMap[key]) : ''
  }

  for (const key of Object.keys(columnMap)) {
    if (!(key in columnLabels)) {
      columnLabels[key] = key
      columnInputs[key] = columnsToDisplay(columnMap[key])
    }
  }
}

function buildColumnMap(): TaxImportColumnMap {
  const map: TaxImportColumnMap = {}
  for (const [key, input] of Object.entries(columnInputs)) {
    const parsed = parseColumnInput(input)
    if (parsed.length > 0) {
      map[key] = parsed
    }
  }
  return map
}

async function loadDefaults() {
  try {
    const config = await taxManagementService.getTaxUnitImportColumnMap()
    startRow.value = config.startRow
    applyColumnMap(config.columnMap, config.columnLabels)
  } catch {
    applyColumnMap(
      { unitCode: ['B'], unitName: ['C'] },
      { unitCode: 'ID đơn vị thuế', unitName: 'Tên đơn vị thuế' },
    )
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
  previewResult.value = null
  expandedPreviewRow.value = null
  error.value = ''
}

async function handlePreview() {
  if (!selectedFile.value) return
  previewing.value = true
  error.value = ''
  previewResult.value = null
  expandedPreviewRow.value = null
  try {
    previewResult.value = await taxManagementService.previewTaxUnitsFromExcel(selectedFile.value, {
      startRow: startRow.value,
      columnMap: buildColumnMap(),
      limit: previewLimit.value,
    })
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Xem trước ánh xạ thất bại.'
  } finally {
    previewing.value = false
  }
}

async function handleImport() {
  if (!selectedFile.value) return
  dispatching.value = true
  error.value = ''
  try {
    const result = await taxManagementService.importTaxUnitsFromExcel(selectedFile.value, {
      startRow: startRow.value,
      columnMap: buildColumnMap(),
    })
    trackImportJob(result.importJobId)
    emit('dispatched', { importJobId: result.importJobId })
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Import thất bại.'
  } finally {
    dispatching.value = false
  }
}

onMounted(() => {
  void loadDefaults()
})

void props
</script>
