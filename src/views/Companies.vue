<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Danh sách doanh nghiệp" className="overflow-hidden">
        <!-- Filters -->
        <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div class="w-full sm:flex-1 sm:min-w-[200px]">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tìm kiếm
            </label>
            <input
              type="text"
              v-model="filter.search"
              placeholder="Tên doanh nghiệp, Mã số..."
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div class="w-full sm:w-48">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Trạng thái
            </label>
            <div class="relative z-20 bg-transparent">
              <select
                v-model="filter.trangThai"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="">Tất cả</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Tạm ngừng">Tạm ngừng</option>
                <option value="Giải thể">Giải thể</option>
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
          <div class="w-full sm:w-48">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Loại hình DN
            </label>
            <div class="relative z-20 bg-transparent">
              <select
                v-model="filter.loaiHinhDN"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="">Tất cả</option>
                <option value="Công ty TNHH">Công ty TNHH</option>
                <option value="Công ty Cổ phần">Công ty Cổ Phần</option>
                <option value="Doanh nghiệp tư nhân">Doanh nghiệp Tư Nhân</option>
                <option value="Hợp danh">Hợp Danh</option>
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
          <button
            @click="resetFilters"
            class="h-11 w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Đặt lại
          </button>
          <button
            @click="handleExport"
            v-if="auth.hasPermission('feature.companies.export')"
            :disabled="exporting"
            class="h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500 bg-white px-4 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-400 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ exporting ? 'Đang xuất...' : 'Xuất Excel' }}
          </button>
          <button
            @click="openImportModal"
            v-if="auth.hasPermission('feature.companies.import')"
            class="h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500 bg-white px-4 text-sm font-medium text-amber-600 transition hover:bg-amber-50 dark:border-amber-400 dark:bg-gray-900 dark:text-amber-400 dark:hover:bg-amber-500/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 21V9m0 0l4 4m-4-4l-4 4M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Nhập Excel
          </button>
          <router-link
            to="/companies/map"
            class="h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-brand-500 bg-white px-4 text-sm font-medium text-brand-600 transition hover:bg-brand-50 dark:border-brand-400 dark:bg-gray-900 dark:text-brand-400 dark:hover:bg-brand-500/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/>
            </svg>
            Xem bản đồ
          </router-link>
          <router-link
            to="/companies/create"
            class="h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Tạo mới
          </router-link>
        </div>

        <div v-if="store.error" class="mb-4 rounded-lg bg-red-50 p-[5px] text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {{ store.error }}
        </div>

        <!-- Mobile: card list -->
        <div v-if="store.loading" class="flex items-center justify-center py-12 lg:hidden">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
        </div>
        <div
          v-else-if="store.companies.length === 0"
          class="py-10 text-center text-sm text-gray-400 lg:hidden"
        >
          Chưa có doanh nghiệp nào
        </div>
        <div v-else class="grid gap-3 lg:hidden">
          <CompanyMobileCard
            v-for="(company, index) in store.companies"
            :key="company.id"
            :company="company"
            :index="index"
            :status-class="statusClass"
            @edit="openEditModal"
            @update-map="goToMapUpdate"
            @toggle-dinh-danh="toggleDinhDanh"
            @delete="handleDelete"
          />
        </div>

        <!-- Desktop: wide table -->
        <div class="hidden lg:block overflow-x-auto">
          <div v-if="store.loading" class="flex items-center justify-center py-12">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
          </div>

          <div v-else class="min-w-max w-full">
            <!-- Header -->
            <div class="flex border-b border-gray-200 dark:border-gray-700">
              <div class="flex-none w-[50px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">TT</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Mã số doanh nghiệp</div>
              <div class="flex-none w-[220px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Tên doanh nghiệp</div>
              <div class="flex-none w-[220px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Địa chỉ trụ sở chính</div>
              <div class="flex-none w-[120px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Quận / Huyện</div>
              <div class="flex-none w-[120px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Phường/xã</div>
              <div class="flex-none w-[140px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Vốn điều lệ</div>
              <div class="flex-none w-[130px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Trạng thái</div>
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
                <div class="flex-none w-[50px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ index + 1 }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.maSoDoanhNghiep }}</div>
                <div class="flex-none w-[220px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.tenDoanhNghiep }}</div>
                <div class="flex-none w-[220px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.diaChi }}</div>
                <div class="flex-none w-[120px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.quanHuyen }}</div>
                <div class="flex-none w-[120px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.phuongXa }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ formatVND(company.vonDieuLe) }}</div>
                <div class="flex-none w-[130px] p-[5px]">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      statusClass(company.trangThai),
                    ]"
                  >
                    {{ company.dnTrangThai?.ten ?? company.trangThai }}
                  </span>
                  <button
                    @click="openStatusModal(company)"
                    class="mt-1 inline-flex items-center rounded-md border border-brand-500 px-2 py-0.5 text-[11px] font-medium text-brand-600 transition hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-500/10"
                  >
                    Sửa
                  </button>
                </div>
                <div class="flex-none w-[110px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.dienThoai }}</div>
                <div class="flex-none w-[180px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.nguoiDaiDienTen || company.nguoiDaiDien?.fullName || '-' }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.ngaySinhNguoiDaiDien || company.nguoiDaiDien?.birthday || '-' }}</div>
                <div class="flex-none w-[160px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.chuSoHuuTen || company.chuSoHuu?.fullName || '-' }}</div>
                <div class="flex-none w-[200px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.nganhNgheKDChinh }}</div>
                <div class="flex-none w-[260px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.nganhNgheKD }}</div>
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

        <!-- Total & Pagination -->
        <div class="mt-5 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <p class="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
            Tổng số: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ store.total }}</span> bản ghi
            <span class="lg:hidden text-gray-400"> · Trang {{ store.page }}/{{ store.totalPages || 1 }}</span>
          </p>
          <div class="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <button
              @click="prevPage"
              :disabled="store.page === 1"
              :class="[
                'inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition',
                store.page === 1
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
              ]"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'hidden sm:inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition',
                store.page === page
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="nextPage"
              :disabled="store.page === store.totalPages"
              :class="[
                'inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition',
                store.page === store.totalPages
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
              ]"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>

    <!-- Edit Modal -->
    <Modal v-if="isEditModalOpen" @close="closeEditModal">
      <template #body>
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

              <!-- Địa chỉ -->
              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Địa chỉ trụ sở chính
                </label>
                <input
                  type="text"
                  v-model="editForm.diaChi"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Quận / Huyện -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tỉnh / Thành
                </label>
                <select
                  v-model="editSelectedProvinceCode"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Chọn tỉnh/thành</option>
                  <option v-for="province in editProvinces" :key="province.code" :value="province.code">
                    {{ province.code }} - {{ province.fullName }}
                  </option>
                </select>
              </div>

              <!-- Phường/xã -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Xã / Phường
                </label>
                <select
                  v-model="editSelectedWardCode"
                  :disabled="!editSelectedProvinceCode || loadingEditWards"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">{{ loadingEditWards ? 'Đang tải...' : 'Chọn xã/phường' }}</option>
                  <option v-for="ward in editWards" :key="ward.code" :value="ward.code">
                    {{ ward.fullName }}
                  </option>
                </select>
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
                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="editForm.loaiHinhDN"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <option value="Công ty TNHH">Công ty TNHH</option>
                    <option value="Công ty Cổ phần">Công ty Cổ phần</option>
                    <option value="Doanh nghiệp tư nhân">Doanh nghiệp tư nhân</option>
                    <option value="Hợp danh">Hợp danh</option>
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
                <input
                  type="text"
                  v-model="editForm.nganhNgheKDChinh"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Ngành nghề KD -->
              <div class="sm:col-span-2 lg:col-span-3">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngành nghề kinh doanh
                </label>
                <textarea
                  v-model="editForm.nganhNgheKD"
                  rows="3"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
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
      <template #body>
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

    <!-- Import Modal -->
    <Modal v-if="isImportModalOpen" @close="closeImportModal">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[560px] max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-8"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h5 class="font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                Nhập doanh nghiệp từ Excel
              </h5>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tải file .xlsx theo mẫu, hệ thống sẽ tạo mới hoặc cập nhật theo mã số DN
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
            <button
              type="button"
              @click="handleDownloadTemplate"
              :disabled="downloadingTemplate"
              class="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ downloadingTemplate ? 'Đang tải mẫu...' : 'Tải file mẫu Excel' }}
            </button>

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

            <div
              v-if="importResult"
              class="rounded-lg border p-4 text-sm dark:border-gray-700"
              :class="importResult.failed > 0 ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20'"
            >
              <p class="font-medium text-gray-800 dark:text-gray-200">
                {{ importResult.imported }} mới · {{ importResult.updated }} cập nhật · {{ importResult.failed }} lỗi
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

            <div v-if="importError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
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
              {{ importing ? 'Đang nhập...' : 'Nhập dữ liệu' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompaniesStore } from '@/stores/companies'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/profile/Modal.vue'
import CompanyMobileCard from '@/components/companies/CompanyMobileCard.vue'
import type { Company, CapitalMemberInput, CompanyImportResult } from '@/types/company'
import { formatVND, formatNumber } from '@/utils/formatters'
import { companyService } from '@/services/companyService'
import { locationService } from '@/services/locationService'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStatuses } from '@/composables/useCompanyStatuses'
import type { ProvinceItem, WardItem } from '@/types/location'

