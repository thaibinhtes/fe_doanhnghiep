export interface CompanyBusinessType {
  id: number
  ma: string
  ten: string
  thuTu: number
  macDinh: boolean
  isActive: boolean
  moTa: string | null
  companiesCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CompanyBusinessTypePayload {
  ma: string
  ten: string
  thuTu?: number
  macDinh?: boolean
  isActive?: boolean
  moTa?: string | null
}

export interface CompanyBusinessTypeSyncResult {
  scanned: number
  matched: number
  createdTypes: number
  updatedCompanies: number
  skipped: number
}
