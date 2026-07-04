import api from './api'
import type { DashboardData } from '@/types/dashboard'

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get<{ data: DashboardData }>('/dashboard')
    return data.data
  },
}