const store = useCompaniesStore()
const auth = useAuthStore()
const router = useRouter()
const { identityStatuses, otherStatuses, requiresReason, loadStatuses } = useCompanyStatuses()
const currentPageTitle = ref('Danh sách doanh nghiệp')

const filter = reactive({
  search: '',
  trangThai: '',
  loaiHinhDN: '',
})

const isEditModalOpen = ref(false)
const isStatusModalOpen = ref(false)
const isImportModalOpen = ref(false)
const selectedCompanyId = ref<number | null>(null)
const statusCompanyId = ref<number | null>(null)
const exporting = ref(false)
const importing = ref(false)
const downloadingTemplate = ref(false)
const savingStatus = ref(false)
const selectedImportFile = ref<File | null>(null)
const importFileInput = ref<HTMLInputElement | null>(null)
const importResult = ref<CompanyImportResult | null>(null)
const importError = ref<string | null>(null)
const editProvinces = ref<ProvinceItem[]>([])
const editWards = ref<WardItem[]>([])
const editSelectedProvinceCode = ref('')
const editSelectedWardCode = ref('')
const loadingEditWards = ref(false)

const editForm = reactive<Company>({
  id: 0,
  tt: 0,
  maSoDoanhNghiep: '',
  tenDoanhNghiep: '',
  diaChi: '',
  quanHuyen: '',
  phuongXa: '',
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
  nganhNgheKDChinh: '',
  nganhNgheKD: '',
  ngayCap: '',
  ngayDangKyThayDoi: '',
  loaiHinhDN: 'Công ty TNHH',
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

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, store.page - Math.floor(maxVisible / 2))
  let end = Math.min(store.totalPages, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = (page: number) => {
  store.setPage(page)
}

const prevPage = () => {
  if (store.page > 1) store.setPage(store.page - 1)
}

const nextPage = () => {
  if (store.page < store.totalPages) store.setPage(store.page + 1)
}

const resetFilters = () => {
  filter.search = ''
  filter.trangThai = ''
  filter.loaiHinhDN = ''
  store.setPage(1)
}

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
      trangThai: filter.trangThai,
      loaiHinhDN: filter.loaiHinhDN,
    })
    downloadBlob(blob, `doanh-nghiep_${new Date().toISOString().slice(0, 10)}.xlsx`)
  } catch {
    alert('Xuất Excel thất bại. Vui lòng thử lại.')
  } finally {
    exporting.value = false
  }
}

