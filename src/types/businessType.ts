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
