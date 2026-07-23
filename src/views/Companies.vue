<template>
  <AdminLayout>
    <div
      class="companies-page flex min-h-0 flex-1 flex-col max-lg:flex-none max-lg:overflow-visible lg:overflow-hidden"
    >
      <ComponentCard
        title="Danh sách doanh nghiệp"
        hide-header
        className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
        bodyClass="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-3"
        slotClass="flex min-h-0 flex-1 flex-col gap-2"
      >
        <!-- Filters -->
        <div class="shrink-0 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-1.5">
            <input
              type="text"
              v-model="filter.search"
              placeholder="Tìm kiếm tên, mã số..."
              class="h-9 w-[180px] shrink-0 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
            <div class="relative w-[min(220px,40vw)] shrink-0 bg-transparent">
              <select
                v-model="filter.dnTrangThaiId"
                class="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-3 pr-8 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="">Trạng thái</option>
                <option v-for="status in statuses" :key="status.id" :value="status.id">
                  {{ status.ten }}
                </option>
              </select>
              <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <svg class="stroke-current" width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <div class="relative w-[120px] shrink-0 bg-transparent">
              <select
                v-model="filter.loaiHinhId"
                class="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-3 pr-8 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="">Loại hình DN</option>
                <option v-for="type in businessTypes" :key="type.id" :value="type.id">
                  {{ type.ten }}
                </option>
              </select>
              <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <svg class="stroke-current" width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <div class="w-[200px] shrink-0">
              <AdministrativeFilter
                v-model:provinceCode="filterProvinceCode"
                v-model:wardCode="filterWardCode"
                :hide-province="HIDE_PROVINCE_FILTER"
                :default-province-code="DEFAULT_PROVINCE_CODE"
                ward-placeholder="Phường/xã"
                ward-search-placeholder="Tìm phường/xã..."
                compact
                dense
                @change="handleCompanyAdministrativeFilterChange"
              />
            </div>
            <button
              @click="resetFilters"
              class="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Đặt lại
            </button>
            <button
              v-if="hasUnrestrictedOrgScopeFlag && auth.hasPermission('feature.companies.delete')"
              type="button"
              :disabled="!implicitDonViId || clearingByUnit"
              title="Xóa toàn bộ doanh nghiệp theo đơn vị trực thuộc"
              class="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-red-300 bg-white px-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/30"
              @click="openClearByUnitModal"
            >
              Xóa theo đơn vị
            </button>
            <button
              @click="handleExport"
              v-if="auth.hasPermission('feature.companies.export')"
              :disabled="exporting"
              title="Xuất Excel"
              class="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg border border-emerald-500 bg-white px-2.5 text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-400 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="hidden sm:inline">{{ exporting ? 'Đang xuất...' : 'Xuất' }}</span>
            </button>
            <button
              v-if="hasUnrestrictedOrgScopeFlag && auth.hasPermission('feature.cadastral.manage')"
              type="button"
              title="Đồng bộ field hành chính"
              class="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg border border-violet-500 bg-white px-2.5 text-xs font-medium text-violet-600 transition hover:bg-violet-50 dark:border-violet-400 dark:bg-gray-900 dark:text-violet-400 dark:hover:bg-violet-500/10"
              @click="openFieldSyncModal"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 4v5h5M20 20v-5h-5M20 8a8 8 0 00-14.9-3M4 16a8 8 0 0014.9 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="hidden sm:inline">Sync</span>
            </button>
            <details
              v-if="auth.hasPermission('feature.companies.import')"
              class="relative shrink-0"
            >
              <summary
                class="inline-flex h-8 list-none cursor-pointer items-center justify-center gap-1 rounded-lg border border-amber-500 bg-white px-2.5 text-xs font-medium text-amber-600 transition hover:bg-amber-50 dark:border-amber-400 dark:bg-gray-900 dark:text-amber-400 dark:hover:bg-amber-500/10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21V9m0 0l4 4m-4-4l-4 4M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Nhập
              </summary>
              <div class="absolute right-0 z-50 mt-1 min-w-[240px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <router-link
                  to="/companies/import"
                  class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Import danh sách mới
                </router-link>
                <router-link
                  to="/companies/update-fields"
                  class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cập nhật field từ Excel
                </router-link>
                <button
                  type="button"
                  @click="openImportModal('identity')"
                  class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Import định danh
                </button>
                <button
                  type="button"
                  @click="openImportHistory"
                  class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Lịch sử import
                </button>
              </div>
            </details>
            <router-link
              to="/companies/map"
              title="Xem bản đồ"
              class="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg border border-brand-500 bg-white px-2.5 text-xs font-medium text-brand-600 transition hover:bg-brand-50 dark:border-brand-400 dark:bg-gray-900 dark:text-brand-400 dark:hover:bg-brand-500/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/>
              </svg>
              <span class="hidden sm:inline">Bản đồ</span>
            </router-link>
            <router-link
              to="/companies/create"
              class="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-brand-500 px-2.5 text-xs font-medium text-white transition hover:bg-brand-600"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Tạo mới
            </router-link>
            <div
              v-if="companyImportDocs"
              class="hidden shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] text-blue-800 2xl:inline-flex dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-200"
            >
              <a
                :href="toAbsoluteUrl(companyImportDocs.companyImportTemplateUrl)"
                target="_blank"
                rel="noopener noreferrer"
                class="underline"
              >
                Mẫu import
              </a>
            </div>
          </div>
          <div
            v-if="hanhChinhAreaFilter.active"
            class="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
          >
            <p>
              Đang lọc theo chart
              <strong>{{ hanhChinhAreaFilter.areaLabel || 'địa bàn' }}</strong>:
              <strong>{{ hanhChinhAreaFilter.areaName }}</strong>
              <span v-if="hanhChinhAreaFilter.areaId === 'unlinked'"> (chưa liên kết danh mục)</span>
            </p>
            <button
              type="button"
              class="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100"
              @click="clearHanhChinhAreaFilter"
            >
              Bỏ lọc địa bàn
            </button>
          </div>
        </div>

        <div
          v-if="selectedCompanyIds.length > 0"
          class="flex shrink-0 flex-col gap-2 rounded-lg border border-brand-200 bg-brand-50 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-brand-800/40 dark:bg-brand-500/10"
        >
          <p class="text-sm text-brand-700 dark:text-brand-300">
            Đã chọn {{ selectedCompanyIds.length }} doanh nghiệp
          </p>
          <div class="flex gap-2">
            <button
              v-if="auth.hasPermission('feature.companies.delete')"
              type="button"
              @click="openBulkDeleteConfirm"
              class="inline-flex h-9 items-center justify-center rounded-lg bg-red-500 px-3 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Xóa
            </button>
            <button
              type="button"
              @click="handleBulkDinhDanh(true)"
              class="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Định danh
            </button>
            <button
              type="button"
              @click="handleBulkDinhDanh(false)"
              class="inline-flex h-9 items-center justify-center rounded-lg bg-amber-500 px-3 text-sm font-medium text-white transition hover:bg-amber-600"
            >
              Hủy định danh
            </button>
          </div>
        </div>

        <div v-if="store.error" class="shrink-0 rounded-lg bg-red-50 p-[5px] text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {{ store.error }}
        </div>

        <!-- Mobile: card list -->
        <TableSkeleton v-if="store.loading" variant="cards" :rows="5" class="lg:hidden" />
        <div
          v-else-if="store.companies.length === 0"
          class="py-10 text-center text-sm text-gray-400 lg:hidden"
        >
          Chưa có doanh nghiệp nào
        </div>
        <div v-else class="grid min-h-0 flex-1 gap-3 overflow-y-auto lg:hidden">
          <CompanyMobileCard
            v-for="(company, index) in store.companies"
            :key="company.id"
            :company="company"
            :index="index"
            :status-class="companyStatusClass"
            :tax-status-class="taxStatusClass"
            @edit="openEditModal"
            @update-map="goToMapUpdate"
            @toggle-dinh-danh="toggleDinhDanh"
            @delete="handleDelete"
          />
        </div>

        <!-- Desktop: wide table -->
        <div class="hidden min-h-0 flex-1 flex-col lg:flex">
          <TableSkeleton
            v-if="store.loading"
            :rows="10"
            :columns="[
              { width: '46px', barClass: 'w-4', headerClass: 'w-4' },
              { width: '50px', barClass: 'w-6', headerClass: 'w-6' },
              { width: '140px', barClass: 'w-24' },
              { width: '220px', barClass: 'w-36' },
              { width: '220px', barClass: 'w-32' },
              { width: '220px', barClass: 'w-32' },
              { width: '150px', barClass: 'w-20' },
              { width: '150px', barClass: 'w-20' },
              { width: '170px', barClass: 'w-24' },
              { width: '170px', barClass: 'w-24' },
              { width: '170px', barClass: 'w-24' },
              { width: '170px', barClass: 'w-24' },
              { width: '140px', barClass: 'w-16' },
              { width: '130px', barClass: 'w-16' },
              { width: '130px', barClass: 'w-16' },
            ]"
          />

          <div
            v-else-if="store.companies.length === 0"
            class="flex min-h-[240px] flex-1 items-center justify-center rounded-xl border border-gray-200 text-sm text-gray-400 dark:border-gray-700"
          >
            Chưa có doanh nghiệp nào
          </div>

          <div
            v-else
            class="companies-table-scroll min-h-0 flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div class="min-w-max w-full">
              <!-- Header -->
              <div
                class="sticky top-0 z-10 flex border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
              >
              <div class="flex-none w-[46px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">
                <input
                  type="checkbox"
                  :checked="isAllSelectedOnPage"
                  @change="toggleSelectAllOnPage"
                  class="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
              </div>
              <div class="flex-none w-[50px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">TT</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Mã số doanh nghiệp</div>
              <div class="flex-none w-[220px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Tên doanh nghiệp</div>
              <div class="flex-none w-[220px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Địa chỉ cũ</div>
              <div class="flex-none w-[220px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Địa chỉ mới</div>
              <div class="flex-none w-[150px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Cấp xã cũ</div>
              <div class="flex-none w-[150px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Cấp xã mới</div>
              <div class="flex-none w-[170px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Cấp huyện cũ</div>
              <div class="flex-none w-[170px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Cấp huyện mới</div>
              <div class="flex-none w-[170px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Cấp tỉnh cũ</div>
              <div class="flex-none w-[170px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Cấp tỉnh mới</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Vốn điều lệ</div>
              <div class="flex-none w-[130px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Trạng thái</div>
              <div class="flex-none w-[130px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Tình trạng hoạt động (thuế)</div>
              <div class="flex-none w-[110px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Điện thoại</div>
              <div class="flex-none w-[180px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Ngườ i đại diện theo pháp luật</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Ngày sinh ngườ i đại diện</div>
              <div class="flex-none w-[160px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Chủ sở hữu</div>
              <div class="flex-none w-[200px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Ngành nghề KD chính</div>
              <div class="flex-none w-[260px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Ngành nghề KD</div>
              <div class="flex-none w-[110px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Ngày cấp</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Ngày đăng ký thay đổi</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Loại hình DN</div>
              <div class="flex-none w-[100px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Số lượng lao động</div>
              <div class="flex-none w-[180px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">DS thành viên góp vốn</div>
              <div class="flex-none w-[180px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">DS cổ đông</div>
              <div class="flex-none w-[170px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Định danh</div>
              <div class="flex-none w-[80px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Loại DN</div>
              <div class="flex-none w-[220px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</div>
              </div>
              <!-- Body -->
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="company, index in store.companies"
                :key="company.id"
                class="flex hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div class="flex-none w-[46px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">
                  <input
                    type="checkbox"
                    :checked="selectedCompanyIds.includes(company.id)"
                    @change="toggleCompanySelection(company.id)"
                    class="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                </div>
                <div class="flex-none w-[50px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ index + 1 }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.maSoDoanhNghiep }}</div>
                <div class="flex-none w-[220px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.tenDoanhNghiep }}</div>
                <div class="flex-none w-[220px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.diaChiCu || company.diaChi || '—' }}</div>
                <div class="flex-none w-[220px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.diaChiMoi || '—' }}</div>
                <div class="flex-none w-[150px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.xaPhuongCu || company.phuongXaCu || '—' }}</div>
                <div class="flex-none w-[150px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.xaPhuongMoi || company.phuongXaMoi || company.xaPhuong?.fullName || '—' }}</div>
                <div class="flex-none w-[170px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.quanHuyenCu || '—' }}</div>
                <div class="flex-none w-[170px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.quanHuyenMoi || company.tinhThanh?.fullName || '—' }}</div>
                <div class="flex-none w-[170px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.tinhThanhCu || '—' }}</div>
                <div class="flex-none w-[170px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.tinhThanhMoi || '—' }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ formatVND(company.vonDieuLe) }}</div>
                <div class="flex-none w-[130px] p-[5px]">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      companyStatusClass(company),
                    ]"
                  >
                    {{ company.dnTrangThai?.ten ?? '—' }}
                  </span>
                  <button
                    @click="openStatusModal(company)"
                    class="mt-1 inline-flex items-center rounded-md border border-brand-500 px-2 py-0.5 text-[11px] font-medium text-brand-600 transition hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-500/10"
                  >
                    Sửa
                  </button>
                </div>
                <div class="flex-none w-[130px] p-[5px]">
                  <span
                    v-if="company.tinhTrangThue"
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      taxStatusClass(company.tinhTrangThue),
                    ]"
                  >
                    {{ company.tinhTrangThue }}
                  </span>
                  <span v-else class="text-sm text-gray-400">—</span>
                </div>
                <div class="flex-none w-[110px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.dienThoai }}</div>
                <div class="flex-none w-[180px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.nguoiDaiDienTen || company.nguoiDaiDien?.fullName || '-' }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.ngaySinhNguoiDaiDien || company.nguoiDaiDien?.birthday || '-' }}</div>
                <div class="flex-none w-[160px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.chuSoHuuTen || company.chuSoHuu?.fullName || '-' }}</div>
                <div class="flex-none w-[200px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ formatNganhNgheChinh(company) }}</div>
                <div class="flex-none w-[260px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.nganhNgheKDTen || '-' }}</div>
                <div class="flex-none w-[110px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.ngayCap }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.ngayDangKyThayDoi }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.loaiHinhDN }}</div>
                <div class="flex-none w-[100px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ formatNumber(company.soLuongLaoDong) }}</div>
                <div class="flex-none w-[180px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">
                  <div v-if="company.dsThanhVienGopVon && company.dsThanhVienGopVon.length" class="space-y-1">
                    <div v-for="(member, idx) in company.dsThanhVienGopVon.slice(0, 2)" :key="idx" class="text-xs">
                      <span class="font-medium">{{ member.fullName }}</span>
                      <span v-if="member.position" class="text-gray-500"> · {{ member.position }}</span>
                      <span v-if="member.investmentAmount" class="text-gray-500"> — {{ formatVND(member.investmentAmount) }}</span>
                    </div>
                    <div v-if="company.dsThanhVienGopVon.length > 2" class="text-xs text-gray-500">+{{ company.dsThanhVienGopVon.length - 2 }} thành viên</div>
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </div>
                <div class="flex-none w-[180px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.dsCoDong }}</div>
                <div class="flex-none w-[170px] p-[5px]">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      dinhDanhClass(company.daCapNhatDinhDanh),
                    ]"
                  >
                    {{ company.daCapNhatDinhDanh ? 'Đã đăng ký định danh' : 'Chưa đăng ký định danh' }}
                  </span>
                </div>
                <div class="flex-none w-[80px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.loaiDN }}</div>
                <div class="flex-none w-[220px] p-[5px]">
                  <div class="flex items-center gap-2">
                    <button
                      @click="goToMapUpdate(company)"
                      class="inline-flex items-center justify-center rounded-lg bg-sky-600 p-2 text-white transition hover:bg-sky-700"
                      title="Cập nhật bản đồ"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button
                      @click="openEditModal(company)"
                      class="inline-flex items-center justify-center rounded-lg bg-brand-500 p-2 text-white transition hover:bg-brand-600"
                      title="Chỉnh sửa"
                    >
                      <svg class="fill-current" width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M17.4111 2.58332C17.1875 2.35974 16.875 2.23401 16.5488 2.23401C16.2227 2.23401 15.9102 2.35974 15.6865 2.58332L14.7334 3.53638L16.4639 5.26692L17.4169 4.31387C17.6405 4.09029 17.7663 3.77783 17.7663 3.45166C17.7663 3.12549 17.6405 2.81303 17.4169 2.58945L17.4111 2.58332ZM15.4043 6.32666L13.6738 4.59613L6.80859 11.4614C6.67969 11.5903 6.58301 11.7485 6.52637 11.9233L5.60156 14.7485C5.57031 14.8452 5.60156 14.9487 5.67578 15.0229C5.75 15.0972 5.85352 15.1284 5.9502 15.0972L8.77539 14.1724C8.9502 14.1157 9.1084 14.019 9.2373 13.8901L16.1025 7.0249L15.4043 6.32666ZM4.0625 3.43701C2.91602 3.43701 1.98438 4.36865 1.98438 5.51514V15.2651C1.98438 16.4116 2.91602 17.3433 4.0625 17.3433H13.8125C14.959 17.3433 15.8906 16.4116 15.8906 15.2651V9.39014C15.8906 9.05225 15.6162 8.77783 15.2783 8.77783C14.9404 8.77783 14.666 9.05225 14.666 9.39014V15.2651C14.666 15.7349 14.2822 16.1187 13.8125 16.1187H4.0625C3.59277 16.1187 3.20898 15.7349 3.20898 15.2651V5.51514C3.20898 5.04541 3.59277 4.66162 4.0625 4.66162H9.9375C10.2754 4.66162 10.5498 4.38721 10.5498 4.04932C10.5498 3.71143 10.2754 3.43701 9.9375 3.43701H4.0625Z"/>
                      </svg>
                    </button>
                    <button
                      @click="toggleDinhDanh(company)"
                      class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
                      :title="company.daCapNhatDinhDanh ? 'Huỷ đăng ký định danh' : 'Đăng ký định danh'"
                    >
                      {{ company.daCapNhatDinhDanh ? 'Huỷ đăng ký định danh' : 'Đăng ký định danh' }}
                    </button>
                    <button
                      v-if="auth.hasPermission('feature.companies.delete')"
                      @click="handleDelete(company.id)"
                      class="inline-flex items-center justify-center rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                      title="Xóa"
                    >
                      <svg class="fill-current" width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M6.875 3.125C6.875 2.43464 7.43464 1.875 8.125 1.875H11.875C12.5654 1.875 13.125 2.43464 13.125 3.125V4.375H17.5C17.8452 4.375 18.125 4.65482 18.125 5C18.125 5.34518 17.8452 5.625 17.5 5.625H16.4463L15.8928 16.6602C15.8425 17.7236 14.9707 18.5625 13.9052 18.5625H6.09479C5.02931 18.5625 4.1575 17.7236 4.10718 16.6602L3.55369 5.625H2.5C2.15482 5.625 1.875 5.34518 1.875 5C1.875 4.65482 2.15482 4.375 2.5 4.375H6.875V3.125ZM8.125 3.125V4.375H11.875V3.125H8.125ZM4.78355 5.625L5.30959 16.2305C5.32971 16.6309 5.65895 16.9375 6.06007 16.9375H13.9399C14.3411 16.9375 14.6703 16.6309 14.6904 16.2305L15.2165 5.625H4.78355ZM8.125 8.125C8.47018 8.125 8.75 8.40482 8.75 8.75V14.375C8.75 14.7202 8.47018 15 8.125 15C7.77982 15 7.5 14.7202 7.5 14.375V8.75C7.5 8.40482 7.77982 8.125 8.125 8.125ZM11.875 8.125C12.2202 8.125 12.5 8.40482 12.5 8.75V14.375C12.5 14.7202 12.2202 15 11.875 15C11.5298 15 11.25 14.7202 11.25 14.375V8.75C11.25 8.40482 11.5298 8.125 11.875 8.125Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        <TablePagination
          :page="store.page"
          :last-page="store.totalPages || 1"
          :total="store.total"
          :per-page="store.perPage"
          @update:page="store.setPage"
          @update:per-page="store.setPerPage"
        />
      </ComponentCard>
    </div>

    <!-- Edit Modal -->
    <Modal v-if="isEditModalOpen" @close="closeEditModal">
      <template v-slot:body>
        <div
          class="no-scrollbar relative w-full max-w-[800px] max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-10"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h5
                class="font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl"
              >
                Chỉnh sửa doanh nghiệp
              </h5>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Cập nhật thông tin doanh nghiệp
              </p>
            </div>
            <button
              @click="closeEditModal"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleUpdate" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Mã số doanh nghiệp -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mã số doanh nghiệp <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="editForm.maSoDoanhNghiep"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Tên doanh nghiệp -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tên doanh nghiệp <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="editForm.tenDoanhNghiep"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Điện thoại -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Điện thoại
                </label>
                <input
                  type="text"
                  v-model="editForm.dienThoai"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Địa chỉ cũ
                </label>
                <input
                  type="text"
                  v-model="editForm.diaChiCu"
                  placeholder="Nhập địa chỉ cũ"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Địa chỉ mới
                </label>
                <input
                  type="text"
                  v-model="editForm.diaChiMoi"
                  placeholder="Nhập địa chỉ mới"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp tỉnh cũ</label>
                <input
                  type="text"
                  v-model="editForm.tinhThanhCu"
                  placeholder="Nhập cấp tỉnh cũ"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp huyện cũ</label>
                <input
                  type="text"
                  v-model="editForm.quanHuyenCu"
                  placeholder="Nhập cấp huyện cũ"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp xã cũ</label>
                <input
                  type="text"
                  v-model="editForm.xaPhuongCu"
                  placeholder="Nhập cấp xã cũ"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp tỉnh mới</label>
                <input
                  type="text"
                  v-model="editForm.tinhThanhMoi"
                  placeholder="Nhập cấp tỉnh mới"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp huyện mới</label>
                <input
                  type="text"
                  v-model="editForm.quanHuyenMoi"
                  placeholder="Nhập cấp huyện mới"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp xã mới</label>
                <input
                  type="text"
                  v-model="editForm.xaPhuongMoi"
                  placeholder="Nhập cấp xã mới"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Kinh độ (long) -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Kinh độ (long)
                </label>
                <input
                  type="number"
                  step="any"
                  v-model.number="editForm.long"
                  placeholder="VD: 106.6297"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- Vĩ độ (lat) -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Vĩ độ (lat)
                </label>
                <input
                  type="number"
                  step="any"
                  v-model.number="editForm.lat"
                  placeholder="VD: 10.8231"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- Vốn điều lệ -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Vốn điều lệ
                </label>
                <input
                  type="text"
                  v-model="editForm.vonDieuLe"
                  placeholder="Nhập số tiền"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ formatVND(editForm.vonDieuLe) }}</p>
              </div>

              <!-- Trạng thái -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Trạng thái doanh nghiệp
                </label>
                <div class="relative z-20 bg-transparent">
                  <select
                    v-model.number="editForm.dnTrangThaiId"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <optgroup label="Định danh">
                      <option v-for="status in identityStatuses" :key="status.id" :value="status.id">
                        {{ status.ten }}
                      </option>
                    </optgroup>
                    <optgroup label="Trạng thái khác">
                      <option v-for="status in otherStatuses" :key="status.id" :value="status.id">
                        {{ status.ten }}
                      </option>
                    </optgroup>
                  </select>
                  <span
                    class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400"
                  >
                    <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>

              <div v-if="editShowReasonField" class="sm:col-span-2 lg:col-span-3">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Lý do trạng thái <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="editForm.lyDoTrangThai"
                  rows="3"
                  required
                  placeholder="Nhập lý do khi chọn trạng thái này"
                  class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Loại hình DN -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Loại hình doanh nghiệp
                </label>
                <input
                  v-model="editForm.loaiHinhDN"
                  list="edit-company-business-types"
                  placeholder="Nhập loại hình doanh nghiệp"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
                <datalist id="edit-company-business-types">
                  <option v-for="type in businessTypes" :key="type.id" :value="type.ten" />
                </datalist>
              </div>

              <!-- Ngày cấp -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày cấp
                </label>
                <input
                  type="text"
                  v-model="editForm.ngayCap"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Ngày đăng ký thay đổi -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày đăng ký thay đổi
                </label>
                <input
                  type="text"
                  v-model="editForm.ngayDangKyThayDoi"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Số lượng lao động -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Số lượng lao động
                </label>
                <input
                  type="number"
                  v-model.number="editForm.soLuongLaoDong"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Loại DN -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Loại DN
                </label>
                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="editForm.loaiDN"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <option value="TN">TN - Trong nước</option>
                    <option value="NN">NN - Nước ngoài</option>
                  </select>
                  <span
                    class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400"
                  >
                    <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Người đại diện -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Người đại diện theo pháp luật
                </label>
                <input
                  type="text"
                  v-model="editForm.nguoiDaiDienTen"
                  placeholder="Nhập họ tên người đại diện"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Ngày sinh người đại diện -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày sinh người đại diện
                </label>
                <input
                  type="text"
                  v-model="editForm.ngaySinhNguoiDaiDien"
                  placeholder="DD/MM/YYYY"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Chủ sở hữu -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Chủ sở hữu
                </label>
                <input
                  type="text"
                  v-model="editForm.chuSoHuuTen"
                  placeholder="Nhập họ tên chủ sở hữu"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Ngành nghề KD chính -->
              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngành nghề kinh doanh chính
                </label>
                <IndustryCategorySelect
                  v-model="editForm.nganhNgheKDChinh"
                  placeholder="Tìm và chọn mã ngành nghề chính"
                />
              </div>

              <!-- Ngành nghề KD -->
              <div class="sm:col-span-2 lg:col-span-3">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngành nghề kinh doanh
                </label>
                <IndustryCategorySelect
                  v-model="editForm.nganhNgheKD"
                  multiple
                  placeholder="Tìm và chọn các mã ngành nghề"
                />
              </div>

              <!-- DS Thành viên góp vốn -->
              <div class="sm:col-span-2 lg:col-span-3">
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Danh sách thành viên góp vốn
                  </label>
                  <button
                    type="button"
                    @click="addEditMember"
                    class="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Thêm thành viên
                  </button>
                </div>
                <div v-if="!editForm.dsThanhVienGopVon || editForm.dsThanhVienGopVon.length === 0" class="text-sm text-gray-400 py-2">Chưa có thành viên</div>
                <div v-else class="space-y-3">
                  <div
                    v-for="(member, idx) in editForm.dsThanhVienGopVon"
                    :key="idx"
                    class="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Thành viên {{ idx + 1 }}</span>
                      <button
                        type="button"
                        @click="removeEditMember(idx)"
                        class="text-red-500 hover:text-red-600 text-xs"
                      >
                        Xóa
                      </button>
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <div class="sm:col-span-2">
                        <label class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                          Họ và tên <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="member.fullName"
                          type="text"
                          required
                          placeholder="Nhập họ tên thành viên"
                          class="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                      </div>
                      <div>
                        <label class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                          Vị trí
                        </label>
                        <input
                          v-model="member.position"
                          type="text"
                          placeholder="Nhập vị trí (nếu có)"
                          class="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                      </div>
                      <div>
                        <label class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                          Số tiền góp vốn / cổ phần
                        </label>
                        <input
                          v-model.number="member.investmentAmount"
                          type="number"
                          min="0"
                          placeholder="Nhập số tiền (nếu có)"
                          class="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                        <p v-if="member.investmentAmount" class="mt-0.5 text-[11px] text-gray-400">
                          {{ formatVND(Number(member.investmentAmount)) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- DS Cổ đông -->
              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Danh sách cổ đông
                </label>
                <input
                  type="text"
                  v-model="editForm.dsCoDong"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col-reverse gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center">
              <button
                type="button"
                @click="closeEditModal"
                class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- Status Quick Edit Modal -->
    <Modal v-if="isStatusModalOpen" @close="closeStatusModal">
      <template v-slot:body>
        <div
          class="no-scrollbar relative w-full max-w-[520px] max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6"
        >
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h5 class="font-semibold text-gray-800 text-theme-xl dark:text-white/90">Cập nhật trạng thái doanh nghiệp</h5>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ statusModal.companyName }}</p>
            </div>
            <button
              @click="closeStatusModal"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveStatusUpdate" class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Trạng thái</label>
              <select
                v-model.number="statusModal.dnTrangThaiId"
                class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <optgroup label="Định danh">
                  <option v-for="status in identityStatuses" :key="status.id" :value="status.id">
                    {{ status.ten }}
                  </option>
                </optgroup>
                <optgroup label="Trạng thái khác">
                  <option v-for="status in otherStatuses" :key="status.id" :value="status.id">
                    {{ status.ten }}
                  </option>
                </optgroup>
              </select>
            </div>

            <div v-if="statusModalShowReason">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Lý do trạng thái <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="statusModal.lyDoTrangThai"
                rows="3"
                required
                placeholder="Nhập lý do khi chọn trạng thái này"
                class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                @click="closeStatusModal"
                class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="savingStatus"
                class="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {{ savingStatus ? 'Đang lưu...' : 'Lưu trạng thái' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- Clear by org unit (ROOT only) -->
    <Modal v-if="isClearByUnitOpen" @close="closeClearByUnitModal">
      <template v-slot:body>
        <div class="relative w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900 sm:p-8">
          <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            Xóa toàn bộ doanh nghiệp theo đơn vị
          </h5>
          <p v-if="clearByUnitPreview" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Đơn vị: <strong>{{ clearByUnitPreview.donViMa }} — {{ clearByUnitPreview.donViTen }}</strong>
            <span v-if="clearByUnitPreview.scopeDonViCount > 1" class="block mt-1 text-xs text-gray-500">
              Bao gồm {{ clearByUnitPreview.scopeDonViCount }} đơn vị (đơn vị chọn + đơn vị con).
            </span>
          </p>
          <p v-if="clearByUnitPreview" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Sẽ xóa <strong class="text-red-600">{{ clearByUnitPreview.count.toLocaleString('vi-VN') }}</strong> doanh nghiệp.
          </p>
          <p v-if="clearByUnitError" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ clearByUnitError }}</p>
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">
            Hành động này không thể hoàn tác.
          </p>
          <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              :disabled="clearingByUnit"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="closeClearByUnitModal"
            >
              Hủy
            </button>
            <button
              type="button"
              :disabled="clearingByUnit || !clearByUnitPreview || clearByUnitPreview.count === 0"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              @click="confirmClearByUnit"
            >
              {{ clearingByUnit ? 'Đang xóa...' : 'Xóa toàn bộ' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Delete confirm modal -->
    <Modal v-if="isDeleteConfirmOpen" @close="closeDeleteConfirm">
      <template v-slot:body>
        <div class="relative w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900 sm:p-8">
          <h5 class="font-semibold text-gray-800 text-lg dark:text-white/90">
            Xác nhận xóa
          </h5>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {{ deleteConfirmMessage }}
          </p>
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">
            Hành động này không thể hoàn tác.
          </p>
          <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              @click="closeDeleteConfirm"
              :disabled="deletingCompanies"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Hủy
            </button>
            <button
              type="button"
              @click="confirmDelete"
              :disabled="deletingCompanies"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {{ deletingCompanies ? 'Đang xóa...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Import Modal -->
    <Modal v-if="isImportModalOpen" @close="closeImportModal">
      <template v-slot:body>
        <div
          v-if="importMode === 'identity'"
          class="no-scrollbar relative w-full max-w-[640px] max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-8"
        >
          <CompanyIdentityImportPanel
            :show-header="true"
            :show-close="true"
            :show-actions="true"
            @close="closeImportModal"
            @imported="onIdentityImported"
          />
        </div>
        <div
          v-else
          class="no-scrollbar relative w-full max-w-[640px] max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-8"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h5 class="font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                {{ importModalTitle }}
              </h5>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ importModalDescription }}
              </p>
            </div>
            <button
              @click="closeImportModal"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-if="importMode === 'companies'"
              class="rounded-xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-800/60 dark:bg-brand-950/20"
            >
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                Đơn vị import doanh nghiệp
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Doanh nghiệp mới sẽ gán vào đơn vị của bạn. Hệ thống kiểm tra trùng trong phạm vi các đơn vị bên dưới.
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
              @click="handleDownloadTemplate"
              :disabled="downloadingTemplate"
              class="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ downloadingTemplate ? 'Đang tải mẫu...' : 'Tải file mẫu Excel (hệ thống)' }}
            </button>

            <div
              class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-3"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Tên format mới
                  </label>
                  <input
                    v-model="importFormatName"
                    type="text"
                    placeholder="VD: Template Sở KHĐT"
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

              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                Template đơn vị: header hàng 12, dữ liệu từ hàng 13. Đọc liên tục đến khi gặp hàng trống.
              </p>

              <button
                type="button"
                class="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                @click="showImportColumnConfig = !showImportColumnConfig"
              >
                {{ showImportColumnConfig ? 'Ẩn' : 'Cấu hình' }} ánh xạ cột
              </button>

              <div v-if="showImportColumnConfig" class="mt-3 max-h-64 overflow-y-auto space-y-1 pr-1">
                <div
                  v-for="(label, key) in importColumnLabels"
                  :key="key"
                  class="group grid grid-cols-[1fr_88px] items-center gap-2 rounded-lg px-2 py-1.5 -mx-1 transition focus-within:bg-brand-50 focus-within:ring-1 focus-within:ring-brand-300 dark:focus-within:bg-brand-500/15 dark:focus-within:ring-brand-700"
                >
                  <span class="text-xs text-gray-600 transition group-focus-within:font-semibold group-focus-within:text-brand-700 dark:text-gray-400 dark:group-focus-within:text-brand-300">{{ label }}</span>
                  <input
                    v-model="importColumnInputs[key]"
                    type="text"
                    placeholder="—"
                    class="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 pt-1 sticky bottom-0 bg-white dark:bg-gray-900">
                  Để trống = không map cột. Cột đơn (C), merge (D-G), cột đôi (AA-AB).
                </p>
              </div>

              <button
                type="button"
                class="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                @click="showImportExtensions = !showImportExtensions"
              >
                {{ showImportExtensions ? 'Ẩn' : 'Cấu hình' }} mở rộng xử lý giá trị
              </button>

              <div v-if="showImportExtensions" class="mt-3 space-y-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Mặc định giữ nguyên giá trị Excel. Chỉ xử lý khi chọn mở rộng bên dưới.
                </p>
                <div
                  v-for="item in availableImportValueExtensions"
                  :key="item.field"
                  class="grid grid-cols-[1fr_1fr] gap-2 items-center"
                >
                  <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.fieldLabel }}</span>
                  <select
                    v-model="importValueExtensions[item.field]"
                    class="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="">Không xử lý</option>
                    <option
                      v-for="ext in item.extensions"
                      :key="ext.key"
                      :value="ext.key"
                    >
                      {{ ext.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div
              class="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-700"
            >
              <input
                ref="importFileInput"
                type="file"
                accept=".xlsx,.xls,.csv"
                class="hidden"
                @change="onImportFileSelected"
              />
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Chọn file Excel (.xlsx, .xls, .csv)
              </p>
              <button
                type="button"
                @click="importFileInput?.click()"
                class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
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

            <div v-if="importError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400 whitespace-pre-line">
              {{ importError }}
            </div>
          </div>

          <div class="mt-6 flex flex-col-reverse gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 sm:flex-row sm:justify-end">
            <button
              type="button"
              @click="closeImportModal"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              Đóng
            </button>
            <button
              type="button"
              @click="handleImport"
              :disabled="!selectedImportFile || importing"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
            >
              {{ importSubmitLabel }}
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <ImportHistoryModal :open="isImportHistoryOpen" @close="isImportHistoryOpen = false" />

    <!-- Field sync modal -->
    <Modal v-if="isFieldSyncModalOpen" @close="closeFieldSyncModal">
      <template v-slot:body>
        <div class="no-scrollbar relative w-full max-w-2xl max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h5 class="text-lg font-semibold text-gray-900 dark:text-white">Đồng bộ field doanh nghiệp</h5>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Liên kết dữ liệu text import với bảng hành chính.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              @click="closeFieldSyncModal"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div v-if="fieldSyncOptionsLoading" class="py-8 text-center text-sm text-gray-500">
            Đang tải danh sách field...
          </div>

          <div v-else class="space-y-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Chọn field</label>
              <select
                v-model="fieldSyncField"
                class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
                @change="onFieldSyncFieldChange"
              >
                <option v-for="option in fieldSyncOptions" :key="option.key" :value="option.key">
                  {{ option.label }} → {{ option.catalog }} ({{ option.loai }})
                </option>
              </select>
            </div>
            <p class="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
              Group-by text thô <strong>{{ activeFieldSyncLabel }}</strong> → preview → lưu vào
              <strong>{{ activeFieldSyncCatalog }}</strong>
              (loại {{ activeFieldSyncLoai === 'cu' ? 'cũ' : 'mới' }}) và liên kết ID trên DN.
              Record đã có ID sẽ bỏ qua khi liên kết.
            </p>

            <div v-if="fieldSyncError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {{ fieldSyncError }}
            </div>

            <div v-if="rawGroupsPreview" class="space-y-3">
              <div class="rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60">
                Nhóm: {{ rawGroupsPreview.totalGroups }}
                · Mới: {{ rawGroupsPreview.newGroups }}
                · Đã có: {{ rawGroupsPreview.existingGroups }}
                · DN: {{ rawGroupsPreview.totalCompanies }}
              </div>
              <div class="flex flex-wrap gap-3 text-xs">
                <button type="button" class="text-brand-600 hover:underline" @click="selectAllNewRawGroups">
                  Chọn tất cả mới
                </button>
                <button type="button" class="text-gray-500 hover:underline" @click="selectedRawGroupNames = []">
                  Bỏ chọn
                </button>
              </div>
              <div class="max-h-72 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table class="min-w-full text-left text-sm">
                  <thead class="sticky top-0 bg-gray-100 text-xs uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <tr>
                      <th class="w-10 px-3 py-2"></th>
                      <th class="px-3 py-2">Tên</th>
                      <th class="w-20 px-3 py-2">Số DN</th>
                      <th class="w-36 px-3 py-2">Trạng thái</th>
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
                      <td class="px-3 py-2 text-xs">
                        <span v-if="group.existsInCatalog" class="text-emerald-700 dark:text-emerald-300">
                          Đã có
                        </span>
                        <span v-else class="text-amber-700 dark:text-amber-300">Chưa có</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="rawGroupsCommitResult" class="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
              Đã tạo: {{ rawGroupsCommitResult.created }} · Bỏ qua: {{ rawGroupsCommitResult.skippedExisting }}
              <template v-if="rawGroupsCommitResult.link">
                · Liên kết DN: {{ rawGroupsCommitResult.link.updated }}
              </template>
            </div>

            <div v-if="fieldSyncResult" class="rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/60">
              <p>
                Quét: {{ fieldSyncResult.scanned }} · Khớp: {{ fieldSyncResult.matched }}
                · Tạo mới: {{ fieldSyncResult.created }} · Cập nhật: {{ fieldSyncResult.updated }}
                · Đã liên kết: {{ fieldSyncResult.alreadyLinked }} · Không có text: {{ fieldSyncResult.skipped }}
              </p>
            </div>

            <div class="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                :disabled="fieldSyncing || rawGroupsLoading || rawGroupsCommitting"
                @click="closeFieldSyncModal"
              >
                Đóng
              </button>
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                :disabled="fieldSyncing || rawGroupsLoading || rawGroupsCommitting"
                @click="loadRawGroupsPreview"
              >
                {{ rawGroupsLoading ? 'Đang group...' : 'Xem trước' }}
              </button>
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                :disabled="fieldSyncing || rawGroupsLoading || rawGroupsCommitting || selectedRawGroupNames.length === 0"
                @click="commitSelectedRawGroups"
              >
                {{ rawGroupsCommitting ? 'Đang đồng bộ...' : `Đồng bộ (${selectedRawGroupNames.length})` }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCompaniesStore } from '@/stores/companies'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import TablePagination from '@/components/common/TablePagination.vue'
import TableSkeleton from '@/components/common/TableSkeleton.vue'
import Modal from '@/components/profile/Modal.vue'
import CompanyMobileCard from '@/components/companies/CompanyMobileCard.vue'
import ImportLoadingSkeleton from '@/components/companies/ImportLoadingSkeleton.vue'
import ImportHistoryModal from '@/components/companies/ImportHistoryModal.vue'
import CompanyIdentityImportPanel from '@/components/companies/CompanyIdentityImportPanel.vue'
import IndustryCategorySelect from '@/components/forms/FormElements/IndustryCategorySelect.vue'
import AdministrativeFilter from '@/components/filters/AdministrativeFilter.vue'
import { DEFAULT_PROVINCE_CODE, HIDE_PROVINCE_FILTER } from '@/config/hanhChinh'
import type { Company, CapitalMemberInput, CompanyImportResult, CompanyIdentityBulkItem, CompanyImportColumnMap, CompanyImportValueExtensionField, CompanyImportFormat, CompanyImportExampleConfig } from '@/types/company'
import type {
  CompanyAdministrativeField,
  CompanyFieldSyncOption,
  CompanyFieldSyncResult,
  CompanyRawGroupsPreview,
  CompanyRawGroupsCommitResult,
} from '@/types/hanhChinh'
import { COMPANY_IMPORT_COLUMN_LABELS } from '@/types/company'
import { formatVND, formatNumber } from '@/utils/formatters'
import { columnsToDisplay, parseColumnInput } from '@/utils/excelColumns'
import { companyService } from '@/services/companyService'
import { hanhChinhService } from '@/services/hanhChinhService'
import { settingService, type CompanyImportDocs } from '@/services/settingService'
import { orgUnitService } from '@/services/orgUnitService'
import { hasUnrestrictedOrgScope, resolveImportScopeOrgUnits } from '@/types/orgUnit'
import type { OrgUnit, ImportScopeOrgUnit } from '@/types/orgUnit'
import { formatImportUploadError } from '@/utils/apiError'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStatuses } from '@/composables/useCompanyStatuses'
import { useCompanyBusinessTypes } from '@/composables/useCompanyBusinessTypes'
import { useImportNotifications } from '@/composables/useImportNotifications'

const store = useCompaniesStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { statuses, identityStatuses, otherStatuses, requiresReason, loadStatuses } = useCompanyStatuses()
const { businessTypes, loadBusinessTypes } = useCompanyBusinessTypes()

const hanhChinhAreaFilter = reactive({
  active: false,
  areaKey: '',
  areaId: '',
  areaName: '',
  areaLabel: '',
})

const filter = reactive({
  search: '',
  dnTrangThaiId: '' as string | number,
  loaiHinhId: '' as string | number,
  quanHuyen: '',
  phuongXa: '',
})

const orgUnits = ref<OrgUnit[]>([])
const hasUnrestrictedOrgScopeFlag = computed(() => hasUnrestrictedOrgScope(auth.user))
const implicitDonViId = computed(() => auth.user?.donViId ?? null)
const importScopeOrgUnits = ref<ImportScopeOrgUnit[]>([])
const loadingImportScope = ref(false)

const isEditModalOpen = ref(false)
const isStatusModalOpen = ref(false)
const isImportModalOpen = ref(false)
const isImportHistoryOpen = ref(false)
const isFieldSyncModalOpen = ref(false)
const fieldSyncOptions = ref<CompanyFieldSyncOption[]>([])
const fieldSyncOptionsLoading = ref(false)
const fieldSyncField = ref<CompanyAdministrativeField>('phuongXaCu')
const fieldSyncing = ref(false)
const fieldSyncResult = ref<CompanyFieldSyncResult | null>(null)
const fieldSyncError = ref('')
const rawGroupsLoading = ref(false)
const rawGroupsCommitting = ref(false)
const rawGroupsPreview = ref<CompanyRawGroupsPreview | null>(null)
const rawGroupsCommitResult = ref<CompanyRawGroupsCommitResult | null>(null)
const selectedRawGroupNames = ref<string[]>([])
const selectedCompanyId = ref<number | null>(null)
const statusCompanyId = ref<number | null>(null)
const exporting = ref(false)
const importing = ref(false)
const importQueuedMessage = ref<string | null>(null)
const activeImportJobId = ref<number | null>(null)
let importPollTimer: ReturnType<typeof setInterval> | null = null
const downloadingTemplate = ref(false)
const savingStatus = ref(false)
const selectedImportFile = ref<File | null>(null)
const importFileInput = ref<HTMLInputElement | null>(null)
const importResult = ref<CompanyImportResult | null>(null)
const importError = ref<string | null>(null)
const importMode = ref<'companies' | 'identity'>('companies')
const identityImportStatus = ref<'dinh_danh' | 'chua_dinh_danh'>('dinh_danh')
const importStartRow = ref(13)
const importColumnInputs = reactive<Record<string, string>>({})
const importColumnLabels = reactive<Record<string, string>>({})
const importValueExtensions = reactive<Record<string, string>>({})
const availableImportValueExtensions = ref<CompanyImportValueExtensionField[]>([])
const showImportColumnConfig = ref(false)
const showImportExtensions = ref(false)
const importFormats = ref<CompanyImportFormat[]>([])
const importExampleConfigs = ref<CompanyImportExampleConfig[]>([])
const selectedImportConfigId = ref<number | ''>('')
const selectedImportFormatId = ref<number | ''>('')
const importFormatName = ref('')
const savingImportFormat = ref(false)
const deletingImportFormat = ref(false)
const identityImportConfigs = ref<Array<{
  id: string
  name: string
  startRow: number
  columnMap: CompanyImportColumnMap
  identityDate: string
}>>([])
const selectedIdentityImportConfigId = ref<string>('')
const identityImportConfigName = ref('')
const selectedCompanyIds = ref<number[]>([])
const isDeleteConfirmOpen = ref(false)
const pendingDeleteIds = ref<number[]>([])
const deletingCompanies = ref(false)
const isClearByUnitOpen = ref(false)
const clearingByUnit = ref(false)
const clearByUnitPreview = ref<{
  donViId: number
  donViMa?: string
  donViTen?: string
  scopeDonViCount: number
  count: number
} | null>(null)
const clearByUnitError = ref<string | null>(null)
const companyImportDocs = ref<CompanyImportDocs | null>(null)
const filterProvinceCode = ref(DEFAULT_PROVINCE_CODE)
const filterWardCode = ref('')

const editForm = reactive<Company>({
  id: 0,
  tt: 0,
  maSoDoanhNghiep: '',
  tenDoanhNghiep: '',
  diaChi: '',
  diaChiCu: '',
  diaChiMoi: '',
  quanHuyen: '',
  phuongXa: '',
  tinhThanhCu: '',
  tinhThanhMoi: '',
  quanHuyenCu: '',
  quanHuyenMoi: '',
  xaPhuongCu: '',
  xaPhuongMoi: '',
  long: null as number | null,
  lat: null as number | null,
  vonDieuLe: '',
  trangThai: '',
  dnTrangThaiId: null as number | null,
  lyDoTrangThai: '',
  dienThoai: '',
  nguoiDaiDienTen: '',
  ngaySinhNguoiDaiDien: '',
  chuSoHuuTen: '',
  nguoiDaiDienID: null,
  chuSoHuuID: null,
  nganhNgheKDChinh: null as string | null,
  nganhNgheKD: [] as string[],
  ngayCap: '',
  ngayDangKyThayDoi: '',
  loaiHinhDN: null,
  dnLoaiHinhId: null as number | null,
  soLuongLaoDong: 0,
  dsThanhVienGopVon: [] as CapitalMemberInput[],
  dsCoDong: '',
  loaiDN: 'TN',
  nguoiDaiDien: null,
  chuSoHuu: null,
})

const editShowReasonField = computed(() => requiresReason(editForm.dnTrangThaiId))
const statusModal = reactive({
  companyName: '',
  dnTrangThaiId: null as number | null,
  lyDoTrangThai: '',
})
const statusModalShowReason = computed(() => requiresReason(statusModal.dnTrangThaiId))
const isAllSelectedOnPage = computed(
  () => store.companies.length > 0 && store.companies.every((company) => selectedCompanyIds.value.includes(company.id)),
)
const deleteConfirmMessage = computed(() => {
  const count = pendingDeleteIds.value.length
  if (count <= 1) {
    const company = store.companies.find((item) => item.id === pendingDeleteIds.value[0])
    return company
      ? `Bạn có chắc muốn xóa doanh nghiệp "${company.tenDoanhNghiep}"?`
      : 'Bạn có chắc muốn xóa doanh nghiệp này?'
  }
  return `Bạn có chắc muốn xóa ${count} doanh nghiệp đã chọn?`
})
const importModalTitle = computed(() =>
  importMode.value === 'companies'
    ? 'Nhập doanh nghiệp từ Excel'
    : 'Nhập định danh doanh nghiệp từ Excel',
)
const importModalDescription = computed(() =>
  importMode.value === 'companies'
    ? 'Upload file Excel từ đơn vị. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất.'
    : 'Chỉ cần cột mã số DN/HTX và thời gian định danh. Ô thời gian trống → lấy thời gian hiện tại.',
)

const activeFieldSyncLabel = computed(() => {
  const field = fieldSyncOptions.value.find((item) => item.key === fieldSyncField.value)
  return field?.label ?? 'Phường / Xã cũ'
})

const activeFieldSyncCatalog = computed(() =>
  fieldSyncOptions.value.find((item) => item.key === fieldSyncField.value)?.catalog ?? 'Bảng phường xã',
)

const activeFieldSyncLoai = computed(() =>
  fieldSyncOptions.value.find((item) => item.key === fieldSyncField.value)?.loai ?? 'cu',
)

const importSubmitLabel = computed(() => {
  if (!importing.value) {
    return 'Nhập dữ liệu'
  }
  if (importMode.value === 'companies' && activeImportJobId.value) {
    return 'Đang xử lý nền...'
  }
  return 'Đang nhập...'
})

const importResultDuplicates = computed(() => {
  if (!importResult.value) return 0
  return importResult.value.duplicates ?? importResult.value.updated ?? 0
})

const importScopePrimaryUnit = computed(() => importScopeOrgUnits.value.find((unit) => unit.isPrimary) ?? null)
const importScopeChildUnits = computed(() => importScopeOrgUnits.value.filter((unit) => !unit.isPrimary))

function openImportHistory() {
  isImportHistoryOpen.value = true
}

async function loadFieldSyncOptions() {
  fieldSyncOptionsLoading.value = true
  fieldSyncError.value = ''
  try {
    fieldSyncOptions.value = await hanhChinhService.getCompanyFieldSyncOptions()
    const field = fieldSyncOptions.value.find((item) => item.key === fieldSyncField.value) ?? fieldSyncOptions.value[0]
    if (field) {
      fieldSyncField.value = field.key
    }
  } catch (err: unknown) {
    fieldSyncError.value = err instanceof Error ? err.message : 'Không tải được danh sách field sync.'
  } finally {
    fieldSyncOptionsLoading.value = false
  }
}

async function openFieldSyncModal() {
  fieldSyncResult.value = null
  fieldSyncError.value = ''
  rawGroupsPreview.value = null
  rawGroupsCommitResult.value = null
  selectedRawGroupNames.value = []
  isFieldSyncModalOpen.value = true
  if (fieldSyncOptions.value.length === 0) {
    await loadFieldSyncOptions()
  }
}

function closeFieldSyncModal() {
  isFieldSyncModalOpen.value = false
}

function onFieldSyncFieldChange() {
  rawGroupsPreview.value = null
  rawGroupsCommitResult.value = null
  fieldSyncResult.value = null
  selectedRawGroupNames.value = []
}

function selectAllNewRawGroups() {
  selectedRawGroupNames.value = (rawGroupsPreview.value?.groups ?? [])
    .filter((item) => !item.existsInCatalog)
    .map((item) => item.ten)
}

async function loadRawGroupsPreview() {
  rawGroupsLoading.value = true
  fieldSyncError.value = ''
  rawGroupsCommitResult.value = null
  fieldSyncResult.value = null
  try {
    rawGroupsPreview.value = await hanhChinhService.previewCompanyRawGroups(fieldSyncField.value)
    selectedRawGroupNames.value = rawGroupsPreview.value.groups
      .filter((item) => !item.existsInCatalog)
      .map((item) => item.ten)
  } catch (err: unknown) {
    fieldSyncError.value = err instanceof Error ? err.message : 'Xem trước group-by thất bại.'
    rawGroupsPreview.value = null
  } finally {
    rawGroupsLoading.value = false
  }
}

async function commitSelectedRawGroups() {
  if (selectedRawGroupNames.value.length === 0) return
  rawGroupsCommitting.value = true
  fieldSyncError.value = ''
  try {
    rawGroupsCommitResult.value = await hanhChinhService.commitCompanyRawGroups({
      field: fieldSyncField.value,
      names: selectedRawGroupNames.value,
      linkCompanies: true,
    })
    await loadRawGroupsPreview()
    await store.fetchCompanies(currentCompanyFilters())
  } catch (err: unknown) {
    fieldSyncError.value = err instanceof Error ? err.message : 'Đồng bộ field thất bại.'
  } finally {
    rawGroupsCommitting.value = false
  }
}

async function runFieldSync(dryRun: boolean) {
  fieldSyncing.value = true
  fieldSyncError.value = ''
  try {
    fieldSyncResult.value = await hanhChinhService.syncCompanyField({
      field: fieldSyncField.value,
      dryRun,
    })
    if (!dryRun) {
      await store.fetchCompanies(currentCompanyFilters())
    }
  } catch (err: unknown) {
    fieldSyncError.value = err instanceof Error ? err.message : 'Đồng bộ field thất bại.'
  } finally {
    fieldSyncing.value = false
  }
}

async function loadImportScopeOrgUnits() {
  loadingImportScope.value = true
  try {
    const donViId = auth.user?.donViId ?? null
    const donVi = auth.user?.donVi ?? null

    if (!donViId) {
      importScopeOrgUnits.value = resolveImportScopeOrgUnits(null, donVi, orgUnits.value, [], hasUnrestrictedOrgScope(auth.user))
      return
    }

    let directChildren: OrgUnit[] = []
    try {
      const response = await orgUnitService.getList({ parentId: donViId, isActive: true, perPage: 200 })
      directChildren = response.data
    } catch {
      directChildren = []
    }

    importScopeOrgUnits.value = resolveImportScopeOrgUnits(donViId, donVi, orgUnits.value, directChildren, hasUnrestrictedOrgScope(auth.user))
  } finally {
    loadingImportScope.value = false
  }
}

const {
  trackImportJob,
  clearImportJob,
  onImportCompleted,
  onImportFailed,
} = useImportNotifications()

function stopImportPolling() {
  if (importPollTimer) {
    clearInterval(importPollTimer)
    importPollTimer = null
  }
}

function finishQueuedImport(result: CompanyImportResult) {
  importing.value = false
  importQueuedMessage.value = null
  activeImportJobId.value = null
  clearImportJob()
  stopImportPolling()
  importResult.value = result
  void store.fetchCompanies(currentCompanyFilters())
}

function finishQueuedImportFailed(message: string) {
  importing.value = false
  importQueuedMessage.value = null
  activeImportJobId.value = null
  clearImportJob()
  stopImportPolling()
  importError.value = message
}

function startImportPolling(importJobId: number) {
  stopImportPolling()
  importPollTimer = setInterval(async () => {
    try {
      const status = await companyService.getImportJobStatus(importJobId)
      if (status.status === 'completed' && status.result) {
        finishQueuedImport(status.result)
      } else if (status.status === 'failed') {
        finishQueuedImportFailed(status.errorMessage ?? 'Import thất bại.')
      }
    } catch {
      // ignore transient polling errors
    }
  }, 4000)
}
const selectedImportConfigDescription = computed(() => {
  const config = importExampleConfigs.value.find((item) => item.id === selectedImportConfigId.value)
  return config?.description ?? ''
})

const IDENTITY_IMPORT_CONFIGS_STORAGE_KEY = 'companies_identity_import_configs_v2'

function applyImportMapping(options: {
  startRow: number
  columnMap: CompanyImportColumnMap
  valueExtensions?: Record<string, string>
}) {
  importStartRow.value = options.startRow
  applyImportColumnMap(options.columnMap, COMPANY_IMPORT_COLUMN_LABELS)
  resetImportValueExtensions(availableImportValueExtensions.value)
  for (const [field, preset] of Object.entries(options.valueExtensions ?? {})) {
    if (field in importValueExtensions) {
      importValueExtensions[field] = preset
    }
  }
}

function applyImportFormat(format: CompanyImportFormat) {
  applyImportMapping({
    startRow: format.startRow,
    columnMap: format.columnMap,
    valueExtensions: format.valueExtensions,
  })
}

function applyImportExampleConfig(config: CompanyImportExampleConfig) {
  applyImportMapping({
    startRow: config.startRow,
    columnMap: config.columnMap,
    valueExtensions: config.valueExtensions,
  })
}

function applySelectedImportConfig() {
  if (selectedImportConfigId.value === '') return
  const config = importExampleConfigs.value.find((item) => item.id === selectedImportConfigId.value)
  if (config) {
    selectedImportFormatId.value = ''
    importFormatName.value = ''
    applyImportExampleConfig(config)
  }
}

function applySelectedImportFormat() {
  if (selectedImportFormatId.value === '') return
  const format = importFormats.value.find((item) => item.id === selectedImportFormatId.value)
  if (format) {
    selectedImportConfigId.value = ''
    applyImportFormat(format)
    importFormatName.value = format.name
  }
}

async function loadImportExampleConfigs() {
  try {
    importExampleConfigs.value = await companyService.getImportConfigs()
    if (importExampleConfigs.value.length > 0) {
      selectedImportConfigId.value = importExampleConfigs.value[0].id
      applyImportExampleConfig(importExampleConfigs.value[0])
    }
  } catch {
    importExampleConfigs.value = []
  }
}

async function loadImportFormats() {
  try {
    importFormats.value = await companyService.getImportFormats()
  } catch {
    importFormats.value = []
  }
}

async function handleSaveImportFormat() {
  const name = importFormatName.value.trim()
  if (!name) return

  savingImportFormat.value = true
  importError.value = null
  try {
    const saved = await companyService.saveImportFormat({
      name,
      startRow: importStartRow.value,
      columnMap: buildImportColumnMap(),
      valueExtensions: buildImportValueExtensions(),
    })
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
    await companyService.deleteImportFormat(Number(selectedImportFormatId.value))
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

function buildImportColumnMap(): CompanyImportColumnMap {
  const map: CompanyImportColumnMap = {}
  for (const [key, input] of Object.entries(importColumnInputs)) {
    const columns = parseColumnInput(input)
    if (columns.length > 0) {
      map[key] = columns
    }
  }
  return map
}

function buildImportValueExtensions(): Record<string, string> {
  const extensions: Record<string, string> = {}
  for (const [field, preset] of Object.entries(importValueExtensions)) {
    if (preset) {
      extensions[field] = preset
    }
  }
  return extensions
}

function resetImportValueExtensions(fields: CompanyImportValueExtensionField[]) {
  Object.keys(importValueExtensions).forEach((key) => delete importValueExtensions[key])
  for (const item of fields) {
    importValueExtensions[item.field] = ''
  }
}

function applyImportColumnMap(columnMap: CompanyImportColumnMap, labels?: Record<string, string>) {
  Object.keys(importColumnInputs).forEach((key) => delete importColumnInputs[key])
  Object.keys(importColumnLabels).forEach((key) => delete importColumnLabels[key])

  const allLabels: Record<string, string> = { ...(labels ?? {}) }
  for (const key of Object.keys(columnMap)) {
    if (!(key in allLabels)) {
      allLabels[key] = COMPANY_IMPORT_COLUMN_LABELS[key] ?? key
    }
  }

  for (const [key, label] of Object.entries(allLabels)) {
    importColumnLabels[key] = label
    importColumnInputs[key] = key in columnMap ? columnsToDisplay(columnMap[key]) : ''
  }
}

async function loadImportColumnMapDefaults() {
  try {
    const config = await companyService.getImportColumnMap()
    importStartRow.value = config.startRow
    applyImportColumnMap(config.columnMap, config.columnLabels)
    availableImportValueExtensions.value = config.availableValueExtensions ?? []
    resetImportValueExtensions(availableImportValueExtensions.value)
  } catch {
    availableImportValueExtensions.value = [
      {
        field: 'nganhNgheKDChinh',
        fieldLabel: 'Ngành nghề KD chính',
        extensions: [{ key: 'vsic_code', label: 'Trích mã VSIC (vd: 2391:Mô tả → 2391)' }],
      },
      {
        field: 'nganhNgheKD',
        fieldLabel: 'Ngành nghề KD',
        extensions: [{ key: 'vsic_code_list', label: 'Trích mã VSIC từ danh sách (phân tách , hoặc ;)' }],
      },
    ]
    resetImportValueExtensions(availableImportValueExtensions.value)
    applyImportColumnMap(
      {
        tt: ['B'],
        maSoDoanhNghiep: ['C'],
        tenDoanhNghiep: ['D', 'E', 'F', 'G'],
        quanHuyenCu: ['O', 'P', 'Q'],
        phuongXaCu: ['R', 'S', 'T'],
        diaChiCu: ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
        vonDieuLe: ['U', 'V', 'W'],
        trangThai: ['X', 'Y', 'Z'],
      },
      COMPANY_IMPORT_COLUMN_LABELS,
    )
  }
}

function loadIdentityImportConfigs() {
  try {
    const raw = localStorage.getItem(IDENTITY_IMPORT_CONFIGS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    identityImportConfigs.value = Array.isArray(parsed) ? parsed : []
  } catch {
    identityImportConfigs.value = []
  }
}

function persistIdentityImportConfigs() {
  localStorage.setItem(
    IDENTITY_IMPORT_CONFIGS_STORAGE_KEY,
    JSON.stringify(identityImportConfigs.value),
  )
}

async function loadIdentityImportColumnMapDefaults() {
  try {
    const config = await companyService.getIdentityImportColumnMap()
    importStartRow.value = config.startRow
    applyImportColumnMap(
      {
        [config.lookupField || 'maSoDoanhNghiep']: config.columnMap?.[config.lookupField || 'maSoDoanhNghiep'] ?? ['A'],
        ngayDinhDanh: config.columnMap?.ngayDinhDanh ?? ['B'],
      },
      {
        maSoDoanhNghiep: 'Mã số doanh nghiệp',
        tenDoanhNghiep: 'Tên doanh nghiệp',
        ngayDinhDanh: 'Thời gian định danh',
        ...(config.columnLabels ?? {}),
      },
    )
  } catch {
    importStartRow.value = 2
    applyImportColumnMap(
      {
        maSoDoanhNghiep: ['A'],
        ngayDinhDanh: ['B'],
      },
      {
        maSoDoanhNghiep: 'Mã số doanh nghiệp',
        ngayDinhDanh: 'Thời gian định danh',
      },
    )
  }
}

function applySelectedIdentityImportConfig() {
  if (!selectedIdentityImportConfigId.value) return
  const config = identityImportConfigs.value.find((item) => item.id === selectedIdentityImportConfigId.value)
  if (!config) return
  importStartRow.value = config.startRow
  applyImportColumnMap(config.columnMap, {
    maSoDoanhNghiep: 'Mã số DN / HTX',
    ngayDinhDanh: 'Thời gian định danh',
    ...(config.columnLabels ?? {}),
  })
}

function saveIdentityImportConfig() {
  const name = identityImportConfigName.value.trim()
  if (!name) return
  const config = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    startRow: importStartRow.value,
    columnMap: buildImportColumnMap(),
  }
  identityImportConfigs.value.unshift(config)
  persistIdentityImportConfigs()
  selectedIdentityImportConfigId.value = config.id
  identityImportConfigName.value = ''
}

function deleteSelectedIdentityImportConfig() {
  if (!selectedIdentityImportConfigId.value) return
  identityImportConfigs.value = identityImportConfigs.value.filter(
    (item) => item.id !== selectedIdentityImportConfigId.value,
  )
  selectedIdentityImportConfigId.value = ''
  persistIdentityImportConfigs()
}

const resetFilters = () => {
  filter.search = ''
  filter.dnTrangThaiId = ''
  filter.loaiHinhId = ''
  filter.phuongXa = ''
  filterWardCode.value = ''
  if (!HIDE_PROVINCE_FILTER) {
    filter.quanHuyen = ''
    filterProvinceCode.value = ''
  } else {
    filter.quanHuyen = ''
    filterProvinceCode.value = DEFAULT_PROVINCE_CODE
  }
  clearHanhChinhAreaFilter()
  store.setPage(1)
}

const applyHanhChinhAreaFilterFromQuery = () => {
  const areaKey = typeof route.query.hanhChinhAreaKey === 'string' ? route.query.hanhChinhAreaKey : ''
  const areaId = typeof route.query.hanhChinhAreaId === 'string' ? route.query.hanhChinhAreaId : ''
  const areaName = typeof route.query.hanhChinhAreaName === 'string' ? route.query.hanhChinhAreaName : ''
  const areaLabel = typeof route.query.hanhChinhAreaLabel === 'string' ? route.query.hanhChinhAreaLabel : ''

  if (!areaKey || !areaId) {
    hanhChinhAreaFilter.active = false
    hanhChinhAreaFilter.areaKey = ''
    hanhChinhAreaFilter.areaId = ''
    hanhChinhAreaFilter.areaName = ''
    hanhChinhAreaFilter.areaLabel = ''
    return
  }

  hanhChinhAreaFilter.active = true
  hanhChinhAreaFilter.areaKey = areaKey
  hanhChinhAreaFilter.areaId = areaId
  hanhChinhAreaFilter.areaName = areaName || (areaId === 'unlinked' ? 'Chưa liên kết hành chính' : areaId)
  hanhChinhAreaFilter.areaLabel = areaLabel
}

const clearHanhChinhAreaFilter = () => {
  hanhChinhAreaFilter.active = false
  hanhChinhAreaFilter.areaKey = ''
  hanhChinhAreaFilter.areaId = ''
  hanhChinhAreaFilter.areaName = ''
  hanhChinhAreaFilter.areaLabel = ''

  if (
    route.query.hanhChinhAreaKey ||
    route.query.hanhChinhAreaId ||
    route.query.hanhChinhAreaName ||
    route.query.hanhChinhAreaLabel
  ) {
    const nextQuery = { ...route.query }
    delete nextQuery.hanhChinhAreaKey
    delete nextQuery.hanhChinhAreaId
    delete nextQuery.hanhChinhAreaName
    delete nextQuery.hanhChinhAreaLabel
    void router.replace({ query: nextQuery })
  }
}

const handleCompanyAdministrativeFilterChange = (payload: {
  provinceCode: string
  wardCode: string
  provinceName: string
  wardName: string
}) => {
  if (!HIDE_PROVINCE_FILTER) {
    filter.quanHuyen = payload.provinceName
  }
  filter.phuongXa = payload.wardName
  store.setPage(1)
}

const toAbsoluteUrl = (urlPath: string) => {
  if (/^https?:\/\//i.test(urlPath)) return urlPath
  if (import.meta.env.DEV && urlPath.startsWith('/storage')) {
    const backendOrigin = import.meta.env.VITE_API_PROXY_TARGET?.trim()
    if (backendOrigin) {
      return `${backendOrigin.replace(/\/$/, '')}${urlPath}`
    }
  }
  return `${window.location.origin}${urlPath.startsWith('/') ? urlPath : `/${urlPath}`}`
}


const toggleCompanySelection = (companyId: number) => {
  if (selectedCompanyIds.value.includes(companyId)) {
    selectedCompanyIds.value = selectedCompanyIds.value.filter((id) => id !== companyId)
    return
  }
  selectedCompanyIds.value.push(companyId)
}

const toggleSelectAllOnPage = () => {
  if (isAllSelectedOnPage.value) {
    selectedCompanyIds.value = selectedCompanyIds.value.filter(
      (id) => !store.companies.some((company) => company.id === id),
    )
    return
  }

  const idsOnPage = store.companies.map((company) => company.id)
  selectedCompanyIds.value = Array.from(new Set([...selectedCompanyIds.value, ...idsOnPage]))
}

const handleBulkDinhDanh = async (daCapNhatDinhDanh: boolean) => {
  const items: CompanyIdentityBulkItem[] = store.companies
    .filter((company) => selectedCompanyIds.value.includes(company.id) && !!company.maSoDoanhNghiep)
    .map((company) => ({
      maSoDoanhNghiep: company.maSoDoanhNghiep,
      daCapNhatDinhDanh,
    }))

  if (items.length === 0) {
    alert('Không có doanh nghiệp hợp lệ để cập nhật định danh.')
    return
  }

  await companyService.bulkUpdateDinhDanh(items)
  selectedCompanyIds.value = []
  await store.fetchCompanies(currentCompanyFilters())
}

const currentCompanyFilters = () => ({
  search: filter.search,
  dnTrangThaiId: filter.dnTrangThaiId || undefined,
  loaiHinhId: filter.loaiHinhId || undefined,
  quanHuyen: filter.quanHuyen || undefined,
  phuongXa: filter.phuongXa,
  ...(hanhChinhAreaFilter.active && hanhChinhAreaFilter.areaKey && hanhChinhAreaFilter.areaId
    ? {
        hanhChinhAreaKey: hanhChinhAreaFilter.areaKey,
        hanhChinhAreaId: hanhChinhAreaFilter.areaId,
      }
    : {}),
  page: store.page,
  per_page: store.perPage,
})

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const handleExport = async () => {
  exporting.value = true
  try {
    const blob = await companyService.exportExcel({
      search: filter.search,
      dnTrangThaiId: filter.dnTrangThaiId || undefined,
      loaiHinhId: filter.loaiHinhId || undefined,
      quanHuyen: filter.quanHuyen || undefined,
      phuongXa: filter.phuongXa,
    })
    downloadBlob(blob, `doanh-nghiep_${new Date().toISOString().slice(0, 10)}.xlsx`)
  } catch {
    alert('Xuất Excel thất bại. Vui lòng thử lại.')
  } finally {
    exporting.value = false
  }
}

const openImportModal = async (mode: 'companies' | 'identity') => {
  importMode.value = mode
  selectedImportFile.value = null
  importResult.value = null
  importError.value = null
  showImportColumnConfig.value = true
  showImportExtensions.value = false
  selectedImportFormatId.value = ''
  selectedImportConfigId.value = ''
  importFormatName.value = ''
  if (mode === 'companies') {
    await loadImportColumnMapDefaults()
    await Promise.all([loadImportExampleConfigs(), loadImportFormats(), loadImportScopeOrgUnits()])
  }
  isImportModalOpen.value = true
}

const onIdentityImported = async (result: CompanyImportResult) => {
  importResult.value = result
  await store.fetchCompanies()
}

const closeImportModal = () => {
  isImportModalOpen.value = false
  selectedImportFile.value = null
  if (importFileInput.value) {
    importFileInput.value.value = ''
  }
}

const handleDownloadTemplate = async () => {
  downloadingTemplate.value = true
  try {
    const blob = await companyService.exportTemplate()
    downloadBlob(blob, 'mau-import-doanh-nghiep.xlsx')
  } catch {
    alert('Tải file mẫu thất bại.')
  } finally {
    downloadingTemplate.value = false
  }
}

const handleDownloadIdentityTemplate = async () => {
  downloadingTemplate.value = true
  try {
    const blob = await companyService.exportIdentityTemplate()
    downloadBlob(blob, 'mau-import-dinh-danh-doanh-nghiep.xlsx')
  } catch {
    alert('Tải file mẫu định danh thất bại.')
  } finally {
    downloadingTemplate.value = false
  }
}

const onImportFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedImportFile.value = input.files?.[0] ?? null
  importResult.value = null
  importError.value = null
}

const handleImport = async () => {
  if (!selectedImportFile.value) return

  importing.value = true
  importError.value = null
  importResult.value = null
  importQueuedMessage.value = null

  try {
    const queued = await companyService.importExcel(selectedImportFile.value, {
      startRow: importStartRow.value,
      columnMap: buildImportColumnMap(),
      valueExtensions: buildImportValueExtensions(),
    })

    activeImportJobId.value = queued.importJobId
    trackImportJob(queued.importJobId)
    importQueuedMessage.value = `File "${queued.originalFilename ?? selectedImportFile.value.name}" đã được đưa vào hàng đợi.`
    startImportPolling(queued.importJobId)
  } catch (err: unknown) {
    importError.value = formatImportUploadError(err, 'Nhập Excel thất bại.')
    importing.value = false
    activeImportJobId.value = null
    importQueuedMessage.value = null
    clearImportJob()
    stopImportPolling()
  }
}

const goToMapUpdate = (company: Company) => {
  router.push(`/companies/${company.id}/map`)
}

const openEditModal = async (company: Company) => {
  selectedCompanyId.value = company.id
  Object.assign(editForm, {
    ...company,
    tinhThanhCu: company.tinhThanhCu ?? '',
    tinhThanhMoi: company.tinhThanhMoi ?? '',
    quanHuyenCu: company.quanHuyenCu ?? '',
    quanHuyenMoi: company.quanHuyenMoi ?? company.tinhThanh?.fullName ?? '',
    xaPhuongCu: company.xaPhuongCu ?? company.phuongXaCu ?? '',
    xaPhuongMoi: company.xaPhuongMoi ?? company.phuongXaMoi ?? company.xaPhuong?.fullName ?? '',
    nganhNgheKDChinh: company.nganhNgheKDChinh ?? null,
    nganhNgheKD: Array.isArray(company.nganhNgheKD) ? [...company.nganhNgheKD] : [],
    nguoiDaiDienTen: company.nguoiDaiDienTen || company.nguoiDaiDien?.fullName || '',
    ngaySinhNguoiDaiDien: company.ngaySinhNguoiDaiDien || company.nguoiDaiDien?.birthday || '',
    chuSoHuuTen: company.chuSoHuuTen || company.chuSoHuu?.fullName || '',
    dsThanhVienGopVon: (company.dsThanhVienGopVon ?? []).map((m) => ({
      fullName: m.fullName ?? '',
      position: m.position ?? null,
      investmentAmount: m.investmentAmount ?? null,
      dateJoin: m.dateJoin ?? null,
      memberId: m.memberId ?? null,
    })),
  })
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedCompanyId.value = null
}

const loadCompanyImportDocs = async () => {
  try {
    companyImportDocs.value = await settingService.getCompanyImportDocs()
  } catch {
    companyImportDocs.value = {
      companyImportTemplateUrl: '/api/doanh-nghiep/export-template',
      companyIdentityImportTemplateUrl: '/api/doanh-nghiep/export-template-dinh-danh',
    }
  }
}

const openStatusModal = (company: Company) => {
  statusCompanyId.value = company.id
  statusModal.companyName = company.tenDoanhNghiep
  statusModal.dnTrangThaiId = company.dnTrangThaiId ?? company.dnTrangThai?.id ?? null
  statusModal.lyDoTrangThai = company.lyDoTrangThai ?? ''
  isStatusModalOpen.value = true
}

const closeStatusModal = () => {
  isStatusModalOpen.value = false
  statusCompanyId.value = null
  statusModal.companyName = ''
  statusModal.dnTrangThaiId = null
  statusModal.lyDoTrangThai = ''
}

const saveStatusUpdate = async () => {
  if (statusCompanyId.value === null || statusModal.dnTrangThaiId === null) return

  savingStatus.value = true
  try {
    await store.updateCompany(statusCompanyId.value, {
      dnTrangThaiId: statusModal.dnTrangThaiId,
      lyDoTrangThai: statusModal.lyDoTrangThai || null,
    })
    await store.fetchCompanies(currentCompanyFilters())
    closeStatusModal()
  } finally {
    savingStatus.value = false
  }
}

const handleUpdate = async () => {
  if (selectedCompanyId.value !== null) {
    editForm.diaChi = editForm.diaChiMoi || editForm.diaChiCu || ''
    editForm.quanHuyen = editForm.quanHuyenMoi || editForm.quanHuyenCu || ''
    editForm.phuongXa = editForm.xaPhuongMoi || editForm.xaPhuongCu || ''
    const { nguoiDaiDien, chuSoHuu, ...payload } = editForm
    await store.updateCompany(selectedCompanyId.value, {
      ...payload,
      phuongXaCu: editForm.xaPhuongCu,
      phuongXaMoi: editForm.xaPhuongMoi,
    })
    await store.fetchCompanies(currentCompanyFilters())
  }
  closeEditModal()
}

const handleDelete = (id: number) => {
  pendingDeleteIds.value = [id]
  isDeleteConfirmOpen.value = true
}

const openBulkDeleteConfirm = () => {
  if (selectedCompanyIds.value.length === 0) return
  pendingDeleteIds.value = [...selectedCompanyIds.value]
  isDeleteConfirmOpen.value = true
}

const closeDeleteConfirm = () => {
  if (deletingCompanies.value) return
  isDeleteConfirmOpen.value = false
  pendingDeleteIds.value = []
}

const openClearByUnitModal = async () => {
  const donViId = implicitDonViId.value
  if (!donViId) return

  clearByUnitError.value = null
  clearByUnitPreview.value = null
  isClearByUnitOpen.value = true

  try {
    clearByUnitPreview.value = await companyService.previewClearByDonVi(donViId)
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    clearByUnitError.value = axiosErr.response?.data?.message ?? 'Không tải được thông tin xóa theo đơn vị.'
  }
}

const closeClearByUnitModal = () => {
  if (clearingByUnit.value) return
  isClearByUnitOpen.value = false
  clearByUnitPreview.value = null
  clearByUnitError.value = null
}

const confirmClearByUnit = async () => {
  const donViId = implicitDonViId.value
  if (!donViId || !clearByUnitPreview.value) return

  clearingByUnit.value = true
  clearByUnitError.value = null
  try {
    await companyService.clearByDonVi(donViId)
    selectedCompanyIds.value = []
    store.setPage(1)
    await store.fetchCompanies(currentCompanyFilters())
    closeClearByUnitModal()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    clearByUnitError.value = axiosErr.response?.data?.message ?? 'Xóa theo đơn vị thất bại.'
  } finally {
    clearingByUnit.value = false
  }
}

const confirmDelete = async () => {
  if (pendingDeleteIds.value.length === 0) return

  deletingCompanies.value = true
  try {
    const idsToDelete = [...pendingDeleteIds.value]

    if (idsToDelete.length === 1) {
      await store.deleteCompany(idsToDelete[0])
    } else {
      const result = await store.bulkDeleteCompanies(idsToDelete)
      if (result.failed > 0 && result.deleted === 0) {
        store.error = result.errors[0]?.message ?? 'Xóa doanh nghiệp thất bại.'
        return
      }
    }

    selectedCompanyIds.value = selectedCompanyIds.value.filter(
      (id) => !idsToDelete.includes(id),
    )
    isDeleteConfirmOpen.value = false
    pendingDeleteIds.value = []
    await store.fetchCompanies(currentCompanyFilters())
  } catch {
    // store.error already set
  } finally {
    deletingCompanies.value = false
  }
}

const toggleDinhDanh = async (company: Company) => {
  await store.updateCompanyDinhDanh(company.id, !company.daCapNhatDinhDanh)
}

const addEditMember = () => {
  if (!editForm.dsThanhVienGopVon) editForm.dsThanhVienGopVon = []
  editForm.dsThanhVienGopVon.push({
    fullName: '',
    position: null,
    investmentAmount: null,
  })
}

const removeEditMember = (idx: number) => {
  editForm.dsThanhVienGopVon?.splice(idx, 1)
}

const formatNganhNgheChinh = (company: Company) => {
  if (!company.nganhNgheKDChinh) return '-'
  if (company.nganhNgheKDChinhTen) {
    return `${company.nganhNgheKDChinh} - ${company.nganhNgheKDChinhTen}`
  }
  return company.nganhNgheKDChinh
}

const companyStatusClass = (company: Company) => {
  const loai = company.dnTrangThai?.loai
  const ma = company.dnTrangThai?.ma

  if (loai === 'hoat_dong' || ma === 'dang_hoat_dong') {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }
  if (loai === 'dinh_danh') {
    return ma === 'da_dinh_danh'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  }
  if (ma === 'tam_ngung') {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  }
  if (ma === 'giai_the_pha_san' || ma === 'giai_the_hop_nhat') {
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }

  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const taxStatusClass = (status?: string | null) => {
  if (status === 'Đang hoạt động') {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }
  if (status === 'Không hoạt động') {
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }

  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const dinhDanhClass = (isUpdated?: boolean) =>
  isUpdated
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'

// Fetch when filters or page changes
watch(
  () => [
    filter.search,
    filter.dnTrangThaiId,
    filter.loaiHinhId,
    filter.quanHuyen,
    filter.phuongXa,
    hanhChinhAreaFilter.areaKey,
    hanhChinhAreaFilter.areaId,
    store.page,
    store.perPage,
  ],
  () => {
    selectedCompanyIds.value = []
    store.fetchCompanies(currentCompanyFilters())
  },
  { debounce: 300 } as any,
)

watch(
  () => route.query,
  () => {
    applyHanhChinhAreaFilterFromQuery()
    store.setPage(1)
  },
)

onMounted(() => {
  applyHanhChinhAreaFilterFromQuery()

  // Load list ASAP; filters/meta in parallel (don't block first paint).
  void store.fetchCompanies(currentCompanyFilters())
  void Promise.all([
    orgUnitService.getTree().then((tree) => {
      orgUnits.value = tree
    }),
    loadStatuses(),
    loadBusinessTypes(),
    loadCompanyImportDocs(),
  ])

  onImportCompleted((payload) => {
    if (payload.entity === 'hop-tac-xa' || !payload.result) return
    finishQueuedImport(payload.result)
  })

  onImportFailed((payload) => {
    if (payload.entity === 'hop-tac-xa') return
    finishQueuedImportFailed(payload.message ?? 'Import thất bại.')
  })
})

onUnmounted(() => {
  stopImportPolling()
})
</script>

<style scoped>
.companies-page {
  overscroll-behavior: contain;
}

.companies-table-scroll :deep(.flex-none) {
  padding: 0.125rem 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
}

.companies-table-scroll {
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

.companies-table-scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.companies-table-scroll::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: rgb(203 213 225);
}

.companies-table-scroll::-webkit-scrollbar-track {
  background-color: transparent;
}

.dark .companies-table-scroll {
  scrollbar-color: rgb(71 85 105) transparent;
}

.dark .companies-table-scroll::-webkit-scrollbar-thumb {
  background-color: rgb(71 85 105);
}
</style>
