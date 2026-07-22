<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-1 dark:border-gray-700">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium transition"
          :class="
            activeTab === tab.key
              ? 'bg-brand-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          "
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Đơn vị hành chính mới -->
      <ComponentCard v-if="activeTab === 'new'" title="Đơn vị hành chính mới">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <input
            v-model="newSearch"
            type="search"
            placeholder="Tìm theo tên đơn vị, loại..."
            class="h-9 min-w-[220px] flex-1 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
            @keyup.enter="loadNewUnits(1)"
          />
          <button
            type="button"
            class="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
            @click="loadNewUnits(1)"
          >
            Tìm
          </button>
          <button
            v-if="canManage"
            type="button"
            class="h-9 rounded-lg border border-red-300 px-4 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
            :disabled="clearingNew || importing"
            @click="confirmClearNewData"
          >
            {{ clearingNew ? 'Đang xóa...' : 'Xóa dữ liệu' }}
          </button>
        </div>

        <div v-if="newLoading" class="flex items-center justify-center py-10">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[640px] w-full border-collapse text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Đơn vị hành chính mới</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Loại (mới)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in newUnits" :key="item.code">
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.fullName }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.unitType ?? '-' }}</td>
              </tr>
              <tr v-if="newUnits.length === 0">
                <td colspan="2" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Chưa có dữ liệu. Import Excel bên dưới.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="newTotalPages > 1" class="mt-4 flex items-center justify-end gap-2 text-sm">
          <button type="button" class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600" :disabled="newPage <= 1" @click="loadNewUnits(newPage - 1)">Trước</button>
          <span>{{ newPage }} / {{ newTotalPages }}</span>
          <button type="button" class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600" :disabled="newPage >= newTotalPages" @click="loadNewUnits(newPage + 1)">Sau</button>
        </div>

        <div v-if="canManage" class="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">Import Excel đơn vị hành chính mới</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            2 cột: Đơn vị hành chính mới · Loại (mới). File riêng dùng A/B; file mapping đầy đủ dùng F/G.
          </p>
          <div class="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">File Excel</label>
                <input type="file" accept=".xlsx,.xls,.csv" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" @change="onNewExcelSelected" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Dòng bắt đầu</label>
                <input v-model.number="newImportStartRow" type="number" min="1" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="rounded border border-gray-300 px-3 py-1 text-xs dark:border-gray-600" @click="useNewMappingPreset">
                File mapping (F/G)
              </button>
              <button type="button" class="rounded border border-gray-300 px-3 py-1 text-xs dark:border-gray-600" @click="useNewStandalonePreset">
                File 2 cột (A/B)
              </button>
            </div>
            <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div v-for="(label, key) in newImportColumnLabels" :key="key" class="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                <p class="mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">{{ label }}</p>
                <input v-model="newImportColumnInputs[key]" type="text" class="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900" placeholder="VD: A" />
              </div>
            </div>
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50" :disabled="importing || !selectedNewImportFile" @click="importNewExcel">
              Import đơn vị mới
            </button>
            <p v-if="newClearResult" class="text-sm text-amber-700 dark:text-amber-300">
              Đã xóa {{ newClearResult.wards }} đơn vị mới, {{ newClearResult.mappings }} mapping, reset {{ newClearResult.companiesReset }} doanh nghiệp.
            </p>
            <p v-if="newOnlyImportResult" class="text-sm text-green-600 dark:text-green-400">
              Đơn vị mới: {{ newOnlyImportResult.wards ?? 0 }}, cập nhật: {{ newOnlyImportResult.wardsUpdated ?? 0 }},
              bỏ qua: {{ newOnlyImportResult.skipped ?? 0 }}, dòng đọc: {{ newOnlyImportResult.rows ?? 0 }}.
            </p>
            <p v-if="actionError && activeTab === 'new'" class="text-sm text-red-600 dark:text-red-400">{{ actionError }}</p>
          </div>
        </div>
      </ComponentCard>

      <!-- Đơn vị hành chính cũ -->
      <ComponentCard v-else-if="activeTab === 'legacy'" title="Đơn vị hành chính cũ">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <input
            v-model="legacySearch"
            type="search"
            placeholder="Tìm theo huyện, đơn vị, loại..."
            class="h-9 min-w-[220px] flex-1 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
            @keyup.enter="loadLegacyUnits(1)"
          />
          <button
            type="button"
            class="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
            @click="loadLegacyUnits(1)"
          >
            Tìm
          </button>
        </div>

        <div v-if="legacyLoading" class="flex items-center justify-center py-10">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[720px] w-full border-collapse text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Huyện/Thị xã/Thành phố cũ</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Đơn vị hành chính cũ</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Loại (cũ)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in legacyUnits" :key="item.code">
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ item.quanHuyenCu?.fullName ?? '-' }}
                </td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.fullName }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.unitType ?? '-' }}</td>
              </tr>
              <tr v-if="legacyUnits.length === 0">
                <td colspan="3" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Chưa có dữ liệu. Import Excel bên dưới.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="legacyTotalPages > 1" class="mt-4 flex items-center justify-end gap-2 text-sm">
          <button type="button" class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600" :disabled="legacyPage <= 1" @click="loadLegacyUnits(legacyPage - 1)">Trước</button>
          <span>{{ legacyPage }} / {{ legacyTotalPages }}</span>
          <button type="button" class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600" :disabled="legacyPage >= legacyTotalPages" @click="loadLegacyUnits(legacyPage + 1)">Sau</button>
        </div>

        <div v-if="canManage" class="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">Import Excel đơn vị hành chính cũ</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            3 cột: Huyện/Thị xã/Thành phố cũ · Đơn vị hành chính cũ · Loại (cũ). Không lưu tỉnh.
          </p>
          <div class="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">File Excel</label>
                <input type="file" accept=".xlsx,.xls,.csv" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" @change="onLegacyOnlyExcelSelected" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Dòng bắt đầu</label>
                <input v-model.number="legacyOnlyImportStartRow" type="number" min="1" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
              <div v-for="(label, key) in legacyOnlyColumnLabels" :key="key" class="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                <p class="mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">{{ label }}</p>
                <input v-model="legacyOnlyColumnInputs[key]" type="text" class="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900" placeholder="VD: A" />
              </div>
            </div>
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50" :disabled="importing || !selectedLegacyOnlyImportFile" @click="importLegacyExcelOnly">
              Import đơn vị cũ
            </button>
            <p v-if="legacyOnlyImportResult" class="text-sm text-green-600 dark:text-green-400">
              Huyện mới: {{ legacyOnlyImportResult.districts ?? 0 }}, cập nhật: {{ legacyOnlyImportResult.districtsUpdated ?? 0 }},
              đơn vị mới: {{ legacyOnlyImportResult.wards ?? 0 }}, cập nhật: {{ legacyOnlyImportResult.wardsUpdated ?? 0 }},
              bỏ qua: {{ legacyOnlyImportResult.skipped ?? 0 }}, dòng đọc: {{ legacyOnlyImportResult.rows ?? 0 }}.
            </p>
            <p v-if="actionError && activeTab === 'legacy'" class="text-sm text-red-600 dark:text-red-400">{{ actionError }}</p>
          </div>
        </div>
      </ComponentCard>

      <!-- Danh mục hành chính hợp nhất -->
      <ComponentCard v-else-if="activeTab === 'catalog'" title="Danh mục hành chính hợp nhất (tỉnh / quận huyện / phường xã)">
        <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Mỗi record có loại <strong>cũ</strong> hoặc <strong>mới</strong>. Dữ liệu được tạo từ danh mục hiện có và từ
          tính năng đồng bộ text doanh nghiệp (tab Import &amp; đồng bộ, mục 3).
        </p>
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <select
            v-model="catalogCap"
            class="h-9 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
            @change="loadCatalog(1)"
          >
            <option value="tinh">Bảng tỉnh</option>
            <option value="quan-huyen">Bảng quận huyện</option>
            <option value="phuong-xa">Bảng phường xã</option>
          </select>
          <select
            v-model="catalogLoai"
            class="h-9 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
            @change="loadCatalog(1)"
          >
            <option value="">Tất cả loại</option>
            <option value="cu">Cũ</option>
            <option value="moi">Mới</option>
          </select>
          <input
            v-model="catalogSearch"
            type="search"
            placeholder="Tìm theo tên..."
            class="h-9 min-w-[220px] flex-1 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
            @keyup.enter="loadCatalog(1)"
          />
          <button
            type="button"
            class="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
            @click="loadCatalog(1)"
          >
            Tìm
          </button>
        </div>

        <div v-if="catalogLoading" class="flex items-center justify-center py-10">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[640px] w-full border-collapse text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">ID</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Tên</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Loại</th>
                <th v-if="catalogCap !== 'tinh'" class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Cấp cha</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Mã (nếu có)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in catalogItems" :key="item.id">
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.id }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.ten }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  <span
                    class="rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="item.loai === 'moi'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
                  >
                    {{ item.loai === 'moi' ? 'Mới' : 'Cũ' }}
                  </span>
                </td>
                <td v-if="catalogCap !== 'tinh'" class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ item.quanHuyen?.ten ?? item.tinh?.ten ?? '-' }}
                </td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.ma ?? '-' }}</td>
              </tr>
              <tr v-if="catalogItems.length === 0">
                <td :colspan="catalogCap !== 'tinh' ? 5 : 4" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Chưa có dữ liệu. Chạy đồng bộ text doanh nghiệp ở tab Import &amp; đồng bộ.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="catalogTotalPages > 1" class="mt-4 flex items-center justify-end gap-2 text-sm">
          <button type="button" class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600" :disabled="catalogPage <= 1" @click="loadCatalog(catalogPage - 1)">Trước</button>
          <span>{{ catalogPage }} / {{ catalogTotalPages }}</span>
          <button type="button" class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600" :disabled="catalogPage >= catalogTotalPages" @click="loadCatalog(catalogPage + 1)">Sau</button>
        </div>

        <p v-if="actionError && activeTab === 'catalog'" class="mt-4 text-sm text-red-600 dark:text-red-400">{{ actionError }}</p>
      </ComponentCard>

      <!-- Import & đồng bộ -->
      <ComponentCard v-else-if="activeTab === 'import'" title="Import dữ liệu & đồng bộ doanh nghiệp">
        <div v-if="!canManage" class="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Bạn chỉ có quyền xem. Cần quyền <strong>feature.cadastral.manage</strong> để import và đồng bộ.
        </div>

        <div v-else class="space-y-6">
          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">1. Import dữ liệu hành chính mới</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Nạp tỉnh/xã mới từ file <code>vn_provinces.json</code>. Nên import trước khi import mapping cũ → mới.
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                :disabled="importing"
                @click="importNewDataset(['91'])"
              >
                Import An Giang (91)
              </button>
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                :disabled="importing"
                @click="importNewDataset()"
              >
                Import toàn bộ dataset
              </button>
            </div>
            <p v-if="newImportResult" class="text-sm text-green-600 dark:text-green-400">
              Đã import mới: {{ newImportResult.provinces ?? 0 }} tỉnh, {{ newImportResult.wards ?? 0 }} xã/phường.
            </p>
          </section>

          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">2. Import dữ liệu cũ + mapping</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Import trực tiếp từ Excel theo mẫu bảng hành chính cũ → mới (như file mapping bạn đang dùng).
            </p>
            <div class="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div class="md:col-span-2">
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">File Excel</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                    @change="onLegacyExcelSelected"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Dòng bắt đầu dữ liệu</label>
                  <input
                    v-model.number="legacyImportStartRow"
                    type="number"
                    min="1"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Mẫu hệ thống</label>
                  <select
                    v-model.number="selectedLegacyImportConfigId"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                    @change="applySelectedLegacyConfig"
                  >
                    <option :value="0">Chọn mẫu</option>
                    <option
                      v-for="item in legacyImportExampleConfigs"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Format cá nhân</label>
                  <select
                    v-model.number="selectedLegacyImportFormatId"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                    @change="applySelectedLegacyFormat"
                  >
                    <option :value="0">Chọn format</option>
                    <option
                      v-for="item in legacyImportFormats"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Tên format để lưu</label>
                  <input
                    v-model.trim="legacyImportFormatName"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                    placeholder="VD: Mapping An Giang"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                <div v-for="(label, key) in legacyImportColumnLabels" :key="key" class="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                  <p class="mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">{{ label }}</p>
                  <input
                    v-model="legacyImportColumnInputs[key]"
                    type="text"
                    class="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900"
                    placeholder="VD: A hoặc A-C"
                  />
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                  :disabled="importing || !selectedLegacyImportFile"
                  @click="importLegacyExcel"
                >
                  Import Excel cũ & mapping
                </button>
                <button
                  type="button"
                  class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  :disabled="importing || !legacyImportFormatName"
                  @click="saveLegacyImportFormat"
                >
                  Lưu format
                </button>
                <button
                  type="button"
                  class="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:hover:bg-red-900/30"
                  :disabled="importing || !selectedLegacyImportFormatId"
                  @click="deleteLegacyImportFormat"
                >
                  Xóa format
                </button>
              </div>
            </div>
            <p v-if="legacyImportResult" class="text-sm text-green-600 dark:text-green-400">
              Huyện mới: {{ legacyImportResult.districts ?? 0 }}, cập nhật: {{ legacyImportResult.districtsUpdated ?? 0 }},
              đơn vị mới: {{ legacyImportResult.wards ?? 0 }}, cập nhật: {{ legacyImportResult.wardsUpdated ?? 0 }},
              mapping mới: {{ legacyImportResult.mappings ?? 0 }}, cập nhật: {{ legacyImportResult.mappingsUpdated ?? 0 }},
              bỏ qua: {{ legacyImportResult.skipped ?? 0 }}, dòng đọc: {{ legacyImportResult.rows ?? 0 }}.
            </p>
          </section>

          <section class="space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">3. Tạo danh mục từ text doanh nghiệp</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Tạo record vào 3 bảng danh mục hợp nhất (tỉnh / quận huyện / phường xã, loại cũ hoặc mới) từ field text
              và gán ID liên kết từng field. Field đã có ID (đã sync) sẽ bỏ qua. Dữ liệu text gốc không bị thay đổi.
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-600"
                :disabled="textCatalogSyncing"
                @click="runTextCatalogSync(true)"
              >
                Xem trước
              </button>
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                :disabled="textCatalogSyncing"
                @click="runTextCatalogSync(false)"
              >
                {{ textCatalogSyncing ? 'Đang đồng bộ...' : 'Tạo danh mục và liên kết' }}
              </button>
            </div>
            <div v-if="textCatalogSyncResult" class="rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/60">
              <p>
                Quét: {{ textCatalogSyncResult.scanned }} · DN cập nhật: {{ textCatalogSyncResult.updatedCompanies }}
                · Đã sync (bỏ qua): {{ textCatalogSyncResult.alreadySynced }}
                · Tỉnh tạo mới: {{ textCatalogSyncResult.createdTinh }}
                · Quận huyện tạo mới: {{ textCatalogSyncResult.createdQuanHuyen }}
                · Phường xã tạo mới: {{ textCatalogSyncResult.createdPhuongXa }}
              </p>
            </div>
          </section>

          <section class="space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">4. Group-by dữ liệu thô → danh mục</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Gom nhóm text thô trên doanh nghiệp (xã/huyện/tỉnh cũ hoặc mới), xem trước, rồi lưu vào bảng danh mục hợp nhất
              đúng loại <code class="text-xs">cu</code> / <code class="text-xs">moi</code> và liên kết lại DN.
            </p>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Chọn field</label>
                <select
                  v-model="fieldSyncField"
                  class="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
                  @change="rawGroupsPreview = null; rawGroupsCommitResult = null; selectedRawGroupNames = []"
                >
                  <option v-for="option in fieldSyncOptions" :key="option.key" :value="option.key">
                    {{ option.label }} → {{ option.catalog }} ({{ option.loai }})
                  </option>
                </select>
              </div>
              <div class="flex items-end">
                <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input v-model="rawGroupsLinkCompanies" type="checkbox" class="rounded border-gray-300" />
                  Liên kết ID trên doanh nghiệp sau khi lưu
                </label>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                :disabled="rawGroupsLoading || fieldSyncing"
                @click="loadRawGroupsPreview"
              >
                {{ rawGroupsLoading ? 'Đang group...' : 'Xem trước (GROUP BY)' }}
              </button>
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                :disabled="rawGroupsCommitting || !rawGroupsPreview || selectedRawGroupNames.length === 0"
                @click="commitSelectedRawGroups"
              >
                {{ rawGroupsCommitting ? 'Đang lưu...' : `Lưu ${selectedRawGroupNames.length} giá trị đã chọn` }}
              </button>
              <button
                type="button"
                class="rounded-lg border border-brand-300 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50 dark:border-brand-700 dark:text-brand-300"
                :disabled="rawGroupsCommitting || !rawGroupsPreview || (rawGroupsPreview?.newGroups ?? 0) === 0"
                @click="commitNewRawGroups"
              >
                Lưu tất cả giá trị mới
              </button>
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
                :disabled="fieldSyncing"
                @click="runFieldSync(false)"
              >
                Chỉ đồng bộ liên kết (không tạo mới)
              </button>
            </div>
            <div v-if="rawGroupsPreview" class="space-y-3">
              <div class="rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/60">
                <p>
                  {{ rawGroupsPreview.label }} · {{ rawGroupsPreview.catalog }} · loại
                  <strong>{{ rawGroupsPreview.loai }}</strong>
                </p>
                <p class="mt-1">
                  Nhóm: {{ rawGroupsPreview.totalGroups }}
                  · Mới: {{ rawGroupsPreview.newGroups }}
                  · Đã có: {{ rawGroupsPreview.existingGroups }}
                  · DN liên quan: {{ rawGroupsPreview.totalCompanies }}
                </p>
              </div>
              <div class="flex flex-wrap gap-2 text-sm">
                <button type="button" class="text-brand-600 hover:underline" @click="selectAllNewRawGroups">
                  Chọn tất cả mới
                </button>
                <button type="button" class="text-gray-600 hover:underline dark:text-gray-300" @click="clearRawGroupSelection">
                  Bỏ chọn
                </button>
              </div>
              <div class="max-h-96 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table class="min-w-full text-left text-sm">
                  <thead class="sticky top-0 bg-gray-100 text-xs uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <tr>
                      <th class="px-3 py-2 w-10"></th>
                      <th class="px-3 py-2">Tên (group by)</th>
                      <th class="px-3 py-2 w-24">Số DN</th>
                      <th class="px-3 py-2 w-36">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="group in rawGroupsPreview.groups"
                      :key="group.ten"
                      class="border-t border-gray-100 dark:border-gray-800"
                      :class="group.existsInCatalog ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''"
                    >
                      <td class="px-3 py-2">
                        <input
                          v-model="selectedRawGroupNames"
                          type="checkbox"
                          class="rounded border-gray-300"
                          :value="group.ten"
                          :disabled="group.existsInCatalog"
                        />
                      </td>
                      <td class="px-3 py-2 font-medium text-gray-800 dark:text-white/90">{{ group.ten }}</td>
                      <td class="px-3 py-2 tabular-nums">{{ group.count }}</td>
                      <td class="px-3 py-2">
                        <span v-if="group.existsInCatalog" class="text-emerald-700 dark:text-emerald-300">
                          Đã có (#{{ group.existingId }})
                        </span>
                        <span v-else class="text-amber-700 dark:text-amber-300">Chưa có → sẽ tạo</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-if="rawGroupsCommitResult" class="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
              Đã tạo mới: {{ rawGroupsCommitResult.created }} · Bỏ qua (đã có): {{ rawGroupsCommitResult.skippedExisting }}
              <template v-if="rawGroupsCommitResult.link">
                · Liên kết DN: cập nhật {{ rawGroupsCommitResult.link.updated }}, tạo thêm {{ rawGroupsCommitResult.link.created }}
              </template>
            </div>
            <div v-if="fieldSyncResult" class="rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/60">
              <p>
                Đồng bộ liên kết — Quét: {{ fieldSyncResult.scanned }} · Khớp: {{ fieldSyncResult.matched }}
                · Tạo mới: {{ fieldSyncResult.created }} · Cập nhật: {{ fieldSyncResult.updated }}
                · Đã liên kết: {{ fieldSyncResult.alreadyLinked }} · Không có text: {{ fieldSyncResult.skipped }}
              </p>
            </div>
          </section>

          <section class="space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">5. Đồng bộ doanh nghiệp (đầy đủ)</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Khớp doanh nghiệp theo quận/huyện + phường/xã cũ, cập nhật sang đơn vị hành chính mới.
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                :disabled="syncing"
                @click="runSync(true)"
              >
                Dry-run (xem trước)
              </button>
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                :disabled="syncing"
                @click="runSync(false)"
              >
                Đồng bộ thực tế
              </button>
            </div>
            <div v-if="syncResult" class="rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/60">
              <p>Khớp: {{ syncResult.matched }} · Cập nhật: {{ syncResult.updated }} · Bỏ qua: {{ syncResult.skipped }}</p>
              <p v-if="syncResult.unmapped.length" class="mt-1 text-amber-700 dark:text-amber-300">
                Chưa map được: {{ syncResult.unmapped.length }} doanh nghiệp
              </p>
            </div>
          </section>

          <p v-if="actionError" class="text-sm text-red-600 dark:text-red-400">{{ actionError }}</p>
        </div>
      </ComponentCard>

      <!-- Liên kết cũ → mới -->
      <ComponentCard v-else title="Liên kết đơn vị hành chính cũ → mới">
        <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Nhiều đơn vị cũ có thể liên kết với một đơn vị mới, và một đơn vị cũ cũng có thể liên kết nhiều đơn vị mới
          (ví dụ: Phước Hưng (một phần) → An Phú và Khánh Bình).
        </p>

        <div v-if="canManage" class="mb-6 space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">Tạo liên kết thủ công</h3>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Huyện/Thị xã (cũ)</label>
              <SearchableSelect
                v-model="linkDistrictCode"
                :options="linkDistrictOptions"
                placeholder="Chọn huyện"
                search-placeholder="Tìm huyện..."
                empty-label="Chọn huyện"
                dense
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Đơn vị hành chính mới</label>
              <SearchableSelect
                v-model="linkNewCode"
                :options="linkNewUnitOptions"
                placeholder="Chọn đơn vị mới"
                search-placeholder="Tìm đơn vị mới..."
                empty-label="Chọn đơn vị mới"
                :loading="linkNewLoading"
                dense
              />
            </div>
          </div>

          <div v-if="linkDistrictCode" class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <p class="mb-2 text-xs font-medium text-gray-700 dark:text-gray-200">Chọn đơn vị cũ (có thể chọn nhiều)</p>
            <input
              v-model="linkLegacySearch"
              type="search"
              placeholder="Tìm đơn vị cũ..."
              class="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
            />
            <div v-if="linkLegacyLoading" class="py-4 text-center text-sm text-gray-500">Đang tải...</div>
            <div v-else class="max-h-48 space-y-1 overflow-y-auto">
              <label
                v-for="ward in filteredLinkLegacyWards"
                :key="ward.code"
                class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                <input v-model="linkSelectedLegacyCodes" type="checkbox" :value="ward.code" class="rounded" />
                <span class="text-sm">
                  {{ ward.fullName }}
                  <span v-if="ward.unitType" class="text-gray-500">({{ ward.unitType }})</span>
                  <span
                    v-if="linkNewCode && isWardLinkedToNew(ward, linkNewCode)"
                    class="text-green-600 dark:text-green-400"
                  >
                    · đang liên kết
                  </span>
                  <span
                    v-for="other in getWardOtherMappings(ward, linkNewCode || undefined)"
                    :key="other.id"
                    class="text-amber-600 dark:text-amber-400"
                  >
                    · → {{ other.xaPhuongMoi?.fullName ?? other.xaPhuongMoiCode }}
                  </span>
                </span>
              </label>
              <p v-if="filteredLinkLegacyWards.length === 0" class="text-sm text-gray-500">
                {{ linkLegacyWards.length === 0 ? 'Không có đơn vị trong huyện này.' : 'Không tìm thấy đơn vị phù hợp.' }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Số nhóm (STT)</label>
              <input
                v-model.number="linkGroupNo"
                type="number"
                min="1"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                placeholder="Tùy chọn"
              />
            </div>
            <div class="md:col-span-2 flex items-end">
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                :disabled="linking || !linkNewCode"
                @click="submitLink"
              >
                {{ linking ? 'Đang lưu...' : 'Lưu liên kết' }}
              </button>
            </div>
          </div>
          <p v-if="linkResult" class="text-sm text-green-600 dark:text-green-400">
            Đã tạo {{ linkResult.created }} liên kết, cập nhật {{ linkResult.updated }}<span v-if="linkResult.deleted">, xóa {{ linkResult.deleted }}</span>.
          </p>
        </div>

        <div v-if="canManage" class="mb-6 space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">Import liên kết từ Excel</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            File mapping đầy đủ (STT, huyện, xã cũ, loại cũ, đơn vị mới, loại mới). Ô gộp được hỗ trợ tự động.
          </p>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div class="md:col-span-2">
              <input type="file" accept=".xlsx,.xls,.csv" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" @change="onMappingExcelSelected" />
            </div>
            <div>
              <input v-model.number="mappingImportStartRow" type="number" min="1" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              :disabled="importing || !selectedMappingImportFile"
              @click="importMappingExcel('full')"
            >
              Import đầy đủ (cũ + liên kết)
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              :disabled="importing || !selectedMappingImportFile"
              @click="importMappingExcel('mapping-only')"
            >
              Chỉ import liên kết
            </button>
          </div>
          <p v-if="mappingImportResult" class="text-sm text-green-600 dark:text-green-400">
            Mapping mới: {{ mappingImportResult.mappings ?? 0 }}, cập nhật: {{ mappingImportResult.mappingsUpdated ?? 0 }},
            bỏ qua: {{ mappingImportResult.skipped ?? 0 }}, dòng đọc: {{ mappingImportResult.rows ?? 0 }}.
          </p>
        </div>

        <div class="mb-4 flex flex-wrap items-center gap-3">
          <input
            v-model="mappingSearch"
            type="search"
            placeholder="Tìm theo tên xã cũ/mới..."
            class="h-9 min-w-[220px] flex-1 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
            @keyup.enter="reloadMappingViews"
          />
          <button type="button" class="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600" @click="reloadMappingViews">
            Tìm
          </button>
          <div class="flex rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium"
              :class="mappingViewMode === 'groups' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-300'"
              @click="mappingViewMode = 'groups'"
            >
              Theo nhóm
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium"
              :class="mappingViewMode === 'list' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-300'"
              @click="mappingViewMode = 'list'"
            >
              Danh sách
            </button>
          </div>
        </div>

        <div v-if="mappingLoading" class="flex items-center justify-center py-10">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>

        <div v-else-if="mappingViewMode === 'groups'" class="space-y-4">
          <div
            v-for="(group, index) in mappingGroups"
            :key="`${group.groupNo ?? 'g'}-${group.xaPhuongMoiCode}-${index}`"
            class="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
          >
            <div class="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Nhóm {{ group.groupNo ?? '-' }}</p>
                <p class="text-base font-semibold text-gray-900 dark:text-white">
                  → {{ group.xaPhuongMoi?.fullName ?? group.xaPhuongMoiCode }}
                  <span v-if="group.newUnitType || group.xaPhuongMoi?.unitType" class="font-normal text-gray-500">
                    ({{ group.newUnitType ?? group.xaPhuongMoi?.unitType }})
                  </span>
                </p>
              </div>
            </div>
            <ul class="space-y-1 border-l-2 border-brand-200 pl-4 dark:border-brand-800">
              <li v-for="legacy in group.legacyUnits" :key="legacy.mappingId" class="flex items-center justify-between gap-2 text-sm">
                <span>
                  {{ legacy.fullName ?? legacy.code }}
                  <span v-if="legacy.unitType" class="text-gray-500">({{ legacy.unitType }})</span>
                  <span v-if="legacy.quanHuyen" class="text-gray-400"> · {{ legacy.quanHuyen.fullName }}</span>
                </span>
                <button
                  v-if="canManage"
                  type="button"
                  class="text-xs text-red-600 hover:underline dark:text-red-400"
                  @click="deleteMappingItem(legacy.mappingId)"
                >
                  Xóa
                </button>
              </li>
            </ul>
          </div>
          <p v-if="mappingGroups.length === 0" class="py-8 text-center text-sm text-gray-500">
            Chưa có liên kết. Tạo thủ công hoặc import từ Excel.
          </p>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table class="min-w-[960px] w-full border-collapse text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Nhóm</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Huyện/Thị xã (cũ)</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Xã/phường cũ</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Xã/phường mới</th>
                <th class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700">Tỉnh mới</th>
                <th v-if="canManage" class="border border-gray-200 px-3 py-3 text-left dark:border-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in mappings" :key="item.id">
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ item.groupNo ?? '-' }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">{{ legacyLocationLabel(item) }}</td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ item.xaPhuongCu?.fullName ?? item.xaPhuongCuCode }}
                  <span v-if="item.xaPhuongCu?.unitType" class="text-gray-500">({{ item.xaPhuongCu.unitType }})</span>
                </td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ item.xaPhuongMoi?.fullName ?? item.xaPhuongMoiCode }}
                  <span v-if="item.newUnitType" class="text-gray-500">({{ item.newUnitType }})</span>
                </td>
                <td class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  {{ item.xaPhuongMoi?.tinhThanh?.fullName ?? item.xaPhuongMoi?.tinhThanhCode ?? '-' }}
                </td>
                <td v-if="canManage" class="border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                  <button type="button" class="text-xs text-red-600 hover:underline dark:text-red-400" @click="deleteMappingItem(item.id)">Xóa</button>
                </td>
              </tr>
              <tr v-if="mappings.length === 0">
                <td :colspan="canManage ? 6 : 5" class="border border-gray-200 px-3 py-6 text-center text-gray-500 dark:border-gray-700">
                  Chưa có liên kết. Tạo thủ công hoặc import từ Excel.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="mappingViewMode === 'list' && mappingTotalPages > 1" class="mt-4 flex items-center justify-end gap-2 text-sm">
          <button type="button" class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600" :disabled="mappingPage <= 1" @click="loadMappings(mappingPage - 1)">Trước</button>
          <span>{{ mappingPage }} / {{ mappingTotalPages }}</span>
          <button type="button" class="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600" :disabled="mappingPage >= mappingTotalPages" @click="loadMappings(mappingPage + 1)">Sau</button>
        </div>

        <p v-if="actionError && activeTab === 'mapping'" class="mt-4 text-sm text-red-600 dark:text-red-400">{{ actionError }}</p>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import SearchableSelect, { type SearchableSelectOption } from '@/components/forms/FormElements/SearchableSelect.vue'
