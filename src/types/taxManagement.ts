export interface TaxUnit {
  id: number
  unitCode: string
  unitName: string
  createdAt?: string
  updatedAt?: string
}

export interface TaxCompanyItem {
  id: number
  taxCode: string | null
  companyName: string
  taxUnitId?: number | null
  taxUnit?: TaxUnit | null
  taxPaidAt?: string | null
  importedBy?: {
    id: number
    name: string
  } | null
}

export interface TaxCooperativeItem {
  id: number
  taxCode: string | null
  cooperativeName: string
  taxUnitId?: number | null
  taxUnit?: TaxUnit | null
}

export interface TaxPaginatedResponse<T> {
  data: T[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}

export type TaxImportColumnMap = Record<string, string[]>

export interface TaxImportConfig {
  startRow: number
  columnMap: TaxImportColumnMap
  columnLabels: Record<string, string>
  valueExtensions?: Record<string, string>
}

export interface TaxImportResult {
  created: number
  updated: number
  skipped?: number
  rows: number
}

export interface TaxImportDispatchResult {
  importJobId: number
  status: string
  originalFilename?: string
  entity?: string
}
