<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
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

            <!-- Địa chỉ trụ sở chính -->
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Địa chỉ trụ sở chính
              </label>
              <input
                type="text"
                v-model="form.diaChi"
                placeholder="Nhập địa chỉ trụ sở chính"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Quận / Huyện -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Quận / Huyện
              </label>
              <input
                type="text"
                v-model="form.quanHuyen"
                placeholder="Nhập quận/huyện"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Phường/xã -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Phường / xã
              </label>
              <input
                type="text"
                v-model="form.phuongXa"
                placeholder="Nhập phường/xã"
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

            <!-- Trạng thái -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Trạng thái
              </label>
              <div class="relative z-20 bg-transparent">
                <select
                  v-model="form.trangThai"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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
                  v-model="form.loaiHinhDN"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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
                v-model="form.nguoiDaiDien_id"
                placeholder="Nhập họ tên"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Ngày sinh người đại diện -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ngày sinh ngườ i đại diện
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
              <div class="relative z-20 bg-transparent">
                <select
                  v-model="form.chuSoHuu_id"
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
                v-model="form.nganhNgheKDChinh"
                placeholder="Nhập ngành nghề kinh doanh chính"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Ngành nghề KD -->
            <div class="sm:col-span-2 lg:col-span-3">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ngành nghề kinh doanh
              </label>
              <textarea
                v-model="form.nganhNgheKD"
                rows="3"
                placeholder="Nhập các ngành nghề kinh doanh"
                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Họ tên</label>
                      <input v-model="member.full_name" type="text" class="dark:bg-dark-900 h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Ngày sinh</label>
                      <input v-model="member.birthday" type="text" placeholder="DD/MM/YYYY" class="dark:bg-dark-900 h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Giới tính</label>
                      <select v-model="member.gender" class="dark:bg-dark-900 h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                        <option value="">Chọn</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Ngày gia nhập</label>
                      <input v-model="member.date_join" type="text" placeholder="DD/MM/YYYY" class="dark:bg-dark-900 h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Trạng thái</label>
                      <select v-model="member.status" class="dark:bg-dark-900 h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                        <option :value="true">Đang hoạt động</option>
                        <option :value="false">Ngừng hoạt động</option>
                      </select>
                    </div>
                    <div>
                      <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Chức vụ</label>
                      <input v-model="member.position" type="text" class="dark:bg-dark-900 h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Số tiền góp vốn</label>
                      <input v-model="member.investment_amount" type="number" class="dark:bg-dark-900 h-9 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
                      <p class="mt-0.5 text-[11px] text-gray-400">{{ formatVND(member.investment_amount) }}</p>
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
          <div class="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Lưu doanh nghiệp
            </button>
            <router-link
              to="/companies"
              class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              Hủy
            </router-link>
          </div>
        </form>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompaniesStore } from '@/stores/companies'
import { useMembersStore } from '@/stores/members'
import { formatVND } from '@/utils/formatters'
import type { Member } from '@/types/company'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const router = useRouter()
const store = useCompaniesStore()
const membersStore = useMembersStore()
const currentPageTitle = 'Tạo doanh nghiệp'

const form = reactive({
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

const addMember = () => {
  form.dsThanhVienGopVon.push({
    cccd: '',
    full_name: '',
    birthday: null,
    gender: null,
    date_join: null,
    status: true,
    position: null,
    investment_amount: null,
  })
}

const removeMember = (idx: number) => {
  form.dsThanhVienGopVon.splice(idx, 1)
}

onMounted(() => {
  membersStore.fetchMembers({ per_page: 100 })
})

const handleSubmit = async () => {
  try {
    await store.createCompany({ ...form })
    router.push('/companies')
  } catch {
    // Error already handled in store
  }
}
</script>