import { hanhChinhService } from '@/services/hanhChinhService'
import { useAuthStore } from '@/stores/auth'
import { columnsToDisplay, parseColumnInput } from '@/utils/excelColumns'
import type {
  HanhChinhImportColumnMap,
  HanhChinhImportExampleConfig,
  HanhChinhImportFormat,
  HanhChinhMappingGroup,
  HanhChinhMappingItem,
  ImportCounts,
  LegacyDistrictItem,
  LegacyWardItem,
  LinkMappingResult,
  NewWardItem,
  NewDataClearResult,
  SyncResult,
  CompanyFieldSyncOption,
  CompanyFieldSyncResult,
  CompanyRawGroupsPreview,
  CompanyRawGroupsCommitResult,
  CompanyAdministrativeField,
  CompanyAdministrativeCatalogSyncResult,
  HanhChinhDanhMucCap,
  HanhChinhDanhMucItem,
  HanhChinhDanhMucLoai,
} from '@/types/hanhChinh'

const getWardMappings = (ward: LegacyWardItem): HanhChinhMappingItem[] => {
  if (ward.mappings?.length) return ward.mappings
  if (ward.mapping) return [ward.mapping]
  return []
}

const isWardLinkedToNew = (ward: LegacyWardItem, newCode: string) =>
  getWardMappings(ward).some((item) => item.xaPhuongMoiCode === newCode)

