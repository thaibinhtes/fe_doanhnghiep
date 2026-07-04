import api from './api'
import type { AppUser, UserListResponse, UserPayload } from '@/types/user'

const BASE_PATH = '/users'

function unwrapSuccess<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data
  }
  return payload as T
}

export const userService = {
  async getList(params: {
    search?: string
    roleId?: number
    donViId?: number
    isActive?: boolean
    page?: number
    perPage?: number
  } = {}): Promise<UserListResponse> {
    const { data } = await api.get(BASE_PATH, { params })
    return data as UserListResponse
  },

  async getById(id: number): Promise<AppUser> {
    const { data } = await api.get(`${BASE_PATH}/${id}`)
    return unwrapSuccess<AppUser>(data)
  },

  async create(payload: UserPayload): Promise<AppUser> {
    const { data } = await api.post(BASE_PATH, payload)
    return unwrapSuccess<AppUser>(data)
  },

  async update(id: number, payload: Partial<UserPayload>): Promise<AppUser> {
    const { data } = await api.put(`${BASE_PATH}/${id}`, payload)
    return unwrapSuccess<AppUser>(data)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },
}
