import api from './api'
import type {
  Cooperative,
  CooperativeListResponse,
  CooperativeFilters,
  CooperativeImportResult,
  CooperativeImportJobQueued,
  CooperativeImportJobStatus,
  CooperativeImportJobListItem,
  CooperativeImportJobRow,
  CooperativeImportRowStatus,
  CooperativeImportConfig,
  CooperativeImportFormat,
  CooperativeImportExampleConfig,
  CooperativeImportColumnMap,
} from '@/types/cooperative'

const BASE_PATH = '/hop-tac-xa'

interface LaravelPaginator<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  path: string
  links: CooperativeListResponse['meta']['links']
}

function unwrapPaginator<T>(payload: LaravelPaginator<T>): {
  data: T[]
  meta: CooperativeListResponse['meta']
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

export const cooperativeService = {
  async getAll(filters?: CooperativeFilters): Promise<CooperativeListResponse> {
    const { data } = await api.get<CooperativeListResponse>(BASE_PATH, {
      params: {
        page: filters?.page ?? 1,
        per_page: filters?.per_page ?? 50,
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.phuongXa ? { phuongXa: filters.phuongXa } : {}),
        ...(filters?.linhVuc ? { linhVuc: filters.linhVuc } : {}),
        ...(filters?.hoatDong ? { hoatDong: filters.hoatDong } : {}),
        ...(filters?.donViId ? { donViId: filters.donViId } : {}),
      },
    })
    return data
  },

  async getById(id: number): Promise<Cooperative> {
    const { data } = await api.get<{ data: Cooperative }>(`${BASE_PATH}/${id}`)
    return data.data
  },

  async create(payload: Partial<Cooperative>): Promise<Cooperative> {
    const { data } = await api.post<{ data: Cooperative }>(BASE_PATH, payload)
    return data.data
  },

  async update(id: number, payload: Partial<Cooperative>): Promise<Cooperative> {
    const { data } = await api.put<{ data: Cooperative }>(`${BASE_PATH}/${id}`, payload)
    return data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },

  async bulkDelete(ids: number[]): Promise<{ deleted: number; errors: Array<{ id: number; message: string }> }> {
    const { data } = await api.delete<{ data: { deleted: number; errors: Array<{ id: number; message: string }> } }>(
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

  async exportExcel(filters?: CooperativeFilters): Promise<Blob> {
    const { data } = await api.get<Blob>(`${BASE_PATH}/export`, {
      params: {
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.phuongXa ? { phuongXa: filters.phuongXa } : {}),
        ...(filters?.linhVuc ? { linhVuc: filters.linhVuc } : {}),
        ...(filters?.hoatDong ? { hoatDong: filters.hoatDong } : {}),
        ...(filters?.donViId ? { donViId: filters.donViId } : {}),
      },
      responseType: 'blob',
    })
    return data
  },

  async exportTemplate(): Promise<Blob> {
    const { data } = await api.get<Blob>(`${BASE_PATH}/export-template`, { responseType: 'blob' })
    return data
  },

  async importExcel(
    file: File,
    config?: { startRow?: number; columnMap?: CooperativeImportColumnMap },
  ): Promise<CooperativeImportJobQueued> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) formData.append('startRow', String(config.startRow))
    if (config?.columnMap) formData.append('columnMap', JSON.stringify(config.columnMap))

    const { data } = await api.post<{ data: CooperativeImportJobQueued; message: string }>(
      `${BASE_PATH}/import`,
      formData,
      { timeout: 600_000 },
    )
    return data.data
  },

  async getImportJobStatus(importJobId: number): Promise<CooperativeImportJobStatus> {
    const { data } = await api.get<{ data: CooperativeImportJobStatus }>(`${BASE_PATH}/import-jobs/${importJobId}`)
    return data.data
  },

  async getImportJobs(page = 1, perPage = 15) {
    const { data } = await api.get<{ data: LaravelPaginator<CooperativeImportJobListItem> }>(
      `${BASE_PATH}/import-jobs`,
      { params: { page, per_page: perPage } },
    )
    return unwrapPaginator(data.data)
  },

  async getImportJobRows(
    importJobId: number,
    options?: { page?: number; perPage?: number; status?: CooperativeImportRowStatus },
  ) {
    const { data } = await api.get<{ data: LaravelPaginator<CooperativeImportJobRow> }>(
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

  async getImportColumnMap(): Promise<CooperativeImportConfig> {
    const { data } = await api.get<{ data: CooperativeImportConfig }>(`${BASE_PATH}/import-column-map`)
    return data.data
  },

  async getImportConfigs(): Promise<CooperativeImportExampleConfig[]> {
    const { data } = await api.get<{ data: CooperativeImportExampleConfig[] }>(`${BASE_PATH}/import-configs`)
    return data.data
  },

  async getImportFormats(): Promise<CooperativeImportFormat[]> {
    const { data } = await api.get<{ data: CooperativeImportFormat[] }>(`${BASE_PATH}/import-formats`)
    return data.data
  },

  async saveImportFormat(payload: {
    name: string
    startRow: number
    columnMap: CooperativeImportColumnMap
    valueExtensions?: Record<string, string>
  }): Promise<CooperativeImportFormat> {
    const { data } = await api.post<{ data: CooperativeImportFormat }>(`${BASE_PATH}/import-formats`, payload)
    return data.data
  },

  async deleteImportFormat(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/import-formats/${id}`)
  },
}
