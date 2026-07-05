<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Toolbar -->
      <div class="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-900">
        <input
          v-model="filter.search"
          type="search"
          placeholder="Tìm mã / tên ngành..."
          class="h-8 min-w-[180px] flex-1 rounded border border-neutral-300 bg-white px-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
        />
        <select
          v-model="filter.cap"
          class="h-8 rounded border border-neutral-300 bg-white px-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
        >
          <option value="">Tất cả cấp</option>
          <option v-for="level in 5" :key="level" :value="String(level)">Cấp {{ level }}</option>
        </select>
        <select
          v-model="filter.isActive"
          class="h-8 rounded border border-neutral-300 bg-white px-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
        >
          <option value="">Tất cả TT</option>
          <option value="true">Hoạt động</option>
          <option value="false">Ngừng</option>
        </select>
        <button type="button" class="h-8 rounded border border-neutral-300 bg-white px-3 text-sm hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800" @click="resetFilters">
          Xóa lọc
        </button>
        <span class="hidden text-xs text-neutral-500 sm:inline">{{ displayRows.length }} / {{ totalItems }} mục</span>
        <button
          type="button"
          class="h-8 rounded border border-neutral-300 bg-white px-3 text-sm hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800"
          @click="expandAllCap1"
        >
          Mở tất cả
        </button>
        <button
          type="button"
          class="h-8 rounded border border-neutral-300 bg-white px-3 text-sm hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800"
          @click="collapseAllCap1"
        >
          Thu gọn tất cả
        </button>
        <button
          v-if="canManage"
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded border border-emerald-500 bg-white px-3 text-sm text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-neutral-800 dark:text-emerald-300"
          :disabled="exportingCatalog"
          title="Xuất danh mục ngành nghề ra Excel"
          @click="handleExportCatalog"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ exportingCatalog ? 'Đang xuất...' : 'Xuất Excel' }}
        </button>
        <button
          v-if="canManage"
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded border border-amber-500 bg-white px-3 text-sm text-amber-700 hover:bg-amber-50 dark:border-amber-400 dark:bg-neutral-800 dark:text-amber-300"
          :disabled="importingCatalog"
          title="Import Excel — bản ghi đã tồn tại sẽ bỏ qua, chỉ thêm mới"
          @click="openImportCatalog"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21V9m0 0l4 4m-4-4l-4 4M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ importingCatalog ? 'Đang import...' : 'Import Excel' }}
        </button>
        <input
          ref="importCatalogInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          class="hidden"
          @change="handleImportCatalog"
        />
        <button
          v-if="canManage"
          type="button"
          class="ml-auto h-8 rounded bg-brand-500 px-3 text-sm font-medium text-white hover:bg-brand-600"
          @click="openCreateRoot"
        >
          + Cấp 1
        </button>
      </div>

      <div v-if="message" class="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        {{ message }}
      </div>

      <!-- Action bar khi chọn dòng -->
      <div
        v-if="canManage && selectedRow"
        class="flex flex-wrap items-center gap-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm dark:border-amber-700 dark:bg-amber-900/20"
      >
        <span class="font-medium text-neutral-700 dark:text-neutral-200">
          {{ selectedRow.item.ma }} — {{ selectedRow.ten }}
        </span>
        <button v-if="selectedRow.cap < 5" type="button" class="rounded border border-neutral-400 bg-white px-2 py-0.5 hover:bg-neutral-100" @click="openCreateChild(selectedRow.item)">
          + Thêm con
        </button>
        <button type="button" class="rounded border border-neutral-400 bg-white px-2 py-0.5 hover:bg-neutral-100" @click="openEdit(selectedRow.item)">
          Sửa
        </button>
        <button type="button" class="rounded border border-neutral-400 bg-white px-2 py-0.5 hover:bg-neutral-100" @click="toggleActive(selectedRow.item)">
          {{ selectedRow.isActive ? 'Ngừng HĐ' : 'Kích hoạt' }}
        </button>
        <button
          type="button"
          class="rounded border border-red-400 bg-white px-2 py-0.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
          :disabled="selectedRow.childrenCount > 0"
          @click="handleDelete(selectedRow.item)"
        >
          Xóa
        </button>
        <button type="button" class="ml-auto text-neutral-500 hover:text-neutral-700" @click="selectedRow = null">✕</button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
      </div>

      <div v-else-if="displayRows.length === 0" class="py-16 text-center text-sm text-neutral-500">
        Không có dữ liệu.
      </div>

      <!-- Bảng kiểu Excel -->
      <div v-else class="vsic-sheet-wrap overflow-auto">
        <table class="vsic-sheet">
          <thead>
            <tr>
              <th>Cấp 1</th>
              <th>Cấp 2</th>
              <th>Cấp 3</th>
              <th>Cấp 4</th>
              <th>Cấp 5</th>
              <th>Tên ngành</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in displayRows"
              :key="row.id"
              class="vsic-row"
              :class="{
                'vsic-row--selected': selectedRow?.id === row.id,
                'vsic-row--inactive': !row.isActive,
                'vsic-row--cap1': row.cap === 1,
              }"
              @click="selectRow(row)"
            >
              <td
                v-for="col in 5"
                :key="col"
                class="vsic-code"
                :class="{ 'vsic-code--cap1': col === 1 && row.cap === 1 }"
              >
                <span v-if="col === 1 && row.cap === 1" class="vsic-cap1-cell">
                  <button
                    v-if="row.childrenCount > 0"
                    type="button"
                    class="vsic-toggle"
                    :title="isCap1Collapsed(row.id) ? 'Mở rộng' : 'Thu gọn'"
                    :aria-expanded="!isCap1Collapsed(row.id)"
                    @click="toggleCap1(row, $event)"
                  >
                    <svg
                      class="vsic-toggle-icon"
                      :class="{ 'vsic-toggle-icon--collapsed': isCap1Collapsed(row.id) }"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6 4l4 4-4 4V4z" />
                    </svg>
                  </button>
                  <span v-else class="vsic-toggle vsic-toggle--placeholder" aria-hidden="true"></span>
                  <span>{{ row.levels[col - 1] ?? '' }}</span>
                </span>
                <template v-else>{{ row.levels[col - 1] ?? '' }}</template>
              </td>
              <td class="vsic-name">{{ row.ten }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="isModalOpen" @close="closeModal">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-[640px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
          <h3 class="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
            {{ editingId ? 'Cập nhật ngành nghề' : `Thêm ${capLabel(form.cap)}` }}
          </h3>

          <form class="grid grid-cols-1 gap-4 sm:grid-cols-2" @submit.prevent="saveItem">
            <div v-if="!editingId">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp <span class="text-red-500">*</span></label>
              <select
                v-model.number="form.cap"
                required
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option v-for="level in 5" :key="level" :value="level">{{ capLabel(level) }}</option>
              </select>
            </div>
            <div v-else>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp</label>
              <input :value="capLabel(form.cap)" disabled class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>

            <div v-if="!editingId && form.cap > 1">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Danh mục cha <span class="text-red-500">*</span></label>
              <select
                v-model.number="form.parentId"
                required
                class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option :value="null" disabled>Chọn danh mục cha (cấp {{ form.cap - 1 }})</option>
                <option v-for="opt in parentOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
              </select>
            </div>

            <div v-if="!editingId">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Mã ngành <span class="text-red-500">*</span></label>
              <input v-model="form.ma" required placeholder="VD: A, 01, 011" class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div v-else>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Mã ngành</label>
              <input :value="form.ma" disabled class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Thứ tự</label>
              <input v-model.number="form.thuTu" type="number" min="0" class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Tên ngành <span class="text-red-500">*</span></label>
              <input v-model="form.ten" required class="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div v-if="!editingId" class="sm:col-span-2">
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded text-brand-500" />
                Đang hoạt động
              </label>
            </div>
            <div v-if="editingId" class="sm:col-span-2">
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded text-brand-500" />
                Đang hoạt động
              </label>
            </div>
            <div v-if="error" class="sm:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">{{ error }}</div>
            <div class="sm:col-span-2 flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button type="button" class="h-10 rounded-lg border border-gray-300 px-4 text-sm" @click="closeModal">Hủy</button>
              <button type="submit" class="h-10 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50" :disabled="saving">
                {{ saving ? 'Đang lưu...' : 'Lưu' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/ui/Modal.vue'
import { industryCategoryService } from '@/services/industryCategoryService'
import { useAuthStore } from '@/stores/auth'
import type { IndustryCategory, IndustryCategoryImportResult, IndustryCategoryPayload } from '@/types/industryCategory'
import { CAP_LABELS } from '@/types/industryCategory'
import { formatImportUploadError } from '@/utils/apiError'
import {
  applyCap1Collapse,
  buildIndustryTree,
  filterIndustryRows,
  flattenIndustryTree,
  type IndustryFlatRow,
} from '@/utils/industryCategoryTable'

const auth = useAuthStore()
const canManage = computed(() => auth.hasPermission('feature.industry-categories.manage'))

const loading = ref(true)
const saving = ref(false)
const exportingCatalog = ref(false)
const importingCatalog = ref(false)
const importCatalogInput = ref<HTMLInputElement | null>(null)
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const error = ref<string | null>(null)
const message = ref('')
const allRows = ref<IndustryFlatRow[]>([])
const totalItems = ref(0)
const selectedRow = ref<IndustryFlatRow | null>(null)
const parentItem = ref<IndustryCategory | null>(null)
const collapsedCap1Ids = ref<Set<number>>(new Set())

const filter = reactive({ search: '', cap: '', isActive: '' })

const form = reactive<IndustryCategoryPayload>({
  parentId: null,
  cap: 1,
  ma: '',
  ten: '',
  thuTu: 0,
  isActive: true,
})

const hasActiveFilter = computed(
  () => Boolean(filter.search.trim() || filter.cap || filter.isActive),
)

const filteredRows = computed(() =>
  filterIndustryRows(allRows.value, filter.search, filter.cap, filter.isActive),
)

const displayRows = computed(() => {
  if (hasActiveFilter.value) return filteredRows.value
  return applyCap1Collapse(filteredRows.value, collapsedCap1Ids.value)
})

const capLabel = (cap: number) => CAP_LABELS[cap] ?? `Cấp ${cap}`

const isCap1Collapsed = (cap1Id: number) => collapsedCap1Ids.value.has(cap1Id)

const toggleCap1 = (row: IndustryFlatRow, event: Event) => {
  event.stopPropagation()
  const next = new Set(collapsedCap1Ids.value)
  if (next.has(row.id)) {
    next.delete(row.id)
  } else {
    next.add(row.id)
  }
  collapsedCap1Ids.value = next
}

const expandAllCap1 = () => {
  collapsedCap1Ids.value = new Set()
}

const collapseAllCap1 = () => {
  collapsedCap1Ids.value = new Set(
    allRows.value.filter((row) => row.cap === 1 && row.childrenCount > 0).map((row) => row.id),
  )
}

const parentOptions = computed(() => {
  if (form.cap <= 1) return []
  return allRows.value
    .filter((row) => row.cap === form.cap - 1)
    .map((row) => ({
      id: row.id,
      label: `${row.item.ma} — ${row.ten}`,
    }))
})

watch(
  () => form.cap,
  (cap) => {
    if (cap === 1) {
      form.parentId = null
      return
    }
    const valid = allRows.value.some((row) => row.id === form.parentId && row.cap === cap - 1)
    if (!valid) {
      form.parentId = parentItem.value?.cap === cap - 1 ? parentItem.value.id : null
    }
  },
)

const selectRow = (row: IndustryFlatRow) => {
  selectedRow.value = selectedRow.value?.id === row.id ? null : row
}

const loadAll = async () => {
  loading.value = true
  try {
    const items = await industryCategoryService.getAll()
    allRows.value = flattenIndustryTree(buildIndustryTree(items))
    totalItems.value = allRows.value.length
    if (selectedRow.value) {
      selectedRow.value = allRows.value.find((r) => r.id === selectedRow.value?.id) ?? null
    }
  } catch (err) {
    allRows.value = []
    console.error(err)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filter.search = ''
  filter.cap = ''
  filter.isActive = ''
}

const resetForm = (parent: IndustryCategory | null = null) => {
  parentItem.value = parent
  Object.assign(form, {
    parentId: parent?.id ?? null,
    cap: parent ? Math.min(5, parent.cap + 1) : 1,
    ma: '',
    ten: '',
    thuTu: 0,
    isActive: true,
  })
}

const openCreateRoot = () => {
  editingId.value = null
  resetForm(null)
  error.value = null
  isModalOpen.value = true
}

const openCreateChild = (parent: IndustryCategory) => {
  editingId.value = null
  resetForm(parent)
  error.value = null
  isModalOpen.value = true
}

const openEdit = (item: IndustryCategory) => {
  editingId.value = item.id
  parentItem.value = null
  Object.assign(form, {
    parentId: item.parentId,
    cap: item.cap,
    ma: item.ma,
    ten: item.ten,
    thuTu: item.thuTu,
    isActive: item.isActive,
  })
  error.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveItem = async () => {
  saving.value = true
  error.value = null
  try {
    if (editingId.value) {
      await industryCategoryService.update(editingId.value, {
        ten: form.ten,
        thuTu: form.thuTu,
        isActive: form.isActive,
      })
      message.value = 'Cập nhật thành công'
    } else {
      await industryCategoryService.create({
        parentId: form.cap === 1 ? null : form.parentId,
        cap: form.cap,
        ma: form.ma,
        ten: form.ten,
        thuTu: form.thuTu,
        isActive: form.isActive,
      })
      message.value = 'Thêm thành công'
    }
    closeModal()
    await loadAll()
  } catch (err: unknown) {
    const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = apiMessage || (err instanceof Error ? err.message : 'Không thể lưu')
  } finally {
    saving.value = false
  }
}

const toggleActive = async (item: IndustryCategory) => {
  try {
    await industryCategoryService.update(item.id, { isActive: !item.isActive })
    message.value = item.isActive ? 'Đã ngừng hoạt động' : 'Đã kích hoạt'
    await loadAll()
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : 'Lỗi cập nhật')
  }
}

const handleDelete = async (item: IndustryCategory) => {
  if (!confirm(`Xóa "${item.ma} - ${item.ten}"?`)) return
  try {
    await industryCategoryService.delete(item.id)
    message.value = 'Đã xóa'
    selectedRow.value = null
    await loadAll()
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : 'Không thể xóa')
  }
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const openImportCatalog = () => {
  importCatalogInput.value?.click()
}

const handleExportCatalog = async () => {
  exportingCatalog.value = true
  try {
    const blob = await industryCategoryService.exportCatalog()
    downloadBlob(blob, `danh-muc-nganh-nghe_${new Date().toISOString().slice(0, 10)}.xlsx`)
    message.value = 'Xuất danh mục ngành nghề thành công'
  } catch (err: unknown) {
    const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    alert(apiMessage || 'Xuất Excel thất bại')
  } finally {
    exportingCatalog.value = false
  }
}

const handleImportCatalog = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!confirm(`Import danh mục ngành nghề từ file "${file.name}"?\n\nBản ghi đã tồn tại sẽ bỏ qua. Chỉ thêm các bản ghi mới.`)) {
    input.value = ''
    return
  }

  importingCatalog.value = true
  try {
    const result: IndustryCategoryImportResult = await industryCategoryService.importCatalog(file)
    message.value = `${result.imported} mới · ${result.skipped} bỏ qua · ${result.failed} lỗi`
    if (result.errors.length > 0) {
      alert(result.errors.slice(0, 5).map((err) => `Dòng ${err.row}: ${err.message}`).join('\n'))
    }
    await loadAll()
  } catch (err: unknown) {
    alert(formatImportUploadError(err, 'Import Excel thất bại.'))
  } finally {
    importingCatalog.value = false
    input.value = ''
  }
}

onMounted(loadAll)
</script>

<style scoped>
.vsic-sheet-wrap {
  max-height: calc(100dvh - 14rem);
  border: 1px solid #374151;
  background: #fff;
}

.dark .vsic-sheet-wrap {
  border-color: #6b7280;
  background: #111827;
}

.vsic-sheet {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13px;
  line-height: 1.35;
  color: #111827;
}

.dark .vsic-sheet {
  color: #f3f4f6;
}

.vsic-sheet th,
.vsic-sheet td {
  border: 1px solid #374151;
  padding: 5px 8px;
  vertical-align: middle;
}

.dark .vsic-sheet th,
.dark .vsic-sheet td {
  border-color: #4b5563;
}

.vsic-sheet thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #e5e7eb;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

.dark .vsic-sheet thead th {
  background: #374151;
}

.vsic-sheet th:nth-child(1),
.vsic-sheet th:nth-child(2),
.vsic-sheet th:nth-child(3),
.vsic-sheet th:nth-child(4),
.vsic-sheet th:nth-child(5) {
  width: 72px;
}

.vsic-sheet th:nth-child(6) {
  width: auto;
  text-align: left;
}

.vsic-code {
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  background: #fff;
  color: #111827;
}

.dark .vsic-code {
  background: #111827;
  color: #f9fafb;
}

.vsic-name {
  text-align: left;
  background: #fff;
  word-break: break-word;
}

.dark .vsic-name {
  background: #111827;
}

.vsic-row {
  cursor: pointer;
}

.vsic-row:hover td {
  background: #f9fafb;
}

.dark .vsic-row:hover td {
  background: #1f2937;
}

.vsic-row--selected td {
  background: #fef9c3 !important;
}

.dark .vsic-row--selected td {
  background: #422006 !important;
}

.vsic-code--cap1 {
  padding-left: 4px;
}

.vsic-cap1-cell {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 20px;
}

.vsic-toggle {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  padding: 0;
}

.vsic-toggle:hover {
  background: #e5e7eb;
}

.dark .vsic-toggle {
  color: #e5e7eb;
}

.dark .vsic-toggle:hover {
  background: #374151;
}

.vsic-toggle--placeholder {
  cursor: default;
  pointer-events: none;
}

.vsic-toggle-icon {
  width: 12px;
  height: 12px;
  transition: transform 0.15s ease;
}

.vsic-toggle-icon--collapsed {
  transform: rotate(0deg);
}

.vsic-toggle-icon:not(.vsic-toggle-icon--collapsed) {
  transform: rotate(90deg);
}

.vsic-row--cap1 .vsic-name {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.vsic-row--inactive {
  opacity: 0.55;
}

.vsic-row--inactive .vsic-name {
  text-decoration: line-through;
}
</style>
