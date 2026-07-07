export interface Cooperative {
  id: number
  tt?: number | null
  tenHtx: string
  maSoThue?: string | null
  namThanhLap?: string | null
  chuTichHdqtTen?: string | null
  dienThoai?: string | null
  diaChi?: string | null
  phuongXa?: string | null
  dienTichHa?: number | null
  vonDieuLe?: string | null
  soThanhVien?: number | null
  soNguoiLaoDong?: number | null
  linhVuc?: string | null
  hoatDong?: string | null
  dsThanhVien?: string | null
  diaChiMoi?: string | null
  ghiChu?: string | null
  donViId?: number | null
  donViTen?: string | null
  donVi?: { id: number; ten: string } | null
  createdByUserId?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface CooperativeFilters {
  page?: number
  per_page?: number
  search?: string
  phuongXa?: string
  linhVuc?: string
  hoatDong?: string
  donViId?: string | number
}

export interface CooperativeListMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  path: string
  links: Array<{ url: string | null; label: string; active: boolean }>
}

export interface CooperativeListResponse {
  data: Cooperative[]
  meta: CooperativeListMeta
}

export type CooperativeImportColumnMap = Record<string, string[]>

export interface CooperativeImportConfig {
  startRow: number
  columnMap: CooperativeImportColumnMap
  columnLabels: Record<string, string>
  valueExtensions?: Record<string, string>
  defaultConfigCode?: string
}

export interface CooperativeImportFormat {
  id: number
  name: string
  startRow: number
  columnMap: CooperativeImportColumnMap
  valueExtensions?: Record<string, string>
}

export interface CooperativeImportExampleConfig {
  id: number
  name: string
  code: string
  description?: string | null
  startRow: number
  columnMap: CooperativeImportColumnMap
  valueExtensions?: Record<string, string>
}

export interface CooperativeImportJobQueued {
  importJobId: number
  status: string
  originalFilename?: string | null
}

export interface CooperativeImportResult {
  imported: number
  duplicates?: number
  updated?: number
  failed: number
  errors: Array<{ row: number; message: string }>
}

export interface CooperativeImportJobStatus {
  id: number
  status: string
  type?: string
  originalFilename?: string | null
  result?: CooperativeImportResult | null
  summary?: { imported: number; duplicates: number; failed: number }
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
}

export interface CooperativeImportJobListItem extends CooperativeImportJobStatus {}

export type CooperativeImportRowStatus = 'success' | 'duplicate' | 'failed'

export interface CooperativeImportJobRow {
  id: number
  rowNumber: number
  status: CooperativeImportRowStatus
  maSoThue?: string | null
  tenHtx?: string | null
  hopTacXaId?: number | null
  message?: string | null
  createdAt?: string | null
}

export const COOPERATIVE_IMPORT_COLUMN_LABELS: Record<string, string> = {
  tt: 'STT',
  tenHtx: 'Tên HTX',
  maSoThue: 'Mã số Thuế',
  namThanhLap: 'Năm thành lập',
  chuTichHdqtTen: 'Họ tên CT HĐQT',
  dienThoai: 'Điện thoại',
  diaChi: 'Địa chỉ',
  phuongXa: 'Xã, Phường',
  dienTichHa: 'Diện tích (ha)',
  vonDieuLe: 'Vốn điều lệ',
  soThanhVien: 'Thành viên',
  soNguoiLaoDong: 'Người lao động',
  linhVuc: 'Lĩnh vực',
  hoatDong: 'Hoạt động',
  dsThanhVien: 'Thành viên (chi tiết)',
  diaChiMoi: 'Địa chỉ mới',
  ghiChu: 'Ghi chú',
}
