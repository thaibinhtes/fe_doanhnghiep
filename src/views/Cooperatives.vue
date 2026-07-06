<template>
  <AdminLayout>
    <div class="flex min-h-0 flex-1 flex-col max-lg:flex-none max-lg:overflow-visible lg:overflow-hidden">
      <ComponentCard title="Danh sách hợp tác xã" hide-header className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" bodyClass="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-3" slotClass="flex min-h-0 flex-1 flex-col gap-2">
        <div class="shrink-0 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
          <div class="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div class="grid min-w-0 flex-1 grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-[minmax(180px,1.2fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(220px,1fr)] xl:items-center">
              <input v-model="filter.search" type="text" placeholder="Tìm kiếm tên, mã số thuế..." class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              <select v-model="filter.donViId" class="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                <option value="">Đơn vị</option>
                <option v-for="opt in orgUnitOptions" :key="opt.id" :value="String(opt.id)">{{ opt.label }}</option>
              </select>
              <AdministrativeFilter
                v-model:provinceCode="filterProvinceCode"
                v-model:wardCode="filterWardCode"
                :hide-province="HIDE_PROVINCE_FILTER"
                :default-province-code="DEFAULT_PROVINCE_CODE"
                ward-placeholder="Phường/xã"
                ward-search-placeholder="Tìm phường/xã..."
                compact dense
                @change="handleAdministrativeFilterChange"
              />
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-1.5 xl:justify-end">
              <button type="button" class="inline-flex h-8 items-center rounded-lg border border-gray-300 bg-white px-2.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" @click="resetFilters">Đặt lại</button>
              <button v-if="auth.hasPermission('feature.companies.export')" type="button" :disabled="exporting" class="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-500 px-2.5 text-xs font-medium text-emerald-600 disabled:opacity-50" @click="handleExport">
                {{ exporting ? 'Đang xuất...' : 'Xuất' }}
              </button>
              <details v-if="auth.hasPermission('feature.companies.import')" class="relative">
                <summary class="inline-flex h-8 list-none cursor-pointer items-center gap-1 rounded-lg border border-amber-500 px-2.5 text-xs font-medium text-amber-600">Nhập</summary>
                <div class="absolute right-0 z-50 mt-1 min-w-[220px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  <button type="button" class="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="openImportModal">Import danh sách</button>
                  <button type="button" class="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="openImportHistory">Lịch sử import</button>
                  <button type="button" class="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800" @click="downloadTemplate">Tải mẫu Excel</button>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div v-if="store.error" class="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">{{ store.error }}</div>

        <div class="min-h-0 flex-1 overflow-auto">
          <div v-if="store.loading" class="py-12 text-center text-sm text-gray-500">Đang tải...</div>
          <div v-else-if="store.cooperatives.length === 0" class="py-12 text-center text-sm text-gray-500">Không có hợp tác xã.</div>

          <div v-else class="lg:hidden grid gap-3 p-1">
            <CooperativeMobileCard v-for="(item, index) in store.cooperatives" :key="item.id" :cooperative="item" :index="index" show-actions @delete="confirmDelete" />
          </div>

          <div v-else class="hidden lg:block min-w-max">
            <table class="min-w-full text-sm">
              <thead class="sticky top-0 z-10 bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th class="px-3 py-2">STT</th>
                  <th class="px-3 py-2">Tên HTX</th>
                  <th class="px-3 py-2">Mã số thuế</th>
                  <th class="px-3 py-2">Năm TL</th>
                  <th class="px-3 py-2">CT HĐQT</th>
                  <th class="px-3 py-2">Điện thoại</th>
                  <th class="px-3 py-2">Địa chỉ</th>
                  <th class="px-3 py-2">Phường/xã</th>
                  <th class="px-3 py-2">Diện tích</th>
                  <th class="px-3 py-2">Vốn ĐL</th>
                  <th class="px-3 py-2">TV</th>
                  <th class="px-3 py-2">Lao động</th>
                  <th class="px-3 py-2">Lĩnh vực</th>
                  <th class="px-3 py-2">Hoạt động</th>
                  <th class="px-3 py-2">Đơn vị</th>
                  <th class="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in store.cooperatives" :key="item.id" class="border-t border-gray-100 dark:border-gray-800">
                  <td class="px-3 py-2">{{ item.tt ?? '—' }}</td>
                  <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ item.tenHtx }}</td>
                  <td class="px-3 py-2">{{ item.maSoThue || '—' }}</td>
                  <td class="px-3 py-2">{{ item.namThanhLap || '—' }}</td>
                  <td class="px-3 py-2">{{ item.chuTichHdqtTen || '—' }}</td>
                  <td class="px-3 py-2">{{ item.dienThoai || '—' }}</td>
                  <td class="px-3 py-2 max-w-[200px] truncate">{{ item.diaChi || '—' }}</td>
                  <td class="px-3 py-2">{{ item.phuongXa || '—' }}</td>
                  <td class="px-3 py-2">{{ item.dienTichHa ?? '—' }}</td>
                  <td class="px-3 py-2">{{ item.vonDieuLe || '—' }}</td>
                  <td class="px-3 py-2">{{ item.soThanhVien ?? '—' }}</td>
                  <td class="px-3 py-2">{{ item.soNguoiLaoDong ?? '—' }}</td>
                  <td class="px-3 py-2">{{ item.linhVuc || '—' }}</td>
                  <td class="px-3 py-2">{{ item.hoatDong || '—' }}</td>
                  <td class="px-3 py-2">{{ item.donViTen || '—' }}</td>
                  <td class="px-3 py-2">
                    <button type="button" class="text-xs text-red-600 hover:underline" @click="confirmDelete(item)">Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="shrink-0 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-2 text-sm dark:border-gray-700">
          <div class="flex items-center gap-2">
            <span class="text-gray-500">Hiển thị</span>
            <select v-model.number="pageSize" class="h-8 rounded-lg border border-gray-300 bg-transparent px-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
            <span class="text-gray-500">/ {{ store.total }} bản ghi</span>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="rounded-lg border px-2 py-1 disabled:opacity-50" :disabled="store.page <= 1" @click="store.setPage(store.page - 1)">Trước</button>
            <span class="px-2 text-gray-600 dark:text-gray-300">{{ store.page }} / {{ store.totalPages }}</span>
            <button type="button" class="rounded-lg border px-2 py-1 disabled:opacity-50" :disabled="store.page >= store.totalPages" @click="store.setPage(store.page + 1)">Sau</button>
          </div>
        </div>
      </ComponentCard>
    </div>

    <Modal v-if="showImportModal" @close="closeImportModal">
      <template #body>
        <div
          class="no-scrollbar relative z-10 w-full max-w-[640px] max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-8"
        >
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h5 class="text-theme-xl font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
                Nhập hợp tác xã từ Excel
              </h5>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload file Excel từ đơn vị. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              @click="closeImportModal"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="rounded-xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-800/60 dark:bg-brand-950/20">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                Đơn vị import hợp tác xã
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Hợp tác xã mới sẽ gán vào đơn vị của bạn. Hệ thống kiểm tra trùng trong phạm vi các đơn vị bên dưới.
              </p>

              <div v-if="loadingImportScope" class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Đang tải thông tin đơn vị...
              </div>

              <div v-else-if="!importScopePrimaryUnit" class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                Tài khoản chưa được gán đơn vị. Vui lòng liên hệ quản trị viên.
              </div>

              <div v-else class="mt-3 space-y-3">
                <div class="flex items-start gap-3 rounded-lg border border-white/80 bg-white/80 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900/60">
                  <span class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                    {{ importScopePrimaryUnit.cap }}
                  </span>
                  <div class="min-w-0">
                    <p class="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-300">
                      Đơn vị gán import
                    </p>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ importScopePrimaryUnit.ma }} — {{ importScopePrimaryUnit.ten }}
                    </p>
                  </div>
                </div>

                <div v-if="importScopeChildUnits.length > 0">
                  <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Đơn vị con trực thuộc ({{ importScopeChildUnits.length }})
                  </p>
                  <ul class="max-h-36 space-y-2 overflow-y-auto pr-1">
                    <li
                      v-for="unit in importScopeChildUnits"
                      :key="unit.id"
                      class="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900/40"
                    >
                      <span class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {{ unit.cap }}
                      </span>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ unit.ma }} — {{ unit.ten }}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400"
              :disabled="downloadingTemplate"
              @click="handleDownloadTemplate"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ downloadingTemplate ? 'Đang tải mẫu...' : 'Tải file mẫu Excel (hệ thống)' }}
            </button>

            <div class="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Config mẫu (example)
                </label>
                <select
                  v-model="selectedImportConfigId"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  @change="applySelectedImportConfig"
                >
                  <option :value="''">— Chọn config mẫu —</option>
                  <option v-for="config in importExampleConfigs" :key="config.id" :value="config.id">
                    {{ config.name }}
                  </option>
                </select>
                <p v-if="selectedImportConfigDescription" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ selectedImportConfigDescription }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Format đã lưu (cá nhân)
                </label>
                <div class="flex flex-col gap-2 sm:flex-row">
                  <select
                    v-model="selectedImportFormatId"
                    class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    @change="applySelectedImportFormat"
                  >
                    <option :value="''">— Chọn format —</option>
                    <option v-for="format in importFormats" :key="format.id" :value="format.id">
                      {{ format.name }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    :disabled="!selectedImportFormatId || deletingImportFormat"
                    @click="handleDeleteImportFormat"
                  >
                    {{ deletingImportFormat ? 'Đang xóa...' : 'Xóa' }}
                  </button>
                </div>
              </div>

              <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div class="flex-1">
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Tên format mới
                  </label>
                  <input
                    v-model="importFormatName"
                    type="text"
                    placeholder="VD: HTX STC An Giang"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                  :disabled="!importFormatName.trim() || savingImportFormat"
                  @click="handleSaveImportFormat"
                >
                  {{ savingImportFormat ? 'Đang lưu...' : 'Lưu format' }}
                </button>
              </div>

              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hàng bắt đầu đọc dữ liệu
              </label>
              <input
                v-model.number="importStartRow"
                type="number"
                min="1"
                max="1000"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Mẫu HTX STC: header hàng 7, dữ liệu từ hàng 10. Đọc liên tục đến khi gặp hàng trống.
              </p>

              <button
                type="button"
                class="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                @click="showImportColumnConfig = !showImportColumnConfig"
              >
                {{ showImportColumnConfig ? 'Ẩn' : 'Cấu hình' }} ánh xạ cột
              </button>

              <div v-if="showImportColumnConfig" class="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                <div
                  v-for="(label, key) in importColumnLabels"
                  :key="key"
                  class="grid grid-cols-[1fr_88px] items-center gap-2"
                >
                  <span class="text-xs text-gray-600 dark:text-gray-400">{{ label }}</span>
                  <input
                    v-model="importColumnInputs[key]"
                    type="text"
                    placeholder="—"
                    class="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <p class="sticky bottom-0 bg-white pt-1 text-xs text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  Để trống = không map cột. Cột đơn (C), merge (D-G), cột đôi (AA-AB).
                </p>
              </div>
            </div>

            <div class="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
              <input
                ref="importFileInput"
                type="file"
                accept=".xlsx,.xls,.csv"
                class="hidden"
                @change="onImportFileSelected"
              />
              <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Chọn file Excel (.xlsx, .xls, .csv)
              </p>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
                @click="importFileInput?.click()"
              >
                Chọn file
              </button>
              <p v-if="selectedImportFile" class="mt-3 text-sm text-gray-700 dark:text-gray-300">
                {{ selectedImportFile.name }}
              </p>
            </div>

            <ImportLoadingSkeleton
              v-if="importing && !importResult"
              :subtitle="importQueuedMessage"
            />

            <div
              v-if="importResult"
              class="rounded-lg border p-4 text-sm dark:border-gray-700"
              :class="importResult.failed > 0 ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20'"
            >
              <p class="font-medium text-gray-800 dark:text-gray-200">
                {{ importResult.imported }} mới · {{ importResultDuplicates }} trùng · {{ importResult.failed }} lỗi
              </p>
              <ul v-if="importResult.errors.length" class="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                <li v-for="(err, idx) in importResult.errors.slice(0, 10)" :key="idx">
                  Dòng {{ err.row }}: {{ err.message }}
                </li>
                <li v-if="importResult.errors.length > 10" class="text-gray-500">
                  ... và {{ importResult.errors.length - 10 }} lỗi khác
                </li>
              </ul>
            </div>

            <div v-if="importError" class="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {{ importError }}
            </div>
          </div>

          <div class="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:w-auto"
              @click="closeImportModal"
            >
              Đóng
            </button>
            <button
              type="button"
              class="inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 sm:w-auto"
              :disabled="!selectedImportFile || importing"
              @click="handleImport"
            >
              {{ importSubmitLabel }}
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <ImportHistoryModal :open="showImportHistory" @close="showImportHistory = false" />

    <Modal v-if="deleteTarget" @close="deleteTarget = null">
      <template #body>
        <div class="mx-auto w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
          <h3 class="text-lg font-semibold">Xóa hợp tác xã?</h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Bạn có chắc muốn xóa <strong>{{ deleteTarget.tenHtx }}</strong>?</p>
          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="rounded-lg border px-4 py-2 text-sm" @click="deleteTarget = null">Hủy</button>
            <button type="button" class="rounded-lg bg-red-600 px-4 py-2 text-sm text-white" @click="handleDelete">Xóa</button>
          </div>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/profile/Modal.vue'
import AdministrativeFilter from '@/components/filters/AdministrativeFilter.vue'
import CooperativeMobileCard from '@/components/cooperatives/CooperativeMobileCard.vue'
import ImportHistoryModal from '@/components/cooperatives/ImportHistoryModal.vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import { useCooperativesStore } from '@/stores/cooperatives'
import { useAuthStore } from '@/stores/auth'
import { cooperativeService } from '@/services/cooperativeService'
import { orgUnitService } from '@/services/orgUnitService'
import type { OrgUnit, ImportScopeOrgUnit } from '@/types/orgUnit'
import { resolveImportScopeOrgUnits } from '@/types/orgUnit'
import { locationService } from '@/services/locationService'
import { DEFAULT_PROVINCE_CODE, HIDE_PROVINCE_FILTER } from '@/config/hanhChinh'
import { columnsToDisplay, parseColumnInput } from '@/utils/excelColumns'
import { formatImportUploadError } from '@/utils/apiError'
import { useImportNotifications } from '@/composables/useImportNotifications'
import type { Cooperative, CooperativeFilters, CooperativeImportColumnMap, CooperativeImportExampleConfig, CooperativeImportFormat, CooperativeImportResult } from '@/types/cooperative'
import { COOPERATIVE_IMPORT_COLUMN_LABELS } from '@/types/cooperative'
import { HTX_STC_EXAMPLE_CONFIG_CODE, HTX_STC_EXAMPLE_CONFIG_NAME } from '@/config/htxImport'

const store = useCooperativesStore()
const auth = useAuthStore()
const { onImportCompleted, onImportFailed, trackImportJob, clearImportJob } = useImportNotifications()

const pageSizeOptions = [15, 25, 50, 100, 200, 300, 400, 500]
const pageSize = computed({
  get: () => store.perPage,
  set: (value: number) => store.setPerPage(value),
})

const filter = reactive({ search: '', phuongXa: '', donViId: '' })
const filterProvinceCode = ref(DEFAULT_PROVINCE_CODE)
const filterWardCode = ref('')
const orgUnits = ref<OrgUnit[]>([])
const exporting = ref(false)

const showImportModal = ref(false)
const showImportHistory = ref(false)
const selectedImportFile = ref<File | null>(null)
const importFileInput = ref<HTMLInputElement | null>(null)
const importing = ref(false)
const importError = ref<string | null>(null)
const importResult = ref<CooperativeImportResult | null>(null)
const importQueuedMessage = ref<string | null>(null)
const importStartRow = ref(10)
const importColumnInputs = reactive<Record<string, string>>({})
const importColumnLabels = reactive<Record<string, string>>({ ...COOPERATIVE_IMPORT_COLUMN_LABELS })
const importExampleConfigs = ref<CooperativeImportExampleConfig[]>([])
const importFormats = ref<CooperativeImportFormat[]>([])
const selectedImportConfigId = ref<number | ''>('')
const selectedImportFormatId = ref<number | ''>('')
const importFormatName = ref('')
const savingImportFormat = ref(false)
const deletingImportFormat = ref(false)
const downloadingTemplate = ref(false)
const showImportColumnConfig = ref(false)
const loadingImportScope = ref(false)
const importScopeOrgUnits = ref<ImportScopeOrgUnit[]>([])
const queuedImportJobId = ref<number | null>(null)

const deleteTarget = ref<Cooperative | null>(null)

const importScopePrimaryUnit = computed(() => importScopeOrgUnits.value.find((unit) => unit.isPrimary) ?? null)
const importScopeChildUnits = computed(() => importScopeOrgUnits.value.filter((unit) => !unit.isPrimary))
const selectedImportConfigDescription = computed(() => {
  const config = importExampleConfigs.value.find((item) => item.id === selectedImportConfigId.value)
  return config?.description ?? ''
})
const importResultDuplicates = computed(() => {
  if (!importResult.value) return 0
  return importResult.value.duplicates ?? importResult.value.updated ?? 0
})
const importSubmitLabel = computed(() => {
  if (!importing.value) return 'Nhập dữ liệu'
  if (queuedImportJobId.value) return 'Đang xử lý nền...'
  return 'Đang nhập...'
})

const orgUnitOptions = computed(() => {
  const flatten = (nodes: OrgUnit[], depth = 0): Array<{ id: number; label: string }> => {
    const result: Array<{ id: number; label: string }> = []
    for (const node of nodes) {
      result.push({ id: node.id, label: `${'— '.repeat(depth)}${node.ten}` })
      if (node.children?.length) result.push(...flatten(node.children, depth + 1))
    }
    return result
  }
  return flatten(orgUnits.value)
})

function currentFilters(): CooperativeFilters {
  return {
    page: store.page,
    per_page: store.perPage,
    search: filter.search || undefined,
    phuongXa: filter.phuongXa || undefined,
    donViId: filter.donViId || undefined,
  }
}

function handleAdministrativeFilterChange(payload: { provinceName: string; wardName: string }) {
  filter.phuongXa = payload.wardName
}

function resetFilters() {
  filter.search = ''
  filter.phuongXa = ''
  filter.donViId = ''
  filterWardCode.value = ''
  filterProvinceCode.value = DEFAULT_PROVINCE_CODE
  store.setPage(1)
}

async function handleExport() {
  exporting.value = true
  try {
    const blob = await cooperativeService.exportExcel(currentFilters())
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hop-tac-xa_${new Date().toISOString().slice(0, 10)}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  } finally {
    exporting.value = false
  }
}

async function downloadTemplate() {
  await handleDownloadTemplate()
}

async function handleDownloadTemplate() {
  downloadingTemplate.value = true
  try {
    const blob = await cooperativeService.exportTemplate()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'mau-import-hop-tac-xa.xlsx'
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    alert('Tải file mẫu thất bại.')
  } finally {
    downloadingTemplate.value = false
  }
}

async function loadImportScopeOrgUnits() {
  loadingImportScope.value = true
  try {
    const donViId = auth.user?.donViId ?? null
    const donVi = auth.user?.donVi ?? null

    if (!donViId) {
      importScopeOrgUnits.value = resolveImportScopeOrgUnits(null, donVi, orgUnits.value)
      return
    }

    let directChildren: OrgUnit[] = []
    try {
      const response = await orgUnitService.getList({ parentId: donViId, isActive: true, perPage: 200 })
      directChildren = response.data
    } catch {
      directChildren = []
    }

    importScopeOrgUnits.value = resolveImportScopeOrgUnits(donViId, donVi, orgUnits.value, directChildren)
  } finally {
    loadingImportScope.value = false
  }
}

function confirmDelete(item: Cooperative) {
  deleteTarget.value = item
}

async function handleDelete() {
  if (!deleteTarget.value) return
  await store.deleteCooperative(deleteTarget.value.id)
  deleteTarget.value = null
}

function applyImportColumnMap(columnMap: CooperativeImportColumnMap, labels?: Record<string, string>) {
  Object.keys(importColumnInputs).forEach((key) => delete importColumnInputs[key])
  const allLabels = labels ?? COOPERATIVE_IMPORT_COLUMN_LABELS
  for (const [key, label] of Object.entries(allLabels)) {
    importColumnLabels[key] = label
    importColumnInputs[key] = key in columnMap ? columnsToDisplay(columnMap[key]) : ''
  }
}

function buildImportColumnMap(): CooperativeImportColumnMap {
  const map: CooperativeImportColumnMap = {}
  for (const [key, input] of Object.entries(importColumnInputs)) {
    const columns = parseColumnInput(input)
    if (columns.length > 0) map[key] = columns
  }
  return map
}

async function loadImportColumnMapDefaults() {
  try {
    const config = await cooperativeService.getImportColumnMap()
    importStartRow.value = config.startRow
    applyImportColumnMap(config.columnMap, config.columnLabels)
  } catch {
    applyImportColumnMap({
      tt: ['A'], tenHtx: ['B'], maSoThue: ['C'], namThanhLap: ['D'], chuTichHdqtTen: ['E'],
      dienThoai: ['F'], diaChi: ['G'], phuongXa: ['H'], dienTichHa: ['I'], vonDieuLe: ['J'],
      soThanhVien: ['M'], linhVuc: ['P'], hoatDong: ['Q'],
      dsThanhVien: ['R'], diaChiMoi: ['U'], ghiChu: ['V'],
    }, COOPERATIVE_IMPORT_COLUMN_LABELS)
    importStartRow.value = 10
  }
}

function resolveDefaultImportExampleConfig(configs: CooperativeImportExampleConfig[]) {
  return (
    configs.find((item) => item.code === HTX_STC_EXAMPLE_CONFIG_CODE)
    ?? configs.find((item) => item.name === HTX_STC_EXAMPLE_CONFIG_NAME)
    ?? configs[0]
    ?? null
  )
}

function applyDefaultImportExampleConfig() {
  const config = resolveDefaultImportExampleConfig(importExampleConfigs.value)
  if (!config) return
  selectedImportConfigId.value = config.id
  selectedImportFormatId.value = ''
  applyImportMapping(config)
}

async function loadImportExampleConfigs() {
  try {
    importExampleConfigs.value = await cooperativeService.getImportConfigs()
    applyDefaultImportExampleConfig()
  } catch {
    importExampleConfigs.value = []
  }
}

async function loadImportFormats() {
  try {
    importFormats.value = await cooperativeService.getImportFormats()
  } catch {
    importFormats.value = []
  }
}

function applyImportMapping(config: { startRow: number; columnMap: CooperativeImportColumnMap }) {
  importStartRow.value = config.startRow
  applyImportColumnMap(config.columnMap, COOPERATIVE_IMPORT_COLUMN_LABELS)
}

function applySelectedImportConfig() {
  if (selectedImportConfigId.value === '') return
  const config = importExampleConfigs.value.find((item) => item.id === selectedImportConfigId.value)
  if (config) {
    selectedImportFormatId.value = ''
    importFormatName.value = ''
    applyImportMapping(config)
  }
}

function applySelectedImportFormat() {
  if (selectedImportFormatId.value === '') return
  const format = importFormats.value.find((item) => item.id === selectedImportFormatId.value)
  if (format) {
    selectedImportConfigId.value = ''
    applyImportMapping(format)
    importFormatName.value = format.name
  }
}

async function handleSaveImportFormat() {
  const name = importFormatName.value.trim()
  if (!name) return

  savingImportFormat.value = true
  importError.value = null
  try {
    const saved = await cooperativeService.saveImportFormat({ name, startRow: importStartRow.value, columnMap: buildImportColumnMap() })
    await loadImportFormats()
    selectedImportFormatId.value = saved.id
    importFormatName.value = saved.name
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    importError.value = axiosErr.response?.data?.message ?? 'Lưu format thất bại.'
  } finally {
    savingImportFormat.value = false
  }
}

async function handleDeleteImportFormat() {
  if (!selectedImportFormatId.value) return

  deletingImportFormat.value = true
  importError.value = null
  try {
    await cooperativeService.deleteImportFormat(Number(selectedImportFormatId.value))
    selectedImportFormatId.value = ''
    importFormatName.value = ''
    await loadImportFormats()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    importError.value = axiosErr.response?.data?.message ?? 'Xóa format thất bại.'
  } finally {
    deletingImportFormat.value = false
  }
}

function onImportFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  selectedImportFile.value = input.files?.[0] ?? null
  importResult.value = null
  importError.value = null
}

