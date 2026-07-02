import api from './api'
import type { ProgressReport } from '@/types/report'
import type { SummaryReport } from '@/types/status'

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

  async getProgress(): Promise<ProgressReport> {
    const { data } = await api.get<{ data: ProgressReport }>('/reports/tien-do-dinh-danh')
    return data.data
  },

  async exportProgress(): Promise<Blob> {
    const { data } = await api.get<Blob>('/reports/tien-do-dinh-danh/export', {
      responseType: 'blob',
    })
    return data
  },
}
