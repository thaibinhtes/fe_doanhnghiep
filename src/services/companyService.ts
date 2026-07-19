import api from './api'
import type {
  Company,
  CompanyListResponse,
  CompanyFilters,
  CapitalMemberInput,
  CompanyImportResult,
  CompanyImportJobQueued,
  CompanyImportJobStatus,
  CompanyImportJobListItem,
  CompanyImportJobRow,
  CompanyImportRowStatus,
  CompanyImportConfig,
  CompanyIdentityImportConfig,
  CompanyFieldUpdateConfig,
  CompanyImportFormat,
  CompanyImportExampleConfig,
  CompanyIdentityBulkItem,
  CompanyBulkDeleteResult,
} from '@/types/company'

const BASE_PATH = '/doanh-nghiep'

interface LaravelPaginator<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  path: string
  links: CompanyListResponse['meta']['links']
}

function unwrapPaginator<T>(payload: LaravelPaginator<T>): {
  data: T[]
  meta: CompanyListResponse['meta']
} {
  return {
    data: payload.data,
    meta: {
      current_page: payload.current_page,
      last_page: payload.last_page,
      per_page: payload.per_page,
      total: payload.total,
      from: payload.from,
      to: payload.to,
      path: payload.path,
      links: payload.links,
    },
  }
}

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
        per_page: filters?.per_page ?? 50,
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.trangThai ? { trangThai: filters.trangThai } : {}),
        ...(filters?.dnTrangThaiId ? { dnTrangThaiId: filters.dnTrangThaiId } : {}),
        ...(filters?.loaiHinhDN ? { loaiHinhDN: filters.loaiHinhDN } : {}),
        ...(filters?.loaiHinhId ? { loaiHinhId: filters.loaiHinhId } : {}),
        ...(filters?.quanHuyen ? { quanHuyen: filters.quanHuyen } : {}),
        ...(filters?.phuongXa ? { phuongXa: filters.phuongXa } : {}),
        ...(filters?.daCapNhatDinhDanh !== undefined
          ? { daCapNhatDinhDanh: filters.daCapNhatDinhDanh }
          : {}),
        ...(filters?.hasCoordinates !== undefined
          ? { hasCoordinates: filters.hasCoordinates }
          : {}),
        ...(filters?.donViId ? { donViId: filters.donViId } : {}),
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

  async bulkDelete(ids: number[]): Promise<CompanyBulkDeleteResult> {
    const { data } = await api.delete<{ data: CompanyBulkDeleteResult; message: string }>(
      `${BASE_PATH}/bulk`,
      { data: { ids } },
    )
    return data.data
  },

  async previewClearByDonVi(donViId: number): Promise<{
    donViId: number
    donViMa?: string
    donViTen?: string
    scopeDonViCount: number
    count: number
  }> {
    const { data } = await api.get<{ data: { donViId: number; donViMa?: string; donViTen?: string; scopeDonViCount: number; count: number } }>(
      `${BASE_PATH}/clear-by-don-vi/preview`,
      { params: { donViId } },
    )
    return data.data
  },

  async clearByDonVi(donViId: number): Promise<{
    deleted: number
    donViId: number
    donViMa?: string
    donViTen?: string
    scopeDonViCount: number
  }> {
    const { data } = await api.delete<{
      data: { deleted: number; donViId: number; donViMa?: string; donViTen?: string; scopeDonViCount: number }
      message: string
    }>(`${BASE_PATH}/clear-by-don-vi`, { data: { donViId } })
    return data.data
  },

  async exportExcel(filters?: CompanyFilters): Promise<Blob> {
    const { data } = await api.get<Blob>(`${BASE_PATH}/export`, {
      params: {
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.trangThai ? { trangThai: filters.trangThai } : {}),
        ...(filters?.dnTrangThaiId ? { dnTrangThaiId: filters.dnTrangThaiId } : {}),
        ...(filters?.loaiHinhDN ? { loaiHinhDN: filters.loaiHinhDN } : {}),
        ...(filters?.loaiHinhId ? { loaiHinhId: filters.loaiHinhId } : {}),
        ...(filters?.quanHuyen ? { quanHuyen: filters.quanHuyen } : {}),
        ...(filters?.phuongXa ? { phuongXa: filters.phuongXa } : {}),
        ...(filters?.daCapNhatDinhDanh !== undefined
          ? { daCapNhatDinhDanh: filters.daCapNhatDinhDanh }
          : {}),
        ...(filters?.hasCoordinates !== undefined
          ? { hasCoordinates: filters.hasCoordinates }
          : {}),
        ...(filters?.donViId ? { donViId: filters.donViId } : {}),
      },
      responseType: 'blob',
    })
    return data
  },

  async exportTemplate(): Promise<Blob> {
    const { data } = await api.get<Blob>(`${BASE_PATH}/export-template`, {
      responseType: 'blob',
    })
    return data
  },

  async exportIdentityTemplate(): Promise<Blob> {
    const { data } = await api.get<Blob>(`${BASE_PATH}/export-template-dinh-danh`, {
      responseType: 'blob',
    })
    return data
  },

  async importExcel(
    file: File,
    config?: {
      startRow?: number
      columnMap?: Record<string, string[]>
      valueExtensions?: Record<string, string>
    },
  ): Promise<CompanyImportJobQueued> {
    const formData = new FormData()
    formData.append('file', file)

    if (config?.startRow !== undefined) {
      formData.append('startRow', String(config.startRow))
    }

    if (config?.columnMap) {
      formData.append('columnMap', JSON.stringify(config.columnMap))
    }

    if (config?.valueExtensions && Object.keys(config.valueExtensions).length > 0) {
      formData.append('valueExtensions', JSON.stringify(config.valueExtensions))
    }

    const { data } = await api.post<{ data: CompanyImportJobQueued; message: string }>(
      `${BASE_PATH}/import`,
      formData,
      {
        timeout: 600_000,
      },
    )
    return data.data
  },

  async getImportJobStatus(importJobId: number): Promise<CompanyImportJobStatus> {
    const { data } = await api.get<{ data: CompanyImportJobStatus }>(
      `${BASE_PATH}/import-jobs/${importJobId}`,
    )
    return data.data
  },

  async getImportJobs(page = 1, perPage = 15): Promise<{
    data: CompanyImportJobListItem[]
    meta: CompanyListResponse['meta']
  }> {
    const { data } = await api.get<{ data: LaravelPaginator<CompanyImportJobListItem> }>(
      `${BASE_PATH}/import-jobs`,
      {
        params: { page, per_page: perPage },
      },
    )
    return unwrapPaginator(data.data)
  },

  async getImportJobRows(
    importJobId: number,
    options?: { page?: number; perPage?: number; status?: CompanyImportRowStatus },
  ): Promise<{
    data: CompanyImportJobRow[]
    meta: CompanyListResponse['meta']
  }> {
    const { data } = await api.get<{ data: LaravelPaginator<CompanyImportJobRow> }>(
      `${BASE_PATH}/import-jobs/${importJobId}/rows`,
      {
        params: {
          page: options?.page ?? 1,
          per_page: options?.perPage ?? 50,
          status: options?.status,
        },
      },
    )
    return unwrapPaginator(data.data)
  },

  async getImportColumnMap(): Promise<CompanyImportConfig> {
    const { data } = await api.get<{ data: CompanyImportConfig }>(`${BASE_PATH}/import-column-map`)
    return data.data
  },

  async getImportConfigs(): Promise<CompanyImportExampleConfig[]> {
    const { data } = await api.get<{ data: CompanyImportExampleConfig[] }>(`${BASE_PATH}/import-configs`)
    return data.data
  },

  async getAdminImportConfigs(): Promise<CompanyImportExampleConfig[]> {
    const { data } = await api.get<{ data: CompanyImportExampleConfig[] }>(`${BASE_PATH}/import-configs/admin`)
    return data.data
  },

  async createImportConfig(payload: {
    name: string
    code: string
    description?: string | null
    startRow: number
    columnMap: Record<string, string[]>
    valueExtensions?: Record<string, string>
    isActive?: boolean
    sortOrder?: number
  }): Promise<CompanyImportExampleConfig> {
    const { data } = await api.post<{ data: CompanyImportExampleConfig }>(`${BASE_PATH}/import-configs`, payload)
    return data.data
  },

  async updateImportConfig(
    id: number,
    payload: {
      name: string
      code: string
      description?: string | null
      startRow: number
      columnMap: Record<string, string[]>
      valueExtensions?: Record<string, string>
      isActive?: boolean
      sortOrder?: number
    },
  ): Promise<CompanyImportExampleConfig> {
    const { data } = await api.put<{ data: CompanyImportExampleConfig }>(`${BASE_PATH}/import-configs/${id}`, payload)
    return data.data
  },

  async deleteImportConfig(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/import-configs/${id}`)
  },

  async getImportFormats(): Promise<CompanyImportFormat[]> {
    const { data } = await api.get<{ data: CompanyImportFormat[] }>(`${BASE_PATH}/import-formats`)
    return data.data
  },

  async saveImportFormat(payload: {
    name: string
    startRow: number
    columnMap: Record<string, string[]>
    valueExtensions?: Record<string, string>
  }): Promise<CompanyImportFormat> {
    const { data } = await api.post<{ data: CompanyImportFormat }>(`${BASE_PATH}/import-formats`, payload)
    return data.data
  },

  async deleteImportFormat(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/import-formats/${id}`)
  },

  async importIdentityExcel(
    file: File,
    config?: {
      startRow?: number
      columnMap?: Record<string, string[]>
      identityDate?: string
      daCapNhatDinhDanh?: boolean
    },
  ): Promise<CompanyImportJobQueued> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) {
      formData.append('startRow', String(config.startRow))
    }
    if (config?.columnMap) {
      formData.append('columnMap', JSON.stringify(config.columnMap))
    }
    if (config?.identityDate) {
      formData.append('identityDate', config.identityDate)
    }
    if (config?.daCapNhatDinhDanh !== undefined) {
      formData.append('daCapNhatDinhDanh', config.daCapNhatDinhDanh ? '1' : '0')
    }

    const { data } = await api.post<{ data: CompanyImportJobQueued; message: string }>(
      `${BASE_PATH}/import-dinh-danh`,
      formData,
      {
        timeout: 600_000,
      },
    )
    return data.data
  },

  async getIdentityImportColumnMap(): Promise<CompanyIdentityImportConfig> {
    const { data } = await api.get<{ data: CompanyIdentityImportConfig }>(
      `${BASE_PATH}/import-dinh-danh-column-map`,
    )
    return data.data
  },

  async getFieldUpdateColumnMap(): Promise<CompanyFieldUpdateConfig> {
    const { data } = await api.get<{ data: CompanyFieldUpdateConfig }>(
      `${BASE_PATH}/import-field-update-column-map`,
    )
    return data.data
  },

  async importFieldUpdatesExcel(
    file: File,
    config: {
      startRow?: number
      lookupField: string
      columnMap: Record<string, string[]>
    },
  ): Promise<CompanyImportJobQueued> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('lookupField', config.lookupField)
    if (config.startRow !== undefined) {
      formData.append('startRow', String(config.startRow))
    }
    formData.append('columnMap', JSON.stringify(config.columnMap))

    const { data } = await api.post<{ data: CompanyImportJobQueued; message: string }>(
      `${BASE_PATH}/import-field-updates`,
      formData,
      {
        timeout: 600_000,
      },
    )
    return data.data
  },

  async bulkUpdateDinhDanh(items: CompanyIdentityBulkItem[]): Promise<CompanyImportResult> {
    const { data } = await api.patch<{ data: CompanyImportResult; message: string }>(
      `${BASE_PATH}/dinh-danh/bulk`,
      { items },
    )
    return data.data
  },
}
