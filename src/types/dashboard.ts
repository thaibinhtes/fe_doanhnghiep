import type { ProgressReportMetrics, ProgressReportRange } from '@/types/report'
import type { SummaryReport } from '@/types/status'

export interface DashboardOverview {
  totalCompanies: number
  identified: number
  notIdentified: number
  withCoordinates: number
}

export interface DashboardIdentity {
  daDinhDanh: number
  chuaDinhDanh: number
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
  summary: SummaryReport
  progress: {
    title: string
    reportDateLabel: string
    ranges: ProgressReportRange[]
    metricLabels: Record<keyof ProgressReportMetrics, string>
    totalRow: DashboardProgressTotalRow | null
  }
}
