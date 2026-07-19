import api from './api'
import type {
  CompanyBusinessType,
  CompanyBusinessTypePayload,
  CompanyBusinessTypeSyncResult,
} from '@/types/businessType'

const BASE_PATH = '/dn-loai-hinh'

export const businessTypeService = {
  async getAll(params?: { isActive?: boolean }): Promise<CompanyBusinessType[]> {
    const { data } = await api.get<{ data: CompanyBusinessType[] }>(BASE_PATH, { params })
    return data.data
  },

  async getById(id: number): Promise<CompanyBusinessType> {
    const { data } = await api.get<{ data: CompanyBusinessType }>(`${BASE_PATH}/${id}`)
    return data.data
  },

  async create(payload: CompanyBusinessTypePayload): Promise<CompanyBusinessType> {
    const { data } = await api.post<{ data: CompanyBusinessType; message: string }>(BASE_PATH, payload)
    return data.data
  },

  async update(id: number, payload: Partial<CompanyBusinessTypePayload>): Promise<CompanyBusinessType> {
    const { data } = await api.put<{ data: CompanyBusinessType; message: string }>(`${BASE_PATH}/${id}`, payload)
    return data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },

  async syncFromCompanies(dryRun = false): Promise<CompanyBusinessTypeSyncResult> {
    const { data } = await api.post<{ data: CompanyBusinessTypeSyncResult }>(
      `${BASE_PATH}/sync-doanh-nghiep`,
      { dryRun },
    )
    return data.data
  },
}
