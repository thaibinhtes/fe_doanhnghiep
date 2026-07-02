export interface ProgressReportMetrics {
  soLuongCapGcn: number
  donViGiaiThe: number
  canDinhDanh: number
  daDinhDanh: number
  chuaDinhDanh: number
}

export interface ProgressReportRange {
  key: string
  label: string
  from: string | null
  to: string
}

export interface ProgressReportRow {
  stt: number | null
  key: string
  label: string
  periods: Record<string, ProgressReportMetrics>
  ghiChu: string | null
  isTotal?: boolean
}

export interface ProgressReport {
  title: string
  reportDate: string
  reportDateLabel: string
  ranges: ProgressReportRange[]
  metricLabels: Record<keyof ProgressReportMetrics, string>
  rows: ProgressReportRow[]
  generatedAt: string
}
