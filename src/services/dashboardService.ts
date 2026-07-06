import api from './api'
import type { DashboardData, DashboardIdentityMonthlyStats } from '@/types/dashboard'

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get<{ data: DashboardData }>('/dashboard')
    return data.data
  },

  async getIdentityMonthlyByDay(month?: string): Promise<DashboardIdentityMonthlyStats> {
    const { data } = await api.get<{ data: DashboardIdentityMonthlyStats }>('/dashboard/dinh-danh-theo-ngay', {
      params: month ? { month } : undefined,
    })
    return data.data
  },
}
