export interface LegacyProvinceItem {
  code: string
  fullName: string
}

export interface LegacyDistrictItem {
  code: string
  fullName: string
  tinhThanhCuCode: string
}

export interface LegacyWardItem {
  code: string
  fullName: string
  unitType?: string | null
  quanHuyenCuCode: string
  mapping?: HanhChinhMappingItem | null
}

export interface HanhChinhMappingItem {
  id: number
  groupNo?: number | null
  xaPhuongCuCode: string
  xaPhuongMoiCode: string
  newUnitType?: string | null
  notes?: string | null
  xaPhuongCu?: LegacyWardItem & {
    quanHuyen?: LegacyDistrictItem & { tinhThanh?: LegacyProvinceItem }
  }
  xaPhuongMoi?: {
    code: string
    fullName: string
    tinhThanhCode: string
    tinhThanh?: LegacyProvinceItem
  }
}

export interface LegacyImportRow {
  groupNo?: number
  tinhThanhCu: string
  quanHuyenCu: string
  xaPhuongCu: string
  loaiCu?: string
  xaPhuongMoi: string
  loaiMoi?: string
  tinhThanhMoiCode?: string
  notes?: string
}

export interface ImportCounts {
  provinces?: number
  districts?: number
  wards?: number
  mappings?: number
}

export interface SyncResult {
  matched: number
  updated: number
  skipped: number
  unmapped: Array<{
    id: number
    maSoDoanhNghiep?: string
    quanHuyen?: string
    phuongXa?: string
    xaPhuongCuCode?: string
    reason: string
  }>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}
