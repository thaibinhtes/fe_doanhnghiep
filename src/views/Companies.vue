<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Danh sách doanh nghiệp" className="overflow-hidden">
        <!-- Filters -->
        <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div class="w-[200px]">
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
          <button
            @click="resetFilters"
            class="h-11 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Đặt lại
          </button>
          <router-link
            to="/companies/create"
            class="h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
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

        <div class="overflow-x-auto">
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
              <div class="flex-none w-[80px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Loại DN</div>
              <div class="flex-none w-[100px] p-[5px] text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</div>
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
                    {{ company.trangThai }}
                  </span>
                </div>
                <div class="flex-none w-[110px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.dienThoai }}</div>
                <div class="flex-none w-[180px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ memberName(company.nguoiDaiDien_id) }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.ngaySinhNguoiDaiDien }}</div>
                <div class="flex-none w-[160px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ memberName(company.chuSoHuu_id) }}</div>
                <div class="flex-none w-[200px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.nganhNgheKDChinh }}</div>
                <div class="flex-none w-[260px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.nganhNgheKD }}</div>
                <div class="flex-none w-[110px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.ngayCap }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.ngayDangKyThayDoi }}</div>
                <div class="flex-none w-[140px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.loaiHinhDN }}</div>
                <div class="flex-none w-[100px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ formatNumber(company.soLuongLaoDong) }}</div>
                <div class="flex-none w-[180px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">
                  <div v-if="company.dsThanhVienGopVon && company.dsThanhVienGopVon.length" class="space-y-1">
                    <div v-for="(member, idx) in company.dsThanhVienGopVon.slice(0, 2)" :key="idx" class="text-xs">
                      <span class="font-medium">{{ member.full_name }}</span>
                      <span v-if="member.investment_amount" class="text-gray-500"> — {{ formatVND(member.investment_amount) }}</span>
                    </div>
                    <div v-if="company.dsThanhVienGopVon.length > 2" class="text-xs text-gray-500">+{{ company.dsThanhVienGopVon.length - 2 }} thành viên</div>
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </div>
                <div class="flex-none w-[180px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.dsCoDong }}</div>
                <div class="flex-none w-[80px] p-[5px] text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{{ company.loaiDN }}</div>
                <div class="flex-none w-[100px] p-[5px]">
                  <div class="flex items-center gap-2">
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
        <div class="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Tổng số: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ store.total }}</span> bản ghi
          </p>
          <div class="flex items-center gap-2">
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
                'inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition',
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
          class="no-scrollbar relative w-full max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900 lg:p-10"
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
                  Quận / Huyện
                </label>
                <input
                  type="text"
                  v-model="editForm.quanHuyen"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Phường/xã -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Phường / xã
                </label>
                <input
                  type="text"
                  v-model="editForm.phuongXa"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
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
                  Trạng thái
                </label>
                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="editForm.trangThai"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
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
                  v-model="editForm.nguoiDaiDien"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Ngày sinh ngườ i đại diện -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày sinh ngườ i đại diện
                </label>
                <input
                  type="text"
                  v-model="editForm.ngaySinhNguoiDaiDien"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <!-- Chủ sở hữu -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Chủ sở hữu
                </label>
                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="editForm.chuSoHuu_id"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <option :value="null">-- Chọn thành viên --</option>
                    <option v-for="m in membersStore.members" :key="m.id || m.cccd" :value="m.id">
                      {{ m.full_name }} · {{ m.cccd }}
                    </option>
                  </select>
                  <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                    <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
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
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Danh sách thành viên góp vốn
                </label>
                <div class="flex items-center gap-2 mb-3">
                  <div class="relative z-20 flex-1 bg-transparent">
                    <select
                      v-model="selectedMemberId"
                      class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                    >
                      <option :value="null">-- Chọn thành viên --</option>
                      <option v-for="m in membersStore.members" :key="m.id || m.cccd" :value="m.id">
                        {{ m.full_name }} · CCCD: {{ m.cccd }}
                      </option>
                    </select>
                    <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                      <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <button
                    type="button"
                    @click="addEditMember"
                    :disabled="selectedMemberId === null"
                    class="h-11 inline-flex items-center gap-1 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Thêm
                  </button>
                </div>
                <div v-if="editForm.dsThanhVienGopVon.length === 0" class="text-sm text-gray-400 py-2">Chưa có thành viên</div>
                <div v-else class="space-y-2">
                  <div
                    v-for="(member, idx) in editForm.dsThanhVienGopVon"
                    :key="idx"
                    class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5"
                  >
                    <div class="flex items-center gap-3">
                      <div class="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-xs font-semibold text-brand-600 dark:text-brand-400">
                        {{ member.full_name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ member.full_name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          CCCD: {{ member.cccd }} · {{ member.position || 'Chưa có chức vụ' }} · {{ formatVND(member.investment_amount) }}
                          <span
                            :class="[
                              'ml-1 inline-block w-2 h-2 rounded-full',
                              member.status ? 'bg-green-500' : 'bg-gray-400',
                            ]"
                          />
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="removeEditMember(idx)"
                      class="text-red-500 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Xóa
                    </button>
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
            <div class="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Cập nhật
              </button>
              <button
                type="button"
                @click="closeEditModal"
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useCompaniesStore } from '@/stores/companies'
import { useMembersStore } from '@/stores/members'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/profile/Modal.vue'
import type { Company, Member } from '@/types/company'
import { formatVND, formatNumber } from '@/utils/formatters'

const store = useCompaniesStore()
const membersStore = useMembersStore()
const currentPageTitle = ref('Danh sách doanh nghiệp')

const filter = reactive({
  search: '',
  trangThai: '',
  loaiHinhDN: '',
})

const isEditModalOpen = ref(false)
const selectedCompanyId = ref<number | null>(null)

const editForm = reactive<Company>({
  id: 0,
  tt: 0,
  maSoDoanhNghiep: '',
  tenDoanhNghiep: '',
  diaChi: '',
  quanHuyen: '',
  phuongXa: '',
  vonDieuLe: '',
  trangThai: 'Đang hoạt động',
  dienThoai: '',
  nguoiDaiDien_id: null,
  ngaySinhNguoiDaiDien: '',
  chuSoHuu_id: null,
  nganhNgheKDChinh: '',
  nganhNgheKD: '',
  ngayCap: '',
  ngayDangKyThayDoi: '',
  loaiHinhDN: 'Công ty TNHH',
  soLuongLaoDong: 0,
  dsThanhVienGopVon: [] as Member[],
  dsCoDong: '',
  loaiDN: 'TN',
})

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

const openEditModal = (company: Company) => {
  selectedCompanyId.value = company.id
  Object.assign(editForm, company)
  membersStore.fetchMembers({ per_page: 100 })
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedCompanyId.value = null
}

const handleUpdate = async () => {
  if (selectedCompanyId.value !== null) {
    await store.updateCompany(selectedCompanyId.value, { ...editForm })
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

const addEditMember = () => {
  editForm.dsThanhVienGopVon.push({
    full_name: '',
    birthday: null,
    gender: null,
    date_join: null,
    status: true,
    position: null,
    investment_amount: null,
  })
}

const removeEditMember = (idx: number) => {
  editForm.dsThanhVienGopVon.splice(idx, 1)
}

const memberName = (id: number | null) => {
  if (id === null) return '-'
  const member = membersStore.members.find((m: any) => m.id === id)
  return member ? member.full_name : '-'
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

onMounted(() => {
  store.fetchCompanies()
  membersStore.fetchMembers({ per_page: 100 })
})
</script>
