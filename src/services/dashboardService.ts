import api from './api'
import type {
  DashboardAreaIdentity,
  DashboardAreaKey,
  DashboardData,
  DashboardIdentityMonthlyStats,
} from '@/types/dashboard'

export interface DashboardAreaResponse {
  areaKey: DashboardAreaKey
  areas: DashboardAreaIdentity[]
  generatedAt: string
}

export const dashboardService = {
  /** Overview nhanh — không gồm breakdown địa bàn. */
  async getOverview(): Promise<DashboardData> {
    const { data } = await api.get<{ data: DashboardData }>('/dashboard')
    return data.data
  },

  /** @deprecated dùng getOverview() */
  async getDashboard(): Promise<DashboardData> {
    return this.getOverview()
  },

  async getCompanyAreas(areaKey: DashboardAreaKey): Promise<DashboardAreaResponse> {
    const { data } = await api.get<{ data: DashboardAreaResponse }>('/dashboard/company-areas', {
      params: { areaKey },
    })
    return data.data
  },

  async getCooperativeAreas(areaKey: DashboardAreaKey): Promise<DashboardAreaResponse> {
    const { data } = await api.get<{ data: DashboardAreaResponse }>('/dashboard/cooperative-areas', {
      params: { areaKey },
    })
    return data.data
  },

  async getIdentityMonthlyByDay(month?: string): Promise<DashboardIdentityMonthlyStats> {
    const { data } = await api.get<{ data: DashboardIdentityMonthlyStats }>('/dashboard/dinh-danh-theo-ngay', {
      params: month ? { month } : undefined,
    })
    return data.data
  },
}
