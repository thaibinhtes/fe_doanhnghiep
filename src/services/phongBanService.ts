import api from './api'
import type { PhongBanOption } from '@/types/user'

export const phongBanService = {
  async getOptions(params: { search?: string; limit?: number } = {}): Promise<PhongBanOption[]> {
    const { data } = await api.get<{ data: PhongBanOption[] }>('/phong-bans/options', { params })
    return data.data ?? []
  },
}