const getWardOtherMappings = (ward: LegacyWardItem, excludeNewCode?: string) =>
  getWardMappings(ward).filter((item) => item.xaPhuongMoiCode !== excludeNewCode)

const auth = useAuthStore()
const route = useRoute()
const canManage = computed(() => auth.hasPermission('feature.cadastral.manage'))

const tabs = [
  { key: 'new', label: 'Đơn vị hành chính mới' },
  { key: 'legacy', label: 'Đơn vị hành chính cũ' },
  { key: 'catalog', label: 'Danh mục hợp nhất' },
  { key: 'import', label: 'Import & đồng bộ' },
  { key: 'mapping', label: 'Liên kết cũ → mới' },
] as const

type TabKey = (typeof tabs)[number]['key']

const resolveTabFromQuery = (value: unknown): TabKey => {
  const tab = String(value ?? 'new')
  if (tab === 'lookup') return 'new'
  if (tabs.some((item) => item.key === tab)) return tab as TabKey
  return 'new'
}

const activeTab = ref<TabKey>(resolveTabFromQuery(route.query.tab))

const importing = ref(false)
const syncing = ref(false)
const fieldSyncing = ref(false)
const fieldSyncOptions = ref<CompanyFieldSyncOption[]>([])
const fieldSyncField = ref<CompanyAdministrativeField>('phuongXaCu')
const fieldSyncResult = ref<CompanyFieldSyncResult | null>(null)
const rawGroupsLoading = ref(false)
const rawGroupsCommitting = ref(false)
const rawGroupsPreview = ref<CompanyRawGroupsPreview | null>(null)
const rawGroupsCommitResult = ref<CompanyRawGroupsCommitResult | null>(null)
const selectedRawGroupNames = ref<string[]>([])
const rawGroupsLinkCompanies = ref(true)
const actionError = ref('')

