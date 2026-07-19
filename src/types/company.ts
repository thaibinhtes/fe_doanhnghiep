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
export interface NganhNgheItem {
  ma: string
  ten: string | null
}

export interface Company {
  id: number
  tt: number | null
  maSoDoanhNghiep: string
  tenDoanhNghiep: string
  diaChi: string | null
  diaChiCu?: string | null
  diaChiMoi?: string | null
  long?: number | null
  lat?: number | null
  quanHuyen: string | null
  phuongXa: string | null
  tinhThanhCu?: string | null
  tinhThanhMoi?: string | null
  tinhThanhCuCode?: string | null
  tinhThanhCuLinked?: {
    code: string
    fullName: string
  } | null
  quanHuyenCu?: string | null
  quanHuyenCuCode?: string | null
  quanHuyenCuLinked?: {
    code: string
    fullName: string
  } | null
  quanHuyenMoi?: string | null
  tinhThanhCode?: string | null
  tinhThanh?: {
    code: string
    fullName: string
  } | null
  xaPhuongCu?: string | null
  phuongXaCu?: string | null
  xaPhuongCuCode?: string | null
  xaPhuongCuLinked?: {
    code: string
    fullName: string
  } | null
  xaPhuongMoi?: string | null
  phuongXaMoi?: string | null
  xaPhuongCode?: string | null
  xaPhuong?: {
    code: string
    fullName: string
  } | null
  tinhThanhCuId?: number | null
  tinhThanhMoiId?: number | null
  quanHuyenCuId?: number | null
  xaPhuongCuId?: number | null
  quanHuyenMoiId?: number | null
  xaPhuongMoiId?: number | null
  ghiChuHanhChinh?: string | null
  quanHuyenHanhChinhLinked?: boolean
  quanHuyenCuMoiLabel?: string | null
  vonDieuLe: string | null
  trangThai: string | null
  dnTrangThaiId?: number | null
  lyDoTrangThai?: string | null
  dnTrangThai?: {
    id: number
    ma: string
    ten: string
    loai: string
    yeuCauLyDo: boolean
  } | null
  tinhTrangThue?: string | null
  hasTaxLink?: boolean
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
  nganhNgheKDChinhTen?: string | null
  nganhNgheKDChinhInfo?: {
    id: number
    ma: string
    ten: string
    cap: number
  } | null
  nganhNgheKD: string[] | null
  nganhNgheKDList?: NganhNgheItem[]
  nganhNgheKDTen?: string | null
  ngayCap: string | null
  ngayDangKyThayDoi: string | null
  loaiHinhDN: string | null
  dnLoaiHinhId: number | null
  soLuongLaoDong: number | null
  dsThanhVienGopVon?: CapitalMemberInput[] | null
  danhSachThanhVienGopVon?: CapitalMemberInput[] | null
  dsCoDong?: string | null
  loaiDN: string | null
  donViId?: number | null
  donViTen?: string | null
  donVi?: {
    id: number
    ma: string
    ten: string
    cap: number
  } | null
  createdByUserId?: number | null
  createdByUser?: {
    id: number
    name: string
    email: string
  } | null
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
  dnTrangThaiId?: number | string
  loaiHinhDN?: string
  loaiHinhId?: number | string
  dnLoaiHinhId?: number | null
  quanHuyen?: string
  phuongXa?: string
  daCapNhatDinhDanh?: boolean
  hasCoordinates?: boolean
  donViId?: number | string
  page?: number
  per_page?: number
}

export const COMPANY_IMPORT_COLUMN_LABELS: Record<string, string> = {
  tt: 'TT',
  maSoDoanhNghiep: 'Mã số doanh nghiệp',
  tenDoanhNghiep: 'Tên doanh nghiệp',
  tinhThanhCu: 'Cấp tỉnh (cũ)',
  quanHuyenCu: 'Quận / Huyện cũ',
  quanHuyenMoi: 'Quận / Huyện mới',
  phuongXaCu: 'Phường / Xã cũ',
  phuongXaMoi: 'Phường / Xã mới',
  diaChiCu: 'Địa chỉ cũ',
  diaChiMoi: 'Địa chỉ mới',
  vonDieuLe: 'Vốn điều lệ',
  trangThai: 'Trạng thái',
  dienThoai: 'Điện thoại',
  nguoiDaiDienTen: 'Người đại diện theo pháp luật',
  ngaySinhNguoiDaiDien: 'Ngày sinh người đại diện',
  chuSoHuuTen: 'Chủ sở hữu',
  nganhNgheKDChinh: 'Ngành nghề KD chính',
  nganhNgheKD: 'Ngành nghề KD',
  ngayCap: 'Ngày cấp',
  ngayDangKyThayDoi: 'Ngày đăng ký thay đổi',
  loaiHinhDN: 'Loại hình DN',
  soLuongLaoDong: 'Số lượng lao động',
  dsThanhVienGopVon: 'DS thành viên góp vốn',
  dsCoDong: 'DS cổ đông',
  daCapNhatDinhDanh: 'Định danh',
  loaiDN: 'Loại DN',
  long: 'Kinh độ (long)',
  lat: 'Vĩ độ (lat)',
}

