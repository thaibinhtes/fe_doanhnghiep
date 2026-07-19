<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Thông tin doanh nghiệp">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Mã số doanh nghiệp -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Mã số doanh nghiệp <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.maSoDoanhNghiep"
                placeholder="Nhập mã số doanh nghiệp"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Tên doanh nghiệp -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tên doanh nghiệp <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.tenDoanhNghiep"
                placeholder="Nhập tên doanh nghiệp"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Điện thoại -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Điện thoại
              </label>
              <input
                type="text"
                v-model="form.dienThoai"
                placeholder="Nhập số điện thoại"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Địa chỉ cũ
              </label>
              <input
                type="text"
                v-model="form.diaChiCu"
                placeholder="Nhập địa chỉ cũ"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Địa chỉ mới
              </label>
              <input
                type="text"
                v-model="form.diaChiMoi"
                placeholder="Nhập địa chỉ mới"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp tỉnh cũ</label>
              <input
                type="text"
                v-model="form.tinhThanhCu"
                placeholder="Nhập cấp tỉnh cũ"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp huyện cũ</label>
              <input
                type="text"
                v-model="form.quanHuyenCu"
                placeholder="Nhập cấp huyện cũ"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp xã cũ</label>
              <input
                type="text"
                v-model="form.xaPhuongCu"
                placeholder="Nhập cấp xã cũ"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp huyện mới</label>
              <input
                type="text"
                v-model="form.quanHuyenMoi"
                placeholder="Nhập cấp huyện mới"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp xã mới</label>
              <input
                type="text"
                v-model="form.xaPhuongMoi"
                placeholder="Nhập cấp xã mới"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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
                v-model.number="form.long"
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
                v-model.number="form.lat"
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
                v-model="form.vonDieuLe"
                placeholder="Nhập số tiền"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ formatVND(form.vonDieuLe) }}</p>
            </div>

            <!-- Định danh -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Định danh
              </label>
              <div class="relative z-20 bg-transparent">
                <select
                  v-model="form.daCapNhatDinhDanh"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option :value="false">Chưa định danh</option>
                  <option :value="true">Định danh</option>
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

            <!-- Trạng thái doanh nghiệp -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Trạng thái doanh nghiệp
              </label>
              <div class="relative z-20 bg-transparent">
                <select
                  v-model.number="form.dnTrangThaiId"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option :value="null">Chọn trạng thái (tuỳ chọn)</option>
                  <option v-for="status in otherStatuses" :key="status.id" :value="status.id">
                    {{ status.ten }}
                  </option>
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

            <div v-if="showReasonField" class="sm:col-span-2 lg:col-span-3">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Lý do trạng thái <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.lyDoTrangThai"
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
                v-model="form.loaiHinhDN"
                list="company-business-types"
                placeholder="Nhập loại hình doanh nghiệp"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
              <datalist id="company-business-types">
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
                v-model="form.ngayCap"
                placeholder="DD/MM/YYYY"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Ngày đăng ký thay đổi -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ngày đăng ký thay đổi
              </label>
              <input
                type="text"
                v-model="form.ngayDangKyThayDoi"
                placeholder="DD/MM/YYYY"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Số lượng lao động -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Số lượng lao động
              </label>
              <input
                type="number"
                v-model.number="form.soLuongLaoDong"
                placeholder="0"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Loại DN -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Loại DN
              </label>
              <div class="relative z-20 bg-transparent">
                <select
                  v-model="form.loaiDN"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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

            <!-- Người đại diện theo pháp luật -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Người đại diện theo pháp luật
              </label>
              <input
                type="text"
                v-model="form.nguoiDaiDienTen"
                placeholder="Nhập họ tên người đại diện"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Ngày sinh người đại diện -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ngày sinh người đại diện
              </label>
              <input
                type="text"
                v-model="form.ngaySinhNguoiDaiDien"
                placeholder="DD/MM/YYYY"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Chủ sở hữu -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Chủ sở hữu
              </label>
              <input
                type="text"
                v-model="form.chuSoHuuTen"
                placeholder="Nhập họ tên chủ sở hữu"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Ngành nghề KD chính -->
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ngành nghề kinh doanh chính
              </label>
              <IndustryCategorySelect
                v-model="form.nganhNgheKDChinh"
                placeholder="Tìm và chọn mã ngành nghề chính"
              />
            </div>

            <!-- Ngành nghề KD -->
            <div class="sm:col-span-2 lg:col-span-3">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ngành nghề kinh doanh
              </label>
              <IndustryCategorySelect
                v-model="form.nganhNgheKD"
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
                  @click="addMember"
                  class="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Thêm thành viên
                </button>
              </div>
              <div v-if="form.dsThanhVienGopVon.length === 0" class="text-sm text-gray-400 py-2">Chưa có thành viên</div>
              <div v-else class="space-y-3">
                <div
                  v-for="(member, idx) in form.dsThanhVienGopVon"
                  :key="idx"
                  class="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Thành viên {{ idx + 1 }}</span>
                    <button
                      type="button"
                      @click="removeMember(idx)"
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
                v-model="form.dsCoDong"
                placeholder="Nhập danh sách cổ đông"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col-reverse gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center">
            <router-link
              to="/companies"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              Hủy
            </router-link>
            <button
              type="submit"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Lưu doanh nghiệp
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCompaniesStore } from '@/stores/companies'
import { useCompanyStatuses } from '@/composables/useCompanyStatuses'
import { useCompanyBusinessTypes } from '@/composables/useCompanyBusinessTypes'
import { formatVND } from '@/utils/formatters'
import type { CapitalMemberInput } from '@/types/company'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import IndustryCategorySelect from '@/components/forms/FormElements/IndustryCategorySelect.vue'