const openImportModal = () => {
  selectedImportFile.value = null
  importResult.value = null
  importError.value = null
  isImportModalOpen.value = true
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

  try {
    const result = await companyService.importExcel(selectedImportFile.value)
    importResult.value = result
    await store.fetchCompanies({
      search: filter.search,
      trangThai: filter.trangThai,
      loaiHinhDN: filter.loaiHinhDN,
      page: store.page,
      per_page: store.perPage,
    })
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    importError.value = axiosErr.response?.data?.message ?? 'Nhập Excel thất bại.'
  } finally {
    importing.value = false
  }
}

const goToMapUpdate = (company: Company) => {
  router.push(`/companies/${company.id}/map`)
}

const loadEditProvinces = async () => {
  editProvinces.value = await locationService.getProvinces()
}

const loadEditWards = async () => {
  if (!editSelectedProvinceCode.value) {
    editWards.value = []
    editSelectedWardCode.value = ''
    return
  }

  loadingEditWards.value = true
  try {
    editWards.value = await locationService.getWardsByProvince(editSelectedProvinceCode.value)
    if (!editWards.value.some((ward) => ward.code === editSelectedWardCode.value)) {
      editSelectedWardCode.value = ''
    }
  } finally {
    loadingEditWards.value = false
  }
}

watch(editSelectedProvinceCode, () => {
  const province = editProvinces.value.find((item) => item.code === editSelectedProvinceCode.value)
  editForm.quanHuyen = province?.fullName ?? ''
  void loadEditWards()
})

