import api from './api'
import type { CompanyStatus, CompanyStatusPayload } from '@/types/status'

const BASE_PATH = '/dn-trang-thai'

export const statusService = {
  async getAll(params?: { loai?: string; isActive?: boolean; hienThiBaoCao?: boolean }): Promise<CompanyStatus[]> {
    const { data } = await api.get<{ data: CompanyStatus[] }>(BASE_PATH, { params })
    return data.data
  },

  async getById(id: number): Promise<CompanyStatus> {
    const { data } = await api.get<{ data: CompanyStatus }>(`${BASE_PATH}/${id}`)
    return data.data
  },

  async create(payload: CompanyStatusPayload): Promise<CompanyStatus> {
    const { data } = await api.post<{ data: CompanyStatus; message: string }>(BASE_PATH, payload)
    return data.data
  },

  async update(id: number, payload: Partial<CompanyStatusPayload>): Promise<CompanyStatus> {
    const { data } = await api.put<{ data: CompanyStatus; message: string }>(`${BASE_PATH}/${id}`, payload)
    return data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },
}