const newLoading = ref(false)
const newUnits = ref<NewWardItem[]>([])
const newSearch = ref('')
const newPage = ref(1)
const newTotalPages = ref(1)
const newImportStartRow = ref(2)
const newImportColumnLabels = ref<Record<string, string>>({})
const newImportColumnInputs = ref<Record<string, string>>({})
const newImportDefaultColumnMap = ref<HanhChinhImportColumnMap>({})
const newStandaloneColumnMap = ref<HanhChinhImportColumnMap>({})
const newMappingColumnMap = ref<HanhChinhImportColumnMap>({})
const newStandaloneStartRow = ref(2)
const newMappingStartRow = ref(2)
const selectedNewImportFile = ref<File | null>(null)
const newOnlyImportResult = ref<ImportCounts | null>(null)
const clearingNew = ref(false)
const newClearResult = ref<NewDataClearResult | null>(null)

const selectedLegacyImportFile = ref<File | null>(null)
const legacyImportStartRow = ref(2)
const legacyImportColumnLabels = ref<Record<string, string>>({})
const legacyOnlyColumnLabels = ref<Record<string, string>>({})
const legacyOnlyColumnInputs = ref<Record<string, string>>({})
const legacyOnlyImportStartRow = ref(2)
const selectedLegacyOnlyImportFile = ref<File | null>(null)
const legacyOnlyImportResult = ref<ImportCounts | null>(null)
const legacyImportColumnInputs = ref<Record<string, string>>({})
const legacyImportExampleConfigs = ref<HanhChinhImportExampleConfig[]>([])
const legacyImportFormats = ref<HanhChinhImportFormat[]>([])
const selectedLegacyImportConfigId = ref(0)
const selectedLegacyImportFormatId = ref(0)
const legacyImportFormatName = ref('')
const newImportResult = ref<ImportCounts | null>(null)
const legacyImportResult = ref<ImportCounts | null>(null)
const syncResult = ref<SyncResult | null>(null)
const textCatalogSyncing = ref(false)
const textCatalogSyncResult = ref<CompanyAdministrativeCatalogSyncResult | null>(null)