export interface CompanyImportColumnMap {
  [key: string]: string[]
}

export interface CompanyImportConfig {
  startRow: number
  columnMap: CompanyImportColumnMap
  columnLabels?: Record<string, string>
  availableValueExtensions?: CompanyImportValueExtensionField[]
  valueExtensions?: Record<string, string>
}

export interface CompanyIdentityImportConfig {
  startRow: number
  columnMap: CompanyImportColumnMap
  columnLabels?: Record<string, string>
}

export interface CompanyFieldUpdateConfig {
  startRow: number
  lookupField: string
  columnMap: CompanyImportColumnMap
  lookupFields: Record<string, string>
  updateFields: Record<string, string>
  columnLabels?: Record<string, string>
}

export interface CompanyIdentityImportSavedConfig extends CompanyIdentityImportConfig {
  id: string
  name: string
  identityDate: string
  createdAt: string
}

export interface CompanyIdentityImportHistoryItem {
  id: string
  fileName: string
  identityDate: string
  importedAt: string
  result: CompanyImportResult
}

export interface CompanyImportValueExtensionOption {
  key: string
  label: string
}

export interface CompanyImportValueExtensionField {
  field: string
  fieldLabel: string
  extensions: CompanyImportValueExtensionOption[]
}

export interface CompanyImportFormat {
  id: number
  name: string
  startRow: number
  columnMap: CompanyImportColumnMap
  valueExtensions?: Record<string, string>
  donViId?: number | null
  createdAt?: string
  updatedAt?: string
}

/** Config ánh xạ mẫu hệ thống (example) — load từ backend khi import. */
export interface CompanyImportExampleConfig {
  id: number
  name: string
  code: string
  description?: string | null
  startRow: number
  columnMap: CompanyImportColumnMap
  valueExtensions?: Record<string, string>
  isActive?: boolean
  sortOrder?: number
}

export interface CompanyImportError {
  row: number
  message: string
}

export interface CompanyImportResult {
  imported: number
  duplicates?: number
  updated: number
  skipped?: number
  failed: number
  errors: CompanyImportError[]
}

export type CompanyImportRowStatus = 'success' | 'duplicate' | 'failed'

export interface CompanyImportJobRow {
  id: number
  rowNumber: number
  status: CompanyImportRowStatus
  maSoDoanhNghiep: string | null
  tenDoanhNghiep: string | null
  doanhNghiepId: number | null
  message: string | null
  createdAt?: string | null
}

export interface CompanyImportJobSummary {
  imported: number
  duplicates: number
  failed: number
}

export interface CompanyImportJobListItem {
  id: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  type: string
  originalFilename?: string | null
  result?: CompanyImportResult | null
  summary: CompanyImportJobSummary
  errorMessage?: string | null
  importedBy?: {
    id: number
    name: string
  } | null
  donVi?: {
    id: number
    ten: string
    ma: string
  } | null
  startedAt?: string | null
  finishedAt?: string | null
  createdAt?: string | null
  rowCounts?: {
    success: number
    duplicate: number
    failed: number
  }
}

export interface CompanyImportJobQueued {
  importJobId: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  originalFilename?: string | null
}

export interface CompanyImportJobStatus extends CompanyImportJobQueued {
  id: number
  type: string
  result?: CompanyImportResult | null
  summary?: CompanyImportJobSummary
  importedBy?: {
    id: number
    name: string
  } | null
  donVi?: {
    id: number
    ten: string
    ma: string
  } | null
  rowCounts?: {
    success: number
    duplicate: number
    failed: number
  }
  errorMessage?: string | null
  startedAt?: string | null
  finishedAt?: string | null
  createdAt?: string | null
}

export interface CompanyIdentityBulkItem {
  maSoDoanhNghiep: string
  daCapNhatDinhDanh: boolean
}

export interface CompanyBulkDeleteResult {
  deleted: number
  failed: number
  errors: Array<{ id: number; message: string }>
}