async function handleImport() {
  if (!selectedImportFile.value) return
  importing.value = true
  importError.value = null
  importResult.value = null
  importQueuedMessage.value = null
  try {
    const queued = await cooperativeService.importExcel(selectedImportFile.value, {
      startRow: importStartRow.value,
      columnMap: buildImportColumnMap(),
    })
    queuedImportJobId.value = queued.importJobId
    trackImportJob(queued.importJobId)
    importQueuedMessage.value = `File "${queued.originalFilename ?? selectedImportFile.value.name}" đã được đưa vào hàng đợi.`
    pollImportJob(queued.importJobId)
  } catch (err: unknown) {
    importError.value = formatImportUploadError(err, 'Nhập Excel thất bại.')
    importing.value = false
    queuedImportJobId.value = null
    importQueuedMessage.value = null
    clearImportJob()
    if (pollTimer) clearInterval(pollTimer)
  }
}

let pollTimer: ReturnType<typeof setInterval> | null = null

function pollImportJob(jobId: number) {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const status = await cooperativeService.getImportJobStatus(jobId)
      if (status.status === 'completed' && status.result) {
        finishImport(status.result)
      } else if (status.status === 'failed') {
        importError.value = status.errorMessage ?? 'Import thất bại.'
        importing.value = false
        if (pollTimer) clearInterval(pollTimer)
      }
    } catch {
      // ignore transient errors
    }
  }, 4000)
}