const catalogCap = ref<HanhChinhDanhMucCap>('tinh')
const catalogLoai = ref<HanhChinhDanhMucLoai | ''>('')
const catalogSearch = ref('')
const catalogItems = ref<HanhChinhDanhMucItem[]>([])
const catalogLoading = ref(false)
const catalogPage = ref(1)
const catalogTotalPages = ref(1)

const loadCatalog = async (page = 1) => {
  catalogLoading.value = true
  actionError.value = ''
  try {
    const response = await hanhChinhService.getDanhMuc({
      cap: catalogCap.value,
      loai: catalogLoai.value,
      search: catalogSearch.value.trim(),
      page,
      perPage: 50,
    })
    catalogItems.value = response.data
    catalogPage.value = response.meta?.current_page ?? page
    catalogTotalPages.value = response.meta?.last_page ?? 1
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Không tải được danh mục hợp nhất'
  } finally {
    catalogLoading.value = false
  }
}

const mappingLoading = ref(false)
const mappings = ref<HanhChinhMappingItem[]>([])
const mappingGroups = ref<HanhChinhMappingGroup[]>([])
const mappingSearch = ref('')
const mappingPage = ref(1)
const mappingTotalPages = ref(1)
const mappingViewMode = ref<'groups' | 'list'>('groups')

