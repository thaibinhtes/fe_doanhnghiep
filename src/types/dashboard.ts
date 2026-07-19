import type { ProgressReportMetrics, ProgressReportRange } from '@/types/report'
import type { SummaryReport } from '@/types/status'

export interface DashboardOverview {
  totalCompanies: number
  identified: number
  notIdentified: number
  canRaSoat: number
  withCoordinates: number
}

export interface DashboardIdentity {
  daDinhDanh: number
  canRaSoat: number
  chuaDinhDanh: number
}

export interface DashboardAreaIdentity extends DashboardIdentity {
  donViId: number | null
  donViTen: string
  total: number
}

export interface DashboardIdentityMonthlyDay {
  date: string
  label: string
  daDinhDanh: number
  chuaDinhDanh: number
}

export interface DashboardIdentityMonthlyStats {
  month: string
  monthLabel: string
  from: string
  to: string
  totals: {
    daDinhDanh: number
    chuaDinhDanh: number
  }
  days: DashboardIdentityMonthlyDay[]
  generatedAt: string
}

export interface DashboardProgressTotalRow {
  stt: number | null
  key: string
  label: string
  periods: Record<string, ProgressReportMetrics>
  ghiChu: string | null
  isTotal?: boolean
}

export interface DashboardData {
  generatedAt: string
  overview: DashboardOverview
  identity: DashboardIdentity
  cooperativeOverview?: {
    totalCooperatives: number
  }
  cooperativeIdentity?: DashboardIdentity
  companyAreas?: DashboardAreaIdentity[]
  cooperativeAreas?: DashboardAreaIdentity[]
  summary: SummaryReport
  cooperativeSummary?: SummaryReport
  progress: {
    title: string
    reportDateLabel: string
    ranges: ProgressReportRange[]
    metricLabels: Record<keyof ProgressReportMetrics, string>
    totalRow: DashboardProgressTotalRow | null
  }
}
