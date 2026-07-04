import api from './api'
import type { OrgUnit, OrgUnitListResponse, OrgUnitPayload } from '@/types/orgUnit'

const BASE_PATH = '/don-vi'

function unwrapSuccess<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data
  }
  return payload as T
}

function normalizeCollection(payload: unknown): OrgUnit[] {
  const body = unwrapSuccess<unknown>(payload)
  if (Array.isArray(body)) return body
  if (body && typeof body === 'object' && 'data' in body && Array.isArray((body as { data: OrgUnit[] }).data)) {
    return (body as { data: OrgUnit[] }).data
  }
  return []
}

export const orgUnitService = {
  async getList(params: {
    parentId?: number | null | 'root'
    cap?: number
    isActive?: boolean
    search?: string
    page?: number
    perPage?: number
  } = {}): Promise<OrgUnitListResponse> {
    const query: Record<string, unknown> = {
      page: params.page,
      perPage: params.perPage,
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
    const body = unwrapSuccess<unknown>(data)
    if (Array.isArray(body)) {
      return { data: body }
    }
    return body as OrgUnitListResponse
  },

  async getAll(params: { isActive?: boolean; search?: string } = {}): Promise<OrgUnit[]> {
    const { data } = await api.get(BASE_PATH, {
      params: {
        all: true,
        search: params.search,
        ...(params.isActive !== undefined ? { isActive: params.isActive } : {}),
      },
    })
    return normalizeCollection(data)
  },

  async getTree(isActive?: boolean): Promise<OrgUnit[]> {
    const { data } = await api.get(BASE_PATH, {
      params: {
        tree: true,
        ...(isActive !== undefined ? { isActive } : {}),
      },
    })
    return normalizeCollection(data)
  },

  async getById(id: number): Promise<OrgUnit> {
    const { data } = await api.get(`${BASE_PATH}/${id}`)
    return unwrapSuccess<OrgUnit>(data)
  },

  async create(payload: OrgUnitPayload): Promise<OrgUnit> {
    const { data } = await api.post(BASE_PATH, payload)
    return unwrapSuccess<OrgUnit>(data)
  },

  async update(id: number, payload: Partial<OrgUnitPayload>): Promise<OrgUnit> {
    const { data } = await api.put(`${BASE_PATH}/${id}`, payload)
    return unwrapSuccess<OrgUnit>(data)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },
}
