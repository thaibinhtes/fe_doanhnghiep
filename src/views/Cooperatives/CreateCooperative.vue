<template>
  <AdminLayout>
    <form class="mx-auto max-w-[1100px] space-y-6 pb-24" @submit.prevent="handleSubmit">
      <header class="flex flex-col gap-1.5">
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Thêm hợp tác xã
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Điền theo từng nhóm bên dưới. Trường đánh dấu <span class="font-medium text-red-500">*</span> là bắt buộc.
        </p>
      </header>

      <!-- 1. Thông tin chung -->
      <ComponentCard
        title="Thông tin chung"
        desc="Tên, mã số thuế và thông tin hoạt động của hợp tác xã"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tên hợp tác xã <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.tenHtx"
              type="text"
              required
              placeholder="Tên đầy đủ của hợp tác xã"
              :class="inputClass"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Mã số thuế
            </label>
            <input
              v-model="form.maSoThue"
              type="text"
              placeholder="VD: 0312345678"
              :class="inputClass"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Năm thành lập
            </label>
            <input v-model="form.namThanhLap" type="text" placeholder="VD: 2010" :class="inputClass" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Điện thoại
            </label>
            <input v-model="form.dienThoai" type="tel" placeholder="Số điện thoại liên hệ" :class="inputClass" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Lĩnh vực
            </label>
            <input v-model="form.linhVuc" type="text" placeholder="VD: Nông nghiệp, vận tải..." :class="inputClass" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tình trạng hoạt động
            </label>
            <input v-model="form.hoatDong" type="text" placeholder="VD: Đang hoạt động" :class="inputClass" />
          </div>
        </div>
      </ComponentCard>

      <!-- 2. Địa chỉ & địa bàn hành chính -->
      <ComponentCard
        title="Địa chỉ và địa bàn hành chính"
        desc="Gõ để tìm trong danh mục; nếu chưa có, chọn “Tạo mới” ngay trong ô"
      >
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <!-- Địa giới cũ -->
          <section class="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/40 sm:p-5">
            <div class="flex items-center gap-2">
              <span class="rounded-md bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                Địa giới cũ
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">trước sáp nhập</span>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Địa chỉ</label>
              <input
                v-model="form.diaChi"
                type="text"
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
                v-model="form.phuongXaCu"
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
          <section class="space-y-4 rounded-xl bg-emerald-50/60 p-4 dark:bg-emerald-950/20 sm:p-5">
            <div class="flex items-center gap-2">
              <span class="rounded-md bg-emerald-200/80 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                Địa giới mới
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">sau sáp nhập</span>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Địa chỉ mới</label>
              <input
                v-model="form.diaChiMoi"
                type="text"
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
                v-model="form.phuongXaMoi"
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
      </ComponentCard>

      <!-- 3. Quy mô & vốn -->
      <ComponentCard
        title="Quy mô và vốn"
        desc="Diện tích, vốn điều lệ và nhân lực của hợp tác xã"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Diện tích (ha)
            </label>
            <input
              v-model.number="form.dienTichHa"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              :class="inputClass"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Vốn điều lệ
            </label>
            <input v-model="form.vonDieuLe" type="text" placeholder="Nhập số tiền" :class="inputClass" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Số thành viên
            </label>
            <input v-model.number="form.soThanhVien" type="number" min="0" placeholder="0" :class="inputClass" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Số người lao động
            </label>
            <input v-model.number="form.soNguoiLaoDong" type="number" min="0" placeholder="0" :class="inputClass" />
          </div>
        </div>
      </ComponentCard>

      <!-- 4. Nhân sự & ghi chú -->
      <ComponentCard
        title="Nhân sự và ghi chú"
        desc="Ban quản trị, danh sách thành viên và ghi chú bổ sung"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2 sm:max-w-md">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Chủ tịch HĐQT
            </label>
            <input
              v-model="form.chuTichHdqtTen"
              type="text"
              placeholder="Họ tên chủ tịch HĐQT"
              :class="inputClass"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Danh sách thành viên
            </label>
            <textarea
              v-model="form.dsThanhVien"
              rows="3"
              placeholder="Thông tin thành viên (nếu có)"
              :class="textareaClass"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ghi chú
            </label>
            <textarea
              v-model="form.ghiChu"
              rows="2"
              placeholder="Ghi chú thêm"
              :class="textareaClass"
            />
          </div>
        </div>
      </ComponentCard>

      <!-- Thanh hành động dính đáy -->
      <div class="sticky bottom-4 z-20 space-y-3">
        <div
          v-if="error"
          class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg dark:border-red-800 dark:bg-red-950/80 dark:text-red-300"
        >
          {{ error }}
        </div>
        <div class="flex flex-col-reverse items-stretch gap-3 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 sm:flex-row sm:items-center sm:justify-between">
          <router-link
            to="/cooperatives"
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
              {{ submitting ? 'Đang lưu...' : 'Tạo hợp tác xã' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </AdminLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import AdministrativeCatalogSelect from '@/components/forms/FormElements/AdministrativeCatalogSelect.vue'
import { cooperativeService } from '@/services/cooperativeService'

const inputClass =
  'dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs transition placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800'

const textareaClass =
  'dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs transition placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800'

const router = useRouter()
const submitting = ref(false)
const error = ref<string | null>(null)

const administrativeIds = reactive({
  tinhCu: null as number | null,
  tinhMoi: null as number | null,
  huyenCu: null as number | null,
  huyenMoi: null as number | null,
  xaCu: null as number | null,
  xaMoi: null as number | null,
})

const form = reactive({
  tenHtx: '',
  maSoThue: '',
  namThanhLap: '',
  chuTichHdqtTen: '',
  dienThoai: '',
  diaChi: '',
  tinhThanhCu: '',
  tinhThanhMoi: '',
  quanHuyenCu: '',
  quanHuyenMoi: '',
  phuongXaCu: '',
  phuongXaMoi: '',
  dienTichHa: null as number | null,
  vonDieuLe: '',
  soThanhVien: null as number | null,
  soNguoiLaoDong: null as number | null,
  linhVuc: '',
  hoatDong: '',
  dsThanhVien: '',
  diaChiMoi: '',
  ghiChu: '',
})

async function handleSubmit() {
  submitting.value = true
  error.value = null

  try {
    await cooperativeService.create({
      tenHtx: form.tenHtx.trim(),
      maSoThue: form.maSoThue.trim() || undefined,
      namThanhLap: form.namThanhLap.trim() || undefined,
      chuTichHdqtTen: form.chuTichHdqtTen.trim() || undefined,
      dienThoai: form.dienThoai.trim() || undefined,
      diaChi: form.diaChi.trim() || undefined,
      tinhThanhCu: form.tinhThanhCu.trim() || undefined,
      tinhThanhMoi: form.tinhThanhMoi.trim() || undefined,
      quanHuyenCu: form.quanHuyenCu.trim() || undefined,
      quanHuyenMoi: form.quanHuyenMoi.trim() || undefined,
      phuongXaCu: form.phuongXaCu.trim() || undefined,
      phuongXaMoi: form.phuongXaMoi.trim() || undefined,
      phuongXa: (form.phuongXaMoi || form.phuongXaCu).trim() || undefined,
      dienTichHa: form.dienTichHa ?? undefined,
      vonDieuLe: form.vonDieuLe.trim() || undefined,
      soThanhVien: form.soThanhVien ?? undefined,
      soNguoiLaoDong: form.soNguoiLaoDong ?? undefined,
      linhVuc: form.linhVuc.trim() || undefined,
      hoatDong: form.hoatDong.trim() || undefined,
      dsThanhVien: form.dsThanhVien.trim() || undefined,
      diaChiMoi: form.diaChiMoi.trim() || undefined,
      ghiChu: form.ghiChu.trim() || undefined,
    })
    router.push('/cooperatives')
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không thể tạo hợp tác xã.'
  } finally {
    submitting.value = false
  }
}
</script>