const linking = ref(false)
const linkDistricts = ref<LegacyDistrictItem[]>([])
const linkDistrictCode = ref('')
const linkLegacyWards = ref<LegacyWardItem[]>([])
const linkLegacyLoading = ref(false)
const linkSelectedLegacyCodes = ref<string[]>([])
const linkLegacySearch = ref('')
const linkNewCode = ref('')
const linkNewOptions = ref<NewWardItem[]>([])
const linkNewLoading = ref(false)
const linkGroupNo = ref<number | null>(null)
const linkResult = ref<LinkMappingResult | null>(null)

const linkDistrictOptions = computed<SearchableSelectOption[]>(() =>
  linkDistricts.value.map((district) => ({
    value: district.code,
    label: district.fullName,
    searchText: district.fullName,
  })),
)

const linkNewUnitOptions = computed<SearchableSelectOption[]>(() =>
  linkNewOptions.value.map((unit) => ({
    value: unit.code,
    label: unit.unitType ? `${unit.fullName} (${unit.unitType})` : unit.fullName,
    searchText: `${unit.fullName} ${unit.unitType ?? ''} ${unit.code}`,
  })),
)

const filteredLinkLegacyWards = computed(() => {
  const query = linkLegacySearch.value.trim().toLowerCase()
  if (!query) return linkLegacyWards.value

  return linkLegacyWards.value.filter((ward) => {
    const linkedNames = getWardMappings(ward)
      .map((item) => item.xaPhuongMoi?.fullName ?? '')
      .join(' ')
    const haystack = `${ward.fullName} ${ward.unitType ?? ''} ${linkedNames}`.toLowerCase()
    return haystack.includes(query)
  })
})

const selectedMappingImportFile = ref<File | null>(null)
const mappingImportStartRow = ref(2)
const mappingImportResult = ref<ImportCounts | null>(null)

const legacyLoading = ref(false)
const legacyUnits = ref<LegacyWardItem[]>([])
const legacySearch = ref('')
const legacyPage = ref(1)
const legacyTotalPages = ref(1)

const applyNewImportColumnMap = (
  columnMap: HanhChinhImportColumnMap,
  labels?: Record<string, string>,
) => {
  if (labels) {
    newImportColumnLabels.value = { ...labels }
  }

  const nextInputs: Record<string, string> = {}
  for (const [key, label] of Object.entries(newImportColumnLabels.value)) {
    const mapped = columnMap[key] ?? []
    nextInputs[key] = columnsToDisplay(mapped)
    if (!label) {
      newImportColumnLabels.value[key] = key
    }
  }
  newImportColumnInputs.value = nextInputs
}

const buildNewImportColumnMap = (): HanhChinhImportColumnMap => {
  const map: HanhChinhImportColumnMap = { ...newImportDefaultColumnMap.value }
  for (const [key, input] of Object.entries(newImportColumnInputs.value)) {
    const parsed = parseColumnInput(input)
    if (parsed.length > 0) {
      map[key] = parsed
    }
  }
  return map
}

const useNewMappingPreset = () => {
  newImportDefaultColumnMap.value = { ...newMappingColumnMap.value }
  newImportStartRow.value = newMappingStartRow.value
  applyNewImportColumnMap(newMappingColumnMap.value)
}

const useNewStandalonePreset = () => {
  newImportDefaultColumnMap.value = { ...newStandaloneColumnMap.value }
  newImportStartRow.value = newStandaloneStartRow.value
  applyNewImportColumnMap(newStandaloneColumnMap.value)
}

const loadNewImportConfig = async () => {
  const baseConfig = await hanhChinhService.getNewImportColumnMap()
  newStandaloneColumnMap.value = baseConfig.standaloneColumnMap ?? { xaPhuongMoi: ['A'], loaiMoi: ['B'] }
  newMappingColumnMap.value = baseConfig.mappingColumnMap ?? baseConfig.columnMap
  newStandaloneStartRow.value = baseConfig.standaloneStartRow ?? 2
  newMappingStartRow.value = baseConfig.mappingStartRow ?? baseConfig.startRow ?? 2
  newImportDefaultColumnMap.value = { ...newMappingColumnMap.value }
  newImportStartRow.value = newMappingStartRow.value
  applyNewImportColumnMap(newMappingColumnMap.value, baseConfig.columnLabels)
}

const loadNewUnits = async (page = 1) => {
  newLoading.value = true
  try {
    const response = await hanhChinhService.getNewUnits({
      page,
      perPage: 50,
      search: newSearch.value.trim() || undefined,
    })
    newUnits.value = response.data
    newPage.value = response.meta?.current_page ?? page
    newTotalPages.value = response.meta?.last_page ?? 1
  } finally {
    newLoading.value = false
  }
}

const onNewExcelSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedNewImportFile.value = input.files?.[0] ?? null
}

const importNewExcel = async () => {
  if (!selectedNewImportFile.value) return
  importing.value = true
  actionError.value = ''
  try {
    newOnlyImportResult.value = await hanhChinhService.importNewFromExcel(selectedNewImportFile.value, {
      startRow: newImportStartRow.value,
      columnMap: buildNewImportColumnMap(),
    })
    await loadNewUnits(1)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Import Excel đơn vị mới thất bại'
  } finally {
    importing.value = false
  }
}

const confirmClearNewData = async () => {
  clearingNew.value = true
  actionError.value = ''
  newClearResult.value = null
  try {
    const preview = await hanhChinhService.getNewClearPreview()
    const message = [
      'Xóa toàn bộ đơn vị hành chính mới để import lại?',
      '',
      `• Đơn vị mới: ${preview.wards}`,
      `• Mapping cũ→mới: ${preview.mappings} (sẽ bị xóa)`,
      `• Doanh nghiệp reset mã mới: ${preview.companiesLinked}`,
      '',
      'Đơn vị hành chính cũ không bị ảnh hưởng.',
    ].join('\n')

    if (!window.confirm(message)) {
      return
    }

    newClearResult.value = await hanhChinhService.clearNewData()
    newOnlyImportResult.value = null
    await loadNewUnits(1)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Xóa dữ liệu hành chính mới thất bại'
  } finally {
    clearingNew.value = false
  }
}

const importNewDataset = async (provinceCodes?: string[]) => {
  importing.value = true
  actionError.value = ''
  try {
    newImportResult.value = await hanhChinhService.importNewFromDataset(provinceCodes)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Import dữ liệu mới thất bại'
  } finally {
    importing.value = false
  }
}

const applyLegacyImportColumnMap = (
  columnMap: HanhChinhImportColumnMap,
  labels?: Record<string, string>,
) => {
  if (labels) {
    legacyImportColumnLabels.value = { ...labels }
  }

  const nextInputs: Record<string, string> = {}
  for (const [key, label] of Object.entries(legacyImportColumnLabels.value)) {
    const mapped = columnMap[key] ?? []
    nextInputs[key] = columnsToDisplay(mapped)
    if (!label) {
      legacyImportColumnLabels.value[key] = key
    }
  }
  legacyImportColumnInputs.value = nextInputs
}

const buildLegacyImportColumnMap = (): HanhChinhImportColumnMap => {
  const map: HanhChinhImportColumnMap = {}
  for (const [key, input] of Object.entries(legacyImportColumnInputs.value)) {
    const parsed = parseColumnInput(input)
    if (parsed.length > 0) {
      map[key] = parsed
    }
  }
  return map
}

