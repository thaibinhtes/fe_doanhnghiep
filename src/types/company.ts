export interface Member {
  id?: number
  cccd: string
  full_name: string
  birthday: string | null
  gender: string | null
  date_join: string | null
  status: boolean
  position: string | null
  investment_amount: number | null
}

// Company model — backend trả về đúng tên field tiếng Việt
export interface Company {
  id: number
  tt: number | null
  maSoDoanhNghiep: string
  tenDoanhNghiep: string
  diaChi: string | null
  quanHuyen: string | null
  phuongXa: string | null
  vonDieuLe: string | null
  trangThai: string | null
  dienThoai: string | null
  nguoiDaiDien_id: number | null
  ngaySinhNguoiDaiDien: string | null
  chuSoHuu_id: number | null
  nganhNgheKDChinh: string | null
  nganhNgheKD: string | null
  ngayCap: string | null
  ngayDangKyThayDoi: string | null
  loaiHinhDN: string | null
  soLuongLaoDong: number | null
  dsThanhVienGopVon: Member[] | null
  dsCoDong: string | null
  loaiDN: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CompanyListLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface CompanyListMeta {
  current_page: number
  from: number | null
  last_page: number
  links: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface CompanyListResponse {
  data: Company[]
  links: CompanyListLinks
  meta: CompanyListMeta
}

export interface CompanyFilters {
  search?: string
  trangThai?: string
  loaiHinhDN?: string
  page?: number
  per_page?: number
}
