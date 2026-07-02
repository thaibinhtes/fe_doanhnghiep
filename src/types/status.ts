export type StatusLoai = 'dinh_danh' | 'hoat_dong' | 'bao_cao'

export interface CompanyStatus {
  id: number
  ma: string
  ten: string
  loai: StatusLoai
  yeuCauLyDo: boolean
  hienThiBaoCao: boolean
  thuTuBaoCao: number | null
  macDinh: boolean
  isActive: boolean
  moTa: string | null
  companiesCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CompanyStatusPayload {
  ma: string
  ten: string
  loai: StatusLoai
  yeuCauLyDo?: boolean
  hienThiBaoCao?: boolean
  thuTuBaoCao?: number | null
  macDinh?: boolean
  isActive?: boolean
  moTa?: string | null
}

export interface ReportColumn {
  ma: string
  ten: string
  count: number
}

export interface SummaryReport {
  stt: number
  columns: ReportColumn[]
  generatedAt: string
}
