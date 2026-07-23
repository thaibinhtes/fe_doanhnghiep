<template>
  <AdminLayout>
    <form class="w-full space-y-4 pb-20 3xl:mx-auto 3xl:max-w-[1680px]" @submit.prevent="handleSubmit">
      <header class="flex flex-col gap-1">
        <h1 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          Thêm doanh nghiệp
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Điền theo từng nhóm bên dưới. Trường đánh dấu <span class="font-medium text-red-500">*</span> là bắt buộc.
        </p>
      </header>

      <!-- 1. Thông tin chung -->
      <ComponentCard
        title="Thông tin chung"
        desc="Định danh pháp lý và thông tin liên hệ của doanh nghiệp"
      >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Mã số doanh nghiệp <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.maSoDoanhNghiep"
              required
              placeholder="VD: 0312345678"
              :class="inputClass"
            />
          </div>

          <div class="lg:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tên doanh nghiệp <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.tenDoanhNghiep"
              required
              placeholder="Tên đầy đủ theo giấy đăng ký"
              :class="inputClass"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Loại hình doanh nghiệp
            </label>
            <input
              v-model="form.loaiHinhDN"
              list="company-business-types"
              placeholder="VD: Công ty TNHH"
              :class="inputClass"
            />
            <datalist id="company-business-types">
              <option v-for="type in businessTypes" :key="type.id" :value="type.ten" />
            </datalist>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Loại DN
            </label>
            <div class="relative">
              <select v-model="form.loaiDN" :class="selectClass">
                <option value="TN">TN - Trong nước</option>
                <option value="NN">NN - Nước ngoài</option>
              </select>
              <SelectChevron />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Điện thoại
            </label>
            <input
              type="tel"
              v-model="form.dienThoai"
              placeholder="Số điện thoại liên hệ"
              :class="inputClass"
            />
          </div>
        </div>
      </ComponentCard>

      <!-- 2. Địa chỉ & địa bàn hành chính -->
      <ComponentCard
        title="Địa chỉ và địa bàn hành chính"
        desc="Gõ để tìm trong danh mục; nếu chưa có, chọn “Tạo mới” ngay trong ô"
      >
        <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <!-- Địa giới cũ -->
          <section class="space-y-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/40 sm:p-4">
            <div class="flex items-center gap-2">
              <span class="rounded-md bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                Địa giới cũ
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">trước sáp nhập</span>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Địa chỉ cũ</label>
              <input
                type="text"
                v-model="form.diaChiCu"
                placeholder="Số nhà, đường, khu phố..."
                :class="inputClass"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp tỉnh cũ</label>
              <AdministrativeCatalogSelect
                v-model="form.tinhThanhCu"
                v-model:selected-id="administrativeIds.tinhCu"
                cap="tinh"
                loai="cu"
                label="Cấp tỉnh cũ"
                placeholder="Tìm hoặc tạo cấp tỉnh cũ"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp huyện cũ</label>
              <AdministrativeCatalogSelect
                v-model="form.quanHuyenCu"
                v-model:selected-id="administrativeIds.huyenCu"
                cap="quan-huyen"
                loai="cu"
                :parent-id="administrativeIds.tinhCu"
                label="Cấp huyện cũ"
                placeholder="Tìm hoặc tạo cấp huyện cũ"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp xã cũ</label>
              <AdministrativeCatalogSelect
                v-model="form.xaPhuongCu"
                v-model:selected-id="administrativeIds.xaCu"
                cap="phuong-xa"
                loai="cu"
                :parent-id="administrativeIds.huyenCu"
                label="Cấp xã cũ"
                placeholder="Tìm hoặc tạo cấp xã cũ"
              />
            </div>
          </section>

          <!-- Địa giới mới -->
          <section class="space-y-3 rounded-xl bg-emerald-50/60 p-3 dark:bg-emerald-950/20 sm:p-4">
            <div class="flex items-center gap-2">
              <span class="rounded-md bg-emerald-200/80 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                Địa giới mới
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">sau sáp nhập</span>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Địa chỉ mới</label>
              <input
                type="text"
                v-model="form.diaChiMoi"
                placeholder="Số nhà, đường, khu phố..."
                :class="inputClass"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp tỉnh mới</label>
              <AdministrativeCatalogSelect
                v-model="form.tinhThanhMoi"
                v-model:selected-id="administrativeIds.tinhMoi"
                cap="tinh"
                loai="moi"
                label="Cấp tỉnh mới"
                placeholder="Tìm hoặc tạo cấp tỉnh mới"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp huyện mới</label>
              <AdministrativeCatalogSelect
                v-model="form.quanHuyenMoi"
                v-model:selected-id="administrativeIds.huyenMoi"
                cap="quan-huyen"
                loai="moi"
                :parent-id="administrativeIds.tinhMoi"
                label="Cấp huyện mới"
                placeholder="Tìm hoặc tạo cấp huyện mới"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cấp xã mới</label>
              <AdministrativeCatalogSelect
                v-model="form.xaPhuongMoi"
                v-model:selected-id="administrativeIds.xaMoi"
                cap="phuong-xa"
                loai="moi"
                :parent-id="administrativeIds.huyenMoi"
                label="Cấp xã mới"
                placeholder="Tìm hoặc tạo cấp xã mới"
              />
            </div>
          </section>
        </div>

        <div class="grid grid-cols-1 gap-3 border-t border-gray-100 pt-3 dark:border-gray-800 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Kinh độ (long)
            </label>
            <input
              type="number"
              step="any"
              v-model.number="form.long"
              placeholder="VD: 106.6297"
              :class="inputClass"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Vĩ độ (lat)
            </label>
            <input
              type="number"
              step="any"
              v-model.number="form.lat"
              placeholder="VD: 10.8231"
              :class="inputClass"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Toạ độ dùng để hiển thị doanh nghiệp trên bản đồ.</p>
          </div>
        </div>
      </ComponentCard>

      <!-- 3. Đăng ký & trạng thái -->
      <ComponentCard
        title="Đăng ký và trạng thái"
        desc="Thông tin giấy phép, vốn và tình trạng hoạt động"
      >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ngày cấp
            </label>
            <input type="text" v-model="form.ngayCap" placeholder="DD/MM/YYYY" :class="inputClass" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ngày đăng ký thay đổi
            </label>
            <input type="text" v-model="form.ngayDangKyThayDoi" placeholder="DD/MM/YYYY" :class="inputClass" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Số lượng lao động
            </label>
            <input type="number" v-model.number="form.soLuongLaoDong" min="0" placeholder="0" :class="inputClass" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Vốn điều lệ
            </label>
            <input type="text" v-model="form.vonDieuLe" placeholder="Nhập số tiền" :class="inputClass" />
            <p v-if="form.vonDieuLe" class="mt-1 text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {{ formatVND(form.vonDieuLe) }}
            </p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Định danh
            </label>
            <div class="relative">
              <select v-model="form.daCapNhatDinhDanh" :class="selectClass">
                <option :value="false">Chưa định danh</option>
                <option :value="true">Định danh</option>
              </select>
              <SelectChevron />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Trạng thái doanh nghiệp
            </label>
            <div class="relative">
              <select v-model.number="form.dnTrangThaiId" :class="selectClass">
                <option :value="null">Chọn trạng thái (tuỳ chọn)</option>
                <option v-for="status in otherStatuses" :key="status.id" :value="status.id">
                  {{ status.ten }}
                </option>
              </select>
              <SelectChevron />
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
              class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs transition focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
        </div>
      </ComponentCard>

      <!-- 4. Đại diện & sở hữu -->
      <ComponentCard
        title="Đại diện và sở hữu"
        desc="Người đại diện theo pháp luật, chủ sở hữu và cổ đông"
      >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Người đại diện theo pháp luật
            </label>
            <input
              type="text"
              v-model="form.nguoiDaiDienTen"
              placeholder="Họ tên người đại diện"
              :class="inputClass"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ngày sinh người đại diện
            </label>
            <input
              type="text"
              v-model="form.ngaySinhNguoiDaiDien"
              placeholder="DD/MM/YYYY"
              :class="inputClass"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Chủ sở hữu
            </label>
            <input
              type="text"
              v-model="form.chuSoHuuTen"
              placeholder="Họ tên chủ sở hữu"
              :class="inputClass"
            />
          </div>

          <div class="sm:col-span-2 lg:col-span-3">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Danh sách cổ đông
            </label>
            <input
              type="text"
              v-model="form.dsCoDong"
              placeholder="Nhập danh sách cổ đông"
              :class="inputClass"
            />
          </div>
        </div>
      </ComponentCard>

      <!-- 5. Ngành nghề kinh doanh -->
      <ComponentCard
        title="Ngành nghề kinh doanh"
        desc="Chọn theo mã VSIC; ngành đầu tiên hiển thị kèm nút xem toàn bộ khi danh sách dài"
      >
        <div class="grid grid-cols-1 gap-3">
          <div class="max-w-xl">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ngành nghề kinh doanh chính
            </label>
            <IndustryCategorySelect
              v-model="form.nganhNgheKDChinh"
              placeholder="Tìm và chọn mã ngành nghề chính"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ngành nghề kinh doanh
            </label>
            <IndustryCategorySelect
              v-model="form.nganhNgheKD"
              multiple
              placeholder="Tìm và chọn các mã ngành nghề"
            />
          </div>
        </div>
      </ComponentCard>

      <!-- 6. Thành viên góp vốn -->
      <ComponentCard
        title="Thành viên góp vốn"
        desc="Danh sách thành viên và số vốn góp tương ứng"
      >
        <template #header-right>
          <button
            type="button"
            @click="addMember"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 text-xs font-medium text-white transition hover:bg-brand-600 active:translate-y-px"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Thêm thành viên
          </button>
        </template>

        <div
          v-if="form.dsThanhVienGopVon.length === 0"
          class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Chưa có thành viên góp vốn nào.
          </p>
          <button
            type="button"
            @click="addMember"
            class="text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400"
          >
            Thêm thành viên đầu tiên
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(member, idx) in form.dsThanhVienGopVon"
            :key="idx"
            class="rounded-xl border border-gray-200 p-4 transition hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
          >
            <div class="mb-3 flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Thành viên {{ idx + 1 }}
              </span>
              <button
                type="button"
                @click="removeMember(idx)"
                class="rounded px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
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
                  class="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 transition focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
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
                  class="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 transition focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
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
                  class="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 transition focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
                <p v-if="member.investmentAmount" class="mt-0.5 text-[11px] tabular-nums text-gray-400">
                  {{ formatVND(Number(member.investmentAmount)) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      <!-- Thanh hành động dính đáy -->
      <div class="sticky bottom-4 z-20">
        <div class="flex flex-col-reverse items-stretch gap-3 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 sm:flex-row sm:items-center sm:justify-between">
          <router-link
            to="/companies"
            class="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:translate-y-px dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Hủy
          </router-link>
          <div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span class="text-center text-xs text-gray-500 dark:text-gray-400 sm:text-right">
              Dữ liệu hành chính sẽ tự liên kết vào danh mục.
            </span>
            <button
              type="submit"
              :disabled="submitting"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600 active:translate-y-px disabled:opacity-60"
            >
              <span
                v-if="submitting"
                class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              ></span>
              {{ submitting ? 'Đang lưu...' : 'Lưu doanh nghiệp' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCompaniesStore } from '@/stores/companies'
import { useCompanyStatuses } from '@/composables/useCompanyStatuses'
import { useCompanyBusinessTypes } from '@/composables/useCompanyBusinessTypes'
import { formatVND } from '@/utils/formatters'
import type { CapitalMemberInput } from '@/types/company'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import AdministrativeCatalogSelect from '@/components/forms/FormElements/AdministrativeCatalogSelect.vue'
import IndustryCategorySelect from '@/components/forms/FormElements/IndustryCategorySelect.vue'

const inputClass =
  'dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs transition placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800'

const selectClass =
  'dark:bg-dark-900 h-10 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-3 py-2 pr-10 text-sm text-gray-800 shadow-theme-xs transition focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'

const SelectChevron = defineComponent({
  name: 'SelectChevron',
  setup: () => () =>
    h(
      'span',
      { class: 'pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400' },
      [
        h(
          'svg',
          { class: 'stroke-current', width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': 'true' },
          [
            h('path', {
              d: 'M4.79175 7.396L10.0001 12.6043L15.2084 7.396',
              'stroke-width': '1.5',
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
            }),
          ],
        ),
      ],
    ),
})

const router = useRouter()
const store = useCompaniesStore()
const { identityStatuses, otherStatuses, requiresReason, loadStatuses } = useCompanyStatuses()
const { businessTypes, loadBusinessTypes, defaultTypeId } = useCompanyBusinessTypes()

const submitting = ref(false)

const administrativeIds = reactive({
  tinhCu: null as number | null,
  tinhMoi: null as number | null,
  huyenCu: null as number | null,
  huyenMoi: null as number | null,
  xaCu: null as number | null,
  xaMoi: null as number | null,
})

const form = reactive({
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
  submitting.value = true
  try {
    await store.createCompany(buildSubmitPayload())
    router.push('/companies')
  } catch {
    // Error already handled in store
  } finally {
    submitting.value = false
  }
}
</script>