function finishImport(result: CooperativeImportResult) {
  importResult.value = result
  importing.value = false
  importQueuedMessage.value = null
  queuedImportJobId.value = null
  clearImportJob()
  if (pollTimer) clearInterval(pollTimer)
  void store.fetchCooperatives(currentFilters())
}

function openImportModal() {
  showImportModal.value = true
  selectedImportFile.value = null
  importError.value = null
  importResult.value = null
  importQueuedMessage.value = null
  showImportColumnConfig.value = true
  selectedImportFormatId.value = ''
  importFormatName.value = ''
  void Promise.all([
    loadImportColumnMapDefaults(),
    loadImportExampleConfigs(),
    loadImportFormats(),
    loadImportScopeOrgUnits(),
  ])
}

function closeImportModal() {
  showImportModal.value = false
  selectedImportFile.value = null
  if (importFileInput.value) {
    importFileInput.value.value = ''
  }
  if (pollTimer) clearInterval(pollTimer)
}

function openImportHistory() {
  showImportHistory.value = true
}

onImportCompleted((payload) => {
  if (payload.entity !== 'hop-tac-xa' || !payload.result) return
  if (queuedImportJobId.value && payload.importJobId !== queuedImportJobId.value) return
  finishImport(payload.result as CooperativeImportResult)
})

onImportFailed((payload) => {
  if (payload.entity !== 'hop-tac-xa') return
  if (queuedImportJobId.value && payload.importJobId !== queuedImportJobId.value) return
  importError.value = payload.message ?? 'Import thất bại.'
  importing.value = false
  importQueuedMessage.value = null
})

onMounted(async () => {
  orgUnits.value = await orgUnitService.getTree()
  if (HIDE_PROVINCE_FILTER) {
    const provinces = await locationService.getProvinces()
    const province = provinces.find((item) => item.code === DEFAULT_PROVINCE_CODE)
    // HTX filter uses phuongXa only
  }
  await store.fetchCooperatives(currentFilters())
})

let filterTimer: ReturnType<typeof setTimeout> | null = null
watch([filter, () => store.page, () => store.perPage], () => {
  if (filterTimer) clearTimeout(filterTimer)
  filterTimer = setTimeout(() => {
    void store.fetchCooperatives(currentFilters())
  }, 300)
}, { deep: true })
</script>
