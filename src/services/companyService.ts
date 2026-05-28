import api from './api'
import type { Company, CompanyListResponse, CompanyFilters, CapitalMemberInput } from '@/types/company'

const BASE_PATH = '/doanh-nghiep'

function normalizeCapitalMembers(company: Company): CapitalMemberInput[] {
  const raw = company.dsThanhVienGopVon ?? company.danhSachThanhVienGopVon ?? []
  return raw.map((m) => ({
    fullName: m.fullName ?? '',
    position: m.position ?? null,
    investmentAmount: m.investmentAmount ?? null,
    dateJoin: m.dateJoin ?? null,
    memberId: m.memberId ?? null,
  }))
}

function normalizeCompany(company: Company): Company {
  return {
    ...company,
    dsThanhVienGopVon: normalizeCapitalMembers(company),
  }
}

function toApiPayload(payload: Partial<Company>): Record<string, unknown> {
  const {
    nguoiDaiDien,
    chuSoHuu,
    dsThanhVienGopVon,
    danhSachThanhVienGopVon,
    ...rest
  } = payload

  const members = dsThanhVienGopVon ?? danhSachThanhVienGopVon ?? []

  return {
    ...rest,
    danhSachThanhVienGopVon: members
      .filter((m) => (m.fullName ?? '').trim() !== '')
      .map((m) => ({
        fullName: m.fullName.trim(),
        position: m.position ?? null,
        investmentAmount: m.investmentAmount ?? null,
        dateJoin: m.dateJoin ?? null,
        memberId: m.memberId ?? null,
      })),
  }
}

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
    return {
      ...data,
      data: data.data.map(normalizeCompany),
    }
  },

  async getById(id: number): Promise<Company> {
    const { data } = await api.get<{ data: Company }>(`${BASE_PATH}/${id}`)
    return normalizeCompany(data.data)
  },

  async create(payload: Partial<Company>): Promise<Company> {
    const { data } = await api.post<{ data: Company }>(BASE_PATH, toApiPayload(payload))
    return normalizeCompany(data.data)
  },

  async update(id: number, payload: Partial<Company>): Promise<Company> {
    const { data } = await api.put<{ data: Company }>(`${BASE_PATH}/${id}`, toApiPayload(payload))
    return normalizeCompany(data.data)
  },

  async updateDinhDanhStatus(id: number, daCapNhatDinhDanh: boolean): Promise<Company> {
    const { data } = await api.patch<{ data: Company }>(`${BASE_PATH}/${id}/dinh-danh`, {
      daCapNhatDinhDanh,
    })
    return normalizeCompany(data.data)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },
}