watch(editSelectedWardCode, () => {
  const ward = editWards.value.find((item) => item.code === editSelectedWardCode.value)
  editForm.phuongXa = ward?.fullName ?? ''
})

const openEditModal = async (company: Company) => {
  selectedCompanyId.value = company.id
  Object.assign(editForm, {
    ...company,
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
  await loadEditProvinces()
  const matchedProvince = editProvinces.value.find((item) => item.fullName === (company.quanHuyen ?? ''))
  editSelectedProvinceCode.value = matchedProvince?.code ?? ''
  if (!matchedProvince) {
    editWards.value = []
    editSelectedWardCode.value = ''
  } else {
    await loadEditWards()
    const matchedWard = editWards.value.find((item) => item.fullName === (company.phuongXa ?? ''))
    editSelectedWardCode.value = matchedWard?.code ?? ''
  }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedCompanyId.value = null
  editSelectedProvinceCode.value = ''
  editSelectedWardCode.value = ''
  editWards.value = []
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
    await store.fetchCompanies({
      search: filter.search,
      trangThai: filter.trangThai,
      loaiHinhDN: filter.loaiHinhDN,
      page: store.page,
      per_page: store.perPage,
    })
    closeStatusModal()
  } finally {
    savingStatus.value = false
  }
}

const handleUpdate = async () => {
  if (selectedCompanyId.value !== null) {
    const { nguoiDaiDien, chuSoHuu, ...payload } = editForm
    await store.updateCompany(selectedCompanyId.value, payload)
    await store.fetchCompanies()
  }
  closeEditModal()
}

const handleDelete = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa doanh nghiệp này?')) {
    await store.deleteCompany(id)
    await store.fetchCompanies()
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

const statusClass = (status: string | null) => {
  switch (status) {
    case 'Đang hoạt động':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'Tạm ngừng':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'Giải thể':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const dinhDanhClass = (isUpdated?: boolean) =>
  isUpdated
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'

// Fetch when filters or page changes
watch(
  () => [filter.search, filter.trangThai, filter.loaiHinhDN, store.page],
  () => {
    store.fetchCompanies({
      search: filter.search,
      trangThai: filter.trangThai,
      loaiHinhDN: filter.loaiHinhDN,
      page: store.page,
      per_page: store.perPage,
    })
  },
  { debounce: 300 } as any,
)

onMounted(async () => {
  await loadStatuses()
  store.fetchCompanies()
})
</script>
