import api from './api'
import type { Company, CompanyListResponse, CompanyFilters } from '@/types/company'

const BASE_PATH = '/doanh-nghiep'

export const companyService = {
  async getAll(filters?: CompanyFilters): Promise<CompanyListResponse> {
    const { data } = await api.get<CompanyListResponse>(BASE_PATH, {
      params: {
        page: filters?.page ?? 1,
        per_page: filters?.per_page ?? 15,
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.trangThai ? { trangThai: filters.trangThai } : {}),
        ...(filters?.loaiHinhDN ? { loaiHinhDN: filters.loaiHinhDN } : {}),
      },
    })
    return data
  },

  async getById(id: number): Promise<Company> {
    const { data } = await api.get<{ data: Company }>(`${BASE_PATH}/${id}`)
    return data.data
  },

  async create(payload: Partial<Company>): Promise<Company> {
    const { data } = await api.post<{ data: Company }>(BASE_PATH, payload)
    return data.data
  },

  async update(id: number, payload: Partial<Company>): Promise<Company> {
    const { data } = await api.put<{ data: Company }>(`${BASE_PATH}/${id}`, payload)
    return data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },
}
