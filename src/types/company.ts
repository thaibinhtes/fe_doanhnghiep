export interface Member {
  id?: number
  cccd: string
  fullName: string
  birthday?: string | null
  gender?: string | null
  dateJoin?: string | null
  status: boolean
  position?: string | null
  investmentAmount?: number | null
  createdAt?: string
  updatedAt?: string
  member_company?: MemberCompany
}

export interface MemberCompany {
  id?: number
  member_id?: number
  doanh_nghiep_id?: number
  date_join?: string
  position?: string
  investment_amount?: number
}

export interface CapitalMemberInput {
  fullName: string
  position?: string | null
  investmentAmount?: number | null
  dateJoin?: string | null
  memberId?: number | null
}

// Company model — backend trả về đúng tên field tiếng Việt
export interface Company {
  id: number
  tt: number | null
  maSoDoanhNghiep: string
  tenDoanhNghiep: string
  diaChi: string | null
  long?: number | null
  lat?: number | null
  quanHuyen: string | null
  phuongXa: string | null
  vonDieuLe: string | null
  trangThai: string | null
  daCapNhatDinhDanh?: boolean
  trangThaiDinhDanh?: string
  dienThoai: string | null
  nguoiDaiDienTen?: string | null
  ngaySinhNguoiDaiDien?: string | null
  chuSoHuuTen?: string | null
  nguoiDaiDienID?: number | null
  nguoiDaiDien?: Member | null
  chuSoHuuID?: number | null
  chuSoHuu?: Member | null
  nganhNgheKDChinh: string | null
  nganhNgheKD: string | null
  ngayCap: string | null
  ngayDangKyThayDoi: string | null
  loaiHinhDN: string | null
  soLuongLaoDong: number | null
  dsThanhVienGopVon?: CapitalMemberInput[] | null
  danhSachThanhVienGopVon?: CapitalMemberInput[] | null
  dsCoDong?: string | null
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
  daCapNhatDinhDanh?: boolean
  hasCoordinates?: boolean
  page?: number
  per_page?: number
}

export interface CompanyImportError {
  row: number
  message: string
}

export interface CompanyImportResult {
  imported: number
  updated: number
  failed: number
  errors: CompanyImportError[]
}
