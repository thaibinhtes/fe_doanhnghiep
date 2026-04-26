import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { companyService } from '@/services/companyService'
import type { Company, CompanyFilters, CompanyListMeta } from '@/types/company'

export const useCompaniesStore = defineStore('companies', () => {
  // State
  const companies = ref<Company[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref<CompanyListMeta>({
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: '',
    per_page: 15,
    to: 1,
    total: 0,
  })

  // Getters
  const page = computed(() => meta.value.current_page)
  const perPage = computed(() => meta.value.per_page)
  const total = computed(() => meta.value.total)
  const totalPages = computed(() => meta.value.last_page)

  // Actions
  async function fetchCompanies(filters?: CompanyFilters) {
    loading.value = true
    error.value = null
    try {
      const response = await companyService.getAll(filters)
      companies.value = response.data.map((c) => ({
        ...c,
        tt: c.tt ?? c.id,
        maSoDoanhNghiep: c.maSoDoanhNghiep || '',
        tenDoanhNghiep: c.tenDoanhNghiep || '',
        diaChi: c.diaChi || '-',
        quanHuyen: c.quanHuyen || '-',
        phuongXa: c.phuongXa || '-',
        vonDieuLe: c.vonDieuLe || '-',
        trangThai: c.trangThai || '-',
        dienThoai: c.dienThoai || '-',
        nguoiDaiDien: c.nguoiDaiDien || '-',
        ngaySinhNguoiDaiDien: c.ngaySinhNguoiDaiDien || '-',
        chuSoHuu: c.chuSoHuu || '-',
        nganhNgheKDChinh: c.nganhNgheKDChinh || '-',
        nganhNgheKD: c.nganhNgheKD || '-',
        ngayCap: c.ngayCap || '-',
        ngayDangKyThayDoi: c.ngayDangKyThayDoi || '-',
        loaiHinhDN: c.loaiHinhDN || '-',
        soLuongLaoDong: c.soLuongLaoDong ?? 0,
        dsThanhVienGopVon: c.dsThanhVienGopVon ?? [],
        dsCoDong: c.dsCoDong || '-',
        loaiDN: c.loaiDN || '-',
      }))
      meta.value = response.meta
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không thể tải danh sách doanh nghiệp'
      console.error('fetchCompanies error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createCompany(companyData: Partial<Company>) {
    loading.value = true
    error.value = null
    try {
      const newCompany = await companyService.create(companyData)
      companies.value.unshift(newCompany)
      meta.value.total += 1
      return newCompany
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không thể tạo doanh nghiệp'
      console.error('createCompany error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCompany(id: number, companyData: Partial<Company>) {
    loading.value = true
    error.value = null
    try {
      const updated = await companyService.update(id, companyData)
      const index = companies.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        companies.value[index] = updated
      }
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không thể cập nhật doanh nghiệp'
      console.error('updateCompany error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCompany(id: number) {
    loading.value = true
    error.value = null
    try {
      await companyService.delete(id)
      companies.value = companies.value.filter((c) => c.id !== id)
      meta.value.total -= 1
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không thể xóa doanh nghiệp'
      console.error('deleteCompany error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(newPage: number) {
    meta.value.current_page = newPage
  }

  function resetError() {
    error.value = null
  }

  return {
    companies,
    loading,
    error,
    meta,
    page,
    perPage,
    total,
    totalPages,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    setPage,
    resetError,
  }
})