const router = useRouter()
const store = useCompaniesStore()
const { identityStatuses, otherStatuses, requiresReason, loadStatuses } = useCompanyStatuses()
const { businessTypes, loadBusinessTypes, defaultTypeId } = useCompanyBusinessTypes()

const form = reactive({
  maSoDoanhNghiep: '',
  tenDoanhNghiep: '',
  diaChi: '',
  diaChiCu: '',
  diaChiMoi: '',
  quanHuyen: '',
  phuongXa: '',
  tinhThanhCu: '',
  quanHuyenCu: '',
  quanHuyenMoi: '',
  xaPhuongCu: '',
  xaPhuongMoi: '',
  long: null as number | null,
  lat: null as number | null,
  vonDieuLe: '',
  daCapNhatDinhDanh: false,
  dnTrangThaiId: null as number | null,
  lyDoTrangThai: '',
  dienThoai: '',
  nguoiDaiDienTen: '',
  ngaySinhNguoiDaiDien: '',
  chuSoHuuTen: '',
  nganhNgheKDChinh: null as string | null,
  nganhNgheKD: [] as string[],
  ngayCap: '',
  ngayDangKyThayDoi: '',
  loaiHinhDN: '',
  soLuongLaoDong: 0,
  dsThanhVienGopVon: [] as CapitalMemberInput[],
  dsCoDong: '',
  loaiDN: 'TN',
})

const showReasonField = computed(() => requiresReason(form.dnTrangThaiId))

const isOtherStatusSelected = computed(() =>
  otherStatuses.value.some((status) => status.id === form.dnTrangThaiId),
)

const buildSubmitPayload = () => {
  const payload = {
    ...form,
    diaChi: form.diaChiMoi || form.diaChiCu,
    quanHuyen: form.quanHuyenMoi || form.quanHuyenCu,
    phuongXa: form.xaPhuongMoi || form.xaPhuongCu,
    phuongXaCu: form.xaPhuongCu,
    phuongXaMoi: form.xaPhuongMoi,
  }

  if (!isOtherStatusSelected.value) {
    const ma = form.daCapNhatDinhDanh ? 'da_dinh_danh' : 'chua_dinh_danh'
    const status = identityStatuses.value.find((item) => item.ma === ma)
    if (status) {
      payload.dnTrangThaiId = status.id
    }
  }

  return payload
}

onMounted(async () => {
  await Promise.all([
    loadStatuses(),
    loadBusinessTypes(),
  ])
  if (defaultTypeId.value) {
    form.loaiHinhDN = businessTypes.value.find((type) => type.id === defaultTypeId.value)?.ten ?? ''
  }
})

const addMember = () => {
  form.dsThanhVienGopVon.push({
    fullName: '',
    position: null,
    investmentAmount: null,
  })
}

const removeMember = (idx: number) => {
  form.dsThanhVienGopVon.splice(idx, 1)
}

const handleSubmit = async () => {
  try {
    await store.createCompany(buildSubmitPayload())
    router.push('/companies')
  } catch {
    // Error already handled in store
  }
}
</script>
