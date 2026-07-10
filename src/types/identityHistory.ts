export interface IdentityHistoryItem {
  id: number
  doanhNghiepId: number
  userId?: number | null
  userName?: string | null
  maSoDoanhNghiep?: string | null
  tenDoanhNghiep?: string | null
  hanhDong: 'dang_ky' | 'huy_dang_ky'
  hanhDongLabel: string
  giaTriCu: boolean
  giaTriMoi: boolean
  nguon: string
  nguonLabel: string
  ghiChu?: string | null
  createdAt?: string | null
  donViTen?: string | null
  donViMa?: string | null
}

export interface IdentityHistoryFilters {
  search?: string
  donViId?: string | number
  nguon?: string
  hanhDong?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  per_page?: number
}

export interface IdentityHistoryListResponse {
  data: IdentityHistoryItem[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const IDENTITY_SOURCE_OPTIONS = [
  { value: '', label: 'Tất cả nguồn' },
  { value: 'thu_cong', label: 'Thao tác thủ công' },
  { value: 'hang_loat', label: 'Cập nhật hàng loạt' },
  { value: 'import', label: 'Import Excel' },
  { value: 'tao_moi', label: 'Tạo doanh nghiệp' },
  { value: 'cap_nhat', label: 'Cập nhật doanh nghiệp' },
  { value: 'he_thong', label: 'Hệ thống' },
] as const

export const IDENTITY_ACTION_OPTIONS = [
  { value: '', label: 'Tất cả hành động' },
  { value: 'dang_ky', label: 'Đăng ký định danh' },
  { value: 'huy_dang_ky', label: 'Huỷ đăng ký định danh' },
] as const