const applyLegacyOnlyColumnMap = (
  columnMap: HanhChinhImportColumnMap,
  labels?: Record<string, string>,
) => {
  if (labels) {
    legacyOnlyColumnLabels.value = { ...labels }
  }

  const nextInputs: Record<string, string> = {}
  for (const [key, label] of Object.entries(legacyOnlyColumnLabels.value)) {
    const mapped = columnMap[key] ?? []
    nextInputs[key] = columnsToDisplay(mapped)
    if (!label) {
      legacyOnlyColumnLabels.value[key] = key
    }
  }
  legacyOnlyColumnInputs.value = nextInputs
}

const buildLegacyOnlyColumnMap = (): HanhChinhImportColumnMap => {
  const map: HanhChinhImportColumnMap = {}
  for (const [key, input] of Object.entries(legacyOnlyColumnInputs.value)) {
    const parsed = parseColumnInput(input)
    if (parsed.length > 0) {
      map[key] = parsed
    }
  }
  return map
}

const loadLegacyImportConfig = async () => {
  const [baseConfig, configs, formats] = await Promise.all([
    hanhChinhService.getImportColumnMap(),
    hanhChinhService.getImportConfigs(),
    hanhChinhService.getImportFormats(),
  ])

  legacyImportStartRow.value = baseConfig.startRow
  mappingImportStartRow.value = baseConfig.startRow
  legacyImportColumnLabels.value = { ...baseConfig.columnLabels }
  applyLegacyImportColumnMap(baseConfig.columnMap, baseConfig.columnLabels)
  legacyOnlyImportStartRow.value = baseConfig.legacyOnlyStartRow ?? baseConfig.startRow
  applyLegacyOnlyColumnMap(
    baseConfig.legacyOnlyColumnMap ?? {},
    baseConfig.legacyOnlyColumnLabels,
  )
  legacyImportExampleConfigs.value = configs
  legacyImportFormats.value = formats

  const defaultConfig = configs.find((item) => item.code === baseConfig.defaultConfigCode)
  if (defaultConfig) {
    selectedLegacyImportConfigId.value = defaultConfig.id
  }

  const legacyOnlyConfig = configs.find((item) => item.code === baseConfig.legacyOnlyConfigCode)
  if (legacyOnlyConfig) {
    legacyOnlyImportStartRow.value = legacyOnlyConfig.startRow
    applyLegacyOnlyColumnMap(legacyOnlyConfig.columnMap)
  }
}

const applySelectedLegacyConfig = () => {
  const id = Number(selectedLegacyImportConfigId.value)
  if (!id) return
  const config = legacyImportExampleConfigs.value.find((item) => item.id === id)
  if (!config) return
  legacyImportStartRow.value = config.startRow
  applyLegacyImportColumnMap(config.columnMap)
}

const applySelectedLegacyFormat = () => {
  const id = Number(selectedLegacyImportFormatId.value)
  if (!id) return
  const format = legacyImportFormats.value.find((item) => item.id === id)
  if (!format) return
  legacyImportStartRow.value = format.startRow
  applyLegacyImportColumnMap(format.columnMap)
  legacyImportFormatName.value = format.name
}

const saveLegacyImportFormat = async () => {
  const name = legacyImportFormatName.value.trim()
  if (!name) return

  const saved = await hanhChinhService.saveImportFormat({
    name,
    startRow: legacyImportStartRow.value,
    columnMap: buildLegacyImportColumnMap(),
  })

  legacyImportFormats.value = [...legacyImportFormats.value.filter((item) => item.id !== saved.id), saved]
    .sort((a, b) => a.name.localeCompare(b.name))
  selectedLegacyImportFormatId.value = saved.id
}

const deleteLegacyImportFormat = async () => {
  const id = Number(selectedLegacyImportFormatId.value)
  if (!id) return
  await hanhChinhService.deleteImportFormat(id)
  legacyImportFormats.value = legacyImportFormats.value.filter((item) => item.id !== id)
  selectedLegacyImportFormatId.value = 0
}

const onLegacyExcelSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedLegacyImportFile.value = input.files?.[0] ?? null
}

const onLegacyOnlyExcelSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedLegacyOnlyImportFile.value = input.files?.[0] ?? null
}

const importLegacyExcelOnly = async () => {
  if (!selectedLegacyOnlyImportFile.value) return
  importing.value = true
  actionError.value = ''
  try {
    legacyOnlyImportResult.value = await hanhChinhService.importLegacyFromExcel(selectedLegacyOnlyImportFile.value, {
      startRow: legacyOnlyImportStartRow.value,
      columnMap: buildLegacyOnlyColumnMap(),
    })
    await loadLegacyUnits(1)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Import Excel đơn vị cũ thất bại'
  } finally {
    importing.value = false
  }
}

const importLegacyExcel = async () => {
  if (!selectedLegacyImportFile.value) return
  importing.value = true
  actionError.value = ''
  try {
    legacyImportResult.value = await hanhChinhService.importLegacyFromExcel(selectedLegacyImportFile.value, {
      startRow: legacyImportStartRow.value,
      columnMap: buildLegacyImportColumnMap(),
    })
    await loadMappings(1)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Import Excel dữ liệu cũ thất bại'
  } finally {
    importing.value = false
  }
}

const runSync = async (dryRun: boolean) => {
  syncing.value = true
  actionError.value = ''
  try {
    syncResult.value = await hanhChinhService.syncCompanies(dryRun)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Đồng bộ thất bại'
  } finally {
    syncing.value = false
  }
}

const runTextCatalogSync = async (dryRun: boolean) => {
  textCatalogSyncing.value = true
  actionError.value = ''
  try {
    textCatalogSyncResult.value = await hanhChinhService.syncCompanyTextCatalogs(dryRun)
    if (!dryRun) {
      await loadCatalog(1)
    }
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Đồng bộ danh mục hành chính thất bại'
  } finally {
    textCatalogSyncing.value = false
  }
}

const loadFieldSyncOptions = async () => {
  fieldSyncOptions.value = await hanhChinhService.getCompanyFieldSyncOptions()
  const field = fieldSyncOptions.value.find((item) => item.key === fieldSyncField.value) ?? fieldSyncOptions.value[0]
  if (field) {
    fieldSyncField.value = field.key
  }
}

const loadRawGroupsPreview = async () => {
  rawGroupsLoading.value = true
  actionError.value = ''
  try {
    rawGroupsPreview.value = await hanhChinhService.previewCompanyRawGroups(fieldSyncField.value)
    selectedRawGroupNames.value = rawGroupsPreview.value.groups
      .filter((item) => !item.existsInCatalog)
      .map((item) => item.ten)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Group-by dữ liệu thô thất bại'
    rawGroupsPreview.value = null
  } finally {
    rawGroupsLoading.value = false
  }
}

const selectAllNewRawGroups = () => {
  selectedRawGroupNames.value = (rawGroupsPreview.value?.groups ?? [])
    .filter((item) => !item.existsInCatalog)
    .map((item) => item.ten)
}

const clearRawGroupSelection = () => {
  selectedRawGroupNames.value = []
}

const commitSelectedRawGroups = async () => {
  if (selectedRawGroupNames.value.length === 0) return
  rawGroupsCommitting.value = true
  actionError.value = ''
  try {
    rawGroupsCommitResult.value = await hanhChinhService.commitCompanyRawGroups({
      field: fieldSyncField.value,
      names: selectedRawGroupNames.value,
      linkCompanies: rawGroupsLinkCompanies.value,
    })
    await loadRawGroupsPreview()
    await loadCatalog(1)
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Lưu danh mục từ dữ liệu thô thất bại'
  } finally {
    rawGroupsCommitting.value = false
  }
}

