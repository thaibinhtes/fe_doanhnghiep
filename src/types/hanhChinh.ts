export interface LegacyProvinceItem {
  code: string
  fullName: string
}

export interface LegacyDistrictItem {
  code: string
  fullName: string
  tinhThanhCuCode?: string | null
}

export interface LegacyWardItem {
  code: string
  fullName: string
  unitType?: string | null
  quanHuyenCuCode: string
  quanHuyenCu?: LegacyDistrictItem
  mappings?: HanhChinhMappingItem[]
  /** @deprecated Dùng mappings — giữ tương thích API cũ */
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
    quanHuyen?: LegacyDistrictItem
  }
  xaPhuongMoi?: {
    code: string
    fullName: string
    unitType?: string | null
    tinhThanhCode: string
    tinhThanh?: LegacyProvinceItem
  }
}

export interface HanhChinhMappingGroupLegacyUnit {
  mappingId: number
  code: string
  fullName?: string
  unitType?: string | null
  quanHuyen?: {
    code: string
    fullName: string
  } | null
}

export interface HanhChinhMappingGroup {
  groupNo?: number | null
  xaPhuongMoiCode: string
  newUnitType?: string | null
  xaPhuongMoi?: {
    code: string
    fullName: string
    unitType?: string | null
    tinhThanhCode?: string
    tinhThanh?: LegacyProvinceItem | null
  } | null
  legacyUnits: HanhChinhMappingGroupLegacyUnit[]
}

export interface LinkMappingPayload {
  groupNo?: number
  xaPhuongMoiCode: string
  newUnitType?: string
  notes?: string
  xaPhuongCuCodes: string[]
  syncScopeCuCodes?: string[]
}

export interface LinkMappingResult {
  created: number
  updated: number
  deleted?: number
}

export interface NewWardItem {
  code: string
  fullName: string
  unitType?: string | null
  tinhThanhCode?: string
}

export interface NewImportRow {
  xaPhuongMoi: string
  loaiMoi?: string
}

export interface HanhChinhNewImportConfig {
  startRow: number
  columnMap: HanhChinhImportColumnMap
  columnLabels: Record<string, string>
  standaloneColumnMap?: HanhChinhImportColumnMap
  mappingColumnMap?: HanhChinhImportColumnMap
  standaloneStartRow?: number
  mappingStartRow?: number
  valueExtensions?: Record<string, string>
  defaultConfigCode?: string
  standaloneConfigCode?: string
}

export interface LegacyImportRow {
  groupNo?: number
  quanHuyenCu: string
  xaPhuongCu: string
  loaiCu?: string
  xaPhuongMoi?: string
  loaiMoi?: string
  tinhThanhMoiCode?: string
  notes?: string
}

export type HanhChinhImportColumnMap = Record<string, string[]>

export interface HanhChinhImportConfig {
  startRow: number
  columnMap: HanhChinhImportColumnMap
  columnLabels: Record<string, string>
  legacyOnlyColumnMap?: HanhChinhImportColumnMap
  legacyOnlyColumnLabels?: Record<string, string>
  legacyOnlyStartRow?: number
  valueExtensions?: Record<string, string>
  defaultConfigCode?: string
  legacyOnlyConfigCode?: string
}

export interface HanhChinhImportExampleConfig {
  id: number
  name: string
  code: string
  description?: string | null
  startRow: number
  columnMap: HanhChinhImportColumnMap
  valueExtensions?: Record<string, string>
  sortOrder?: number
}

export interface HanhChinhImportFormat {
  id: number
  name: string
  startRow: number
  columnMap: HanhChinhImportColumnMap
  valueExtensions?: Record<string, string>
  createdAt?: string
  updatedAt?: string
}

export interface ImportCounts {
  provinces?: number
  districts?: number
  districtsUpdated?: number
  wards?: number
  wardsUpdated?: number
  mappings?: number
  mappingsUpdated?: number
  skipped?: number
  rows?: number
}

export interface SyncResult {
  matched: number
  updated: number
  skipped: number
  alreadyLinked?: number
  unmapped: Array<{
    id: number
    maSoDoanhNghiep?: string
    quanHuyen?: string
    phuongXa?: string
    xaPhuongCuCode?: string
    reason: string
  }>
}

export type CompanyAdministrativeField =
  | 'tinhThanhCu'
  | 'tinhThanhMoi'
  | 'quanHuyenCu'
  | 'quanHuyenMoi'
  | 'phuongXaCu'
  | 'phuongXaMoi'

export interface CompanyFieldSyncOption {
  key: CompanyAdministrativeField
  label: string
  catalog: string
  loai: 'cu' | 'moi'
}

export interface CompanyFieldSyncResult {
  field: string
  label: string
  catalog: string
  loai: 'cu' | 'moi'
  scanned: number
  matched: number
  created: number
  updated: number
  skipped: number
  alreadyLinked: number
  unmapped: Array<Record<string, unknown>>
}

export interface CompanyRawGroupItem {
  ten: string
  count: number
  existsInCatalog: boolean
  existingId: number | null
}

export interface CompanyRawGroupsPreview {
  field: CompanyAdministrativeField
  label: string
  catalog: string
  loai: 'cu' | 'moi'
  totalGroups: number
  newGroups: number
  existingGroups: number
  totalCompanies: number
  groups: CompanyRawGroupItem[]
}

export interface CompanyRawGroupsCommitResult {
  field: string
  label: string
  catalog: string
  loai: 'cu' | 'moi'
  created: number
  skippedExisting: number
  createdTinh: number
  createdQuanHuyen: number
  createdPhuongXa: number
  link: CompanyFieldSyncResult | null
}

export interface CompanyAdministrativeCatalogSyncResult {
  scanned: number
  alreadySynced: number
  updatedCompanies: number
  createdTinh: number
  createdQuanHuyen: number
  createdPhuongXa: number
}

export type HanhChinhDanhMucCap = 'tinh' | 'quan-huyen' | 'phuong-xa'

export type HanhChinhDanhMucLoai = 'cu' | 'moi'

export interface HanhChinhDanhMucItem {
  id: number
  ten: string
  loai: HanhChinhDanhMucLoai
  ma: string | null
  tinh: { id: number; ten: string } | null
  quanHuyen: { id: number; ten: string } | null
}

export interface NewDataClearPreview {
  wards: number
  mappings: number
  companiesLinked: number
}

export interface NewDataClearResult {
  wards: number
  mappings: number
  companiesReset: number
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
