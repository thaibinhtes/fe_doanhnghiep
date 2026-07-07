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

export interface TaxCompanyPaymentHistoryItem {
  id: number
  taxCode: string | null
  taxPaidAt?: string | null
  source?: string
  taxUnit?: TaxUnit | null
  importedBy?: {
    id: number
    name: string
  } | null
  createdAt?: string
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

export interface TaxImportJobHistoryItem {
  id: number
  type: 'tax_units' | 'company_tax' | string
  status: 'pending' | 'processing' | 'completed' | 'failed' | string
  originalFilename?: string | null
  result?: Record<string, unknown> | null
  summary: {
    imported: number
    duplicates: number
    failed: number
  }
  errorMessage?: string | null
  createdAt?: string | null
  startedAt?: string | null
  finishedAt?: string | null
}
