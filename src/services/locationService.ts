import api from './api'
import type { ProvinceItem, WardItem } from '@/types/location'

function unwrapCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T[] }).data
  }
  return []
}

export const locationService = {
  async getProvinces(search = ''): Promise<ProvinceItem[]> {
    const { data } = await api.get<{ data: unknown }>('/tinh-thanh', {
      params: search ? { search } : undefined,
    })
    return unwrapCollection<ProvinceItem>(data.data)
  },

  async getWardsByProvince(provinceCode: string, search = ''): Promise<WardItem[]> {
    const { data } = await api.get<{ data: unknown }>(`/tinh-thanh/${provinceCode}/xa-phuong`, {
      params: search ? { search } : undefined,
    })
    return unwrapCollection<WardItem>(data.data)
  },
}
