export interface IndustryCategory {
  id: number
  parentId: number | null
  cap: number
  ma: string
  ten: string
  thuTu: number
  isActive: boolean
  childrenCount?: number
  parent?: Pick<IndustryCategory, 'id' | 'cap' | 'ma' | 'ten'> | null
  children?: IndustryCategory[]
  createdAt?: string
  updatedAt?: string
}

export interface IndustryCategoryPayload {
  parentId?: number | null
  cap: number
  ma: string
  ten: string
  thuTu?: number
  isActive?: boolean
}

export interface IndustryCategoryListResponse {
  data: IndustryCategory[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}

export const CAP_LABELS: Record<number, string> = {
  1: 'Cấp 1',
  2: 'Cấp 2',
  3: 'Cấp 3',
  4: 'Cấp 4',
  5: 'Cấp 5',
}

export interface IndustryCategoryImportResult {
  imported: number
  updated: number
  failed: number
  errors: Array<{ row: number; message: string }>
}
