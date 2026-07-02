import api from './api'
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
}
