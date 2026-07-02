import api from './api'
import type { ProgressReport, ProgressReportFilters } from '@/types/report'
import type { SummaryReport } from '@/types/status'

export type ProgressReportQuery = ProgressReportFilters & {
  reportDate?: string
}

export const reportService = {
  async getSummary(): Promise<SummaryReport> {
    const { data } = await api.get<{ data: SummaryReport }>('/reports/tong-hop')
    return data.data
  },

  async exportSummary(): Promise<Blob> {
    const { data } = await api.get<Blob>('/reports/tong-hop/export', {
      responseType: 'blob',
    })
    return data
  },

  async getProgress(params?: ProgressReportQuery): Promise<ProgressReport> {
    const { data } = await api.get<{ data: ProgressReport }>('/reports/tien-do-dinh-danh', {
      params,
    })
    return data.data
  },

  async exportProgress(params?: ProgressReportQuery): Promise<Blob> {
    const { data } = await api.get<Blob>('/reports/tien-do-dinh-danh/export', {
      params,
      responseType: 'blob',
    })
    return data
  },
}
