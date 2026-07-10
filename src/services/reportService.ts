import api from './api'
import type { ProgressReport, ProgressReportFilters } from '@/types/report'
import type { SummaryReport } from '@/types/status'
import type { IdentityHistoryFilters, IdentityHistoryListResponse } from '@/types/identityHistory'

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

  async getIdentityHistory(filters?: IdentityHistoryFilters): Promise<IdentityHistoryListResponse> {
    const { data } = await api.get<{
      data: IdentityHistoryListResponse['data']
      meta: IdentityHistoryListResponse['meta']
    }>('/reports/dinh-danh-lich-su', {
      params: filters,
    })

    return {
      data: data.data ?? [],
      meta: data.meta ?? { current_page: 1, last_page: 1, per_page: 20, total: 0 },
    }
  },
}