const commitNewRawGroups = async () => {
  const names = (rawGroupsPreview.value?.groups ?? [])
    .filter((item) => !item.existsInCatalog)
    .map((item) => item.ten)
  if (names.length === 0) return
  selectedRawGroupNames.value = names
  await commitSelectedRawGroups()
}

const runFieldSync = async (dryRun: boolean) => {
  fieldSyncing.value = true
  actionError.value = ''
  try {
    fieldSyncResult.value = await hanhChinhService.syncCompanyField({
      field: fieldSyncField.value,
      dryRun,
    })
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Đồng bộ field thất bại'
  } finally {
    fieldSyncing.value = false
  }
}

const legacyLocationLabel = (item: HanhChinhMappingItem) => {
  return item.xaPhuongCu?.quanHuyen?.fullName
    ?? item.xaPhuongCu?.quanHuyenCu?.fullName
    ?? '-'
}

const loadLegacyUnits = async (page = 1) => {
  legacyLoading.value = true
  try {
    const response = await hanhChinhService.getLegacyUnits({
      page,
      perPage: 50,
      search: legacySearch.value.trim() || undefined,
    })
    legacyUnits.value = response.data
    legacyPage.value = response.meta?.current_page ?? page
    legacyTotalPages.value = response.meta?.last_page ?? 1
  } finally {
    legacyLoading.value = false
  }
}

const loadMappings = async (page = 1) => {
  mappingLoading.value = true
  try {
    const response = await hanhChinhService.getMappings({
      page,
      perPage: 50,
      search: mappingSearch.value.trim() || undefined,
    })
    mappings.value = response.data
    mappingPage.value = response.meta?.current_page ?? page
    mappingTotalPages.value = response.meta?.last_page ?? 1
  } finally {
    mappingLoading.value = false
  }
}

const loadMappingGroups = async () => {
  mappingLoading.value = true
  try {
    mappingGroups.value = await hanhChinhService.getMappingGroups(mappingSearch.value.trim())
  } finally {
    mappingLoading.value = false
  }
}

const reloadMappingViews = async () => {
  if (mappingViewMode.value === 'groups') {
    await loadMappingGroups()
  } else {
    await loadMappings(1)
  }
}

const loadLinkDistricts = async () => {
  linkDistricts.value = await hanhChinhService.getLegacyDistricts()
}

const syncExistingLinkSelection = () => {
  if (!linkNewCode.value) {
    linkSelectedLegacyCodes.value = []
    linkGroupNo.value = null
    return
  }

  if (linkLegacyWards.value.length === 0) {
    return
  }

  const linkedWards = linkLegacyWards.value.filter((ward) => isWardLinkedToNew(ward, linkNewCode.value))

  linkSelectedLegacyCodes.value = linkedWards.map((ward) => ward.code)

  const groupNo = linkedWards
    .flatMap((ward) => getWardMappings(ward))
    .find((item) => item.xaPhuongMoiCode === linkNewCode.value && item.groupNo != null)?.groupNo
  linkGroupNo.value = groupNo ?? null
}

const onLinkDistrictChange = async () => {
  linkLegacyWards.value = []
  linkLegacySearch.value = ''
  linkSelectedLegacyCodes.value = []
  if (!linkDistrictCode.value) return

  linkLegacyLoading.value = true
  try {
    linkLegacyWards.value = await hanhChinhService.getLegacyWards(linkDistrictCode.value)
    syncExistingLinkSelection()
  } finally {
    linkLegacyLoading.value = false
  }
}

const onLinkNewChange = () => {
  syncExistingLinkSelection()
}

const loadAllNewUnitsForLink = async () => {
  linkNewLoading.value = true
  try {
    const firstPage = await hanhChinhService.getNewUnits({ page: 1, perPage: 200 })
    const allUnits = [...firstPage.data]
    const lastPage = firstPage.meta?.last_page ?? 1

    if (lastPage > 1) {
      const rest = await Promise.all(
        Array.from({ length: lastPage - 1 }, (_, index) =>
          hanhChinhService.getNewUnits({ page: index + 2, perPage: 200 }),
        ),
      )
      for (const page of rest) {
        allUnits.push(...page.data)
      }
    }

    linkNewOptions.value = allUnits
  } finally {
    linkNewLoading.value = false
  }
}

watch(linkDistrictCode, (value, oldValue) => {
  if (value !== oldValue) {
    void onLinkDistrictChange()
  }
})

watch(linkNewCode, (value, oldValue) => {
  if (value !== oldValue) {
    onLinkNewChange()
  }
})

const submitLink = async () => {
  if (!linkNewCode.value) return

  linking.value = true
  actionError.value = ''
  linkResult.value = null

  const selectedNew = linkNewOptions.value.find((item) => item.code === linkNewCode.value)

  try {
    linkResult.value = await hanhChinhService.linkMappings({
      groupNo: linkGroupNo.value ?? undefined,
      xaPhuongMoiCode: linkNewCode.value,
      newUnitType: selectedNew?.unitType ?? undefined,
      xaPhuongCuCodes: [...linkSelectedLegacyCodes.value],
      syncScopeCuCodes: linkLegacyWards.value.map((ward) => ward.code),
    })
    await reloadMappingViews()
    if (linkDistrictCode.value) {
      linkLegacyWards.value = await hanhChinhService.getLegacyWards(linkDistrictCode.value)
      syncExistingLinkSelection()
    }
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Tạo liên kết thất bại'
  } finally {
    linking.value = false
  }
}

const deleteMappingItem = async (id: number) => {
  if (!confirm('Xóa liên kết này?')) return

  actionError.value = ''
  try {
    await hanhChinhService.deleteMapping(id)
    await reloadMappingViews()
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Xóa liên kết thất bại'
  }
}

const onMappingExcelSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedMappingImportFile.value = input.files?.[0] ?? null
}

const importMappingExcel = async (mode: 'full' | 'mapping-only') => {
  if (!selectedMappingImportFile.value) return

  importing.value = true
  actionError.value = ''
  mappingImportResult.value = null

  try {
    mappingImportResult.value = await hanhChinhService.importMappingsFromExcel(selectedMappingImportFile.value, {
      startRow: mappingImportStartRow.value,
      columnMap: buildLegacyImportColumnMap(),
      mode,
    })
    await reloadMappingViews()
  } catch (err: unknown) {
    actionError.value = err instanceof Error ? err.message : 'Import liên kết từ Excel thất bại'
  } finally {
    importing.value = false
  }
}

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = resolveTabFromQuery(tab)
  },
)

watch(activeTab, (tab) => {
  if (tab === 'mapping') {
    reloadMappingViews()
    if (canManage.value && linkDistricts.value.length === 0) {
      void loadLinkDistricts()
      void loadAllNewUnitsForLink()
    }
  }
  if (tab === 'legacy') {
    loadLegacyUnits(1)
  }
  if (tab === 'new') {
    loadNewUnits(1)
  }
  if (tab === 'catalog') {
    loadCatalog(1)
  }
})

onMounted(async () => {
  await Promise.all([loadLegacyImportConfig(), loadNewImportConfig(), loadFieldSyncOptions()])
  mappingImportStartRow.value = legacyImportStartRow.value
  if (activeTab.value === 'legacy') {
    await loadLegacyUnits(1)
  }
  if (activeTab.value === 'new') {
    await loadNewUnits(1)
  }
  if (activeTab.value === 'catalog') {
    await loadCatalog(1)
  }
  if (activeTab.value === 'mapping') {
    await reloadMappingViews()
    if (canManage.value) {
      await loadLinkDistricts()
      await loadAllNewUnitsForLink()
    }
  }
})
</script>
