import api from './api'
import type {
  IndustryCategory,
  IndustryCategoryImportResult,
  IndustryCategoryListResponse,
  IndustryCategoryPayload,
} from '@/types/industryCategory'

const BASE_PATH = '/danh-muc-nganh'

function unwrapSuccess<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data
  }
  return payload as T
}

function normalizeListResponse(payload: unknown): IndustryCategoryListResponse {
  const body = unwrapSuccess<unknown>(payload)

  if (Array.isArray(body)) {
    return {
      data: body,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: body.length,
        total: body.length,
      },
    }
  }

  if (body && typeof body === 'object' && 'data' in body && Array.isArray((body as IndustryCategoryListResponse).data)) {
    return body as IndustryCategoryListResponse
  }

  return { data: [] }
}

function normalizeCollection(payload: unknown): IndustryCategory[] {
  const body = unwrapSuccess<unknown>(payload)
  if (Array.isArray(body)) return body
  if (body && typeof body === 'object' && 'data' in body && Array.isArray((body as { data: IndustryCategory[] }).data)) {
    return (body as { data: IndustryCategory[] }).data
  }
  return []
}

export const industryCategoryService = {
  async getList(params: {
    parentId?: number | null | 'root'
    cap?: number
    isActive?: boolean
    search?: string
    mas?: string[]
    page?: number
    perPage?: number
  } = {}): Promise<IndustryCategoryListResponse> {
    const query: Record<string, unknown> = {
      page: params.page,
      perPage: params.perPage,
      cap: params.cap,
      search: params.search,
    }

    if (params.isActive !== undefined) {
      query.isActive = params.isActive
    }

    if (params.mas?.length) {
      query.mas = params.mas.join(',')
    }

    if (params.parentId === 'root') {
      query.parentId = 'null'
    } else if (params.parentId !== undefined && params.parentId !== null) {
      query.parentId = params.parentId
    }

    const { data } = await api.get(BASE_PATH, { params: query })
    return normalizeListResponse(data)
  },

  async getAll(params: {
    parentId?: number | null | 'root'
    cap?: number
    isActive?: boolean
    search?: string
  } = {}): Promise<IndustryCategory[]> {
    const query: Record<string, unknown> = {
      all: true,
      cap: params.cap,
      search: params.search,
    }

    if (params.isActive !== undefined) {
      query.isActive = params.isActive
    }

    if (params.parentId === 'root') {
      query.parentId = 'null'
    } else if (params.parentId !== undefined && params.parentId !== null) {
      query.parentId = params.parentId
    }

    const { data } = await api.get(BASE_PATH, { params: query })
    return normalizeCollection(data)
  },

  async getTree(isActive?: boolean): Promise<IndustryCategory[]> {
    const { data } = await api.get(BASE_PATH, {
      params: {
        tree: true,
        ...(isActive !== undefined ? { isActive } : {}),
      },
    })
    return normalizeCollection(data)
  },

  async getById(id: number): Promise<IndustryCategory> {
    const { data } = await api.get(`${BASE_PATH}/${id}`)
    return unwrapSuccess<IndustryCategory>(data)
  },

  async getByCodes(codes: string[]): Promise<IndustryCategory[]> {
    const normalized = [...new Set(codes.map((code) => code.trim()).filter(Boolean))]
    if (normalized.length === 0) return []

    const { data } = await api.get(BASE_PATH, {
      params: {
        all: true,
        mas: normalized.join(','),
      },
    })
    return normalizeCollection(data)
  },

  async create(payload: IndustryCategoryPayload): Promise<IndustryCategory> {
    const { data } = await api.post(BASE_PATH, payload)
    return unwrapSuccess<IndustryCategory>(data)
  },

  async update(id: number, payload: Partial<IndustryCategoryPayload>): Promise<IndustryCategory> {
    const { data } = await api.put(`${BASE_PATH}/${id}`, payload)
    return unwrapSuccess<IndustryCategory>(data)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },

  async exportCatalog(): Promise<Blob> {
    const { data } = await api.get<Blob>(`${BASE_PATH}-export`, {
      responseType: 'blob',
    })
    return data
  },

  async importCatalog(file: File): Promise<IndustryCategoryImportResult> {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await api.post<{ data: IndustryCategoryImportResult; message: string }>(
      `${BASE_PATH}-import`,
      formData,
      {
        timeout: 600_000,
      },
    )
    return data.data
  },
}
