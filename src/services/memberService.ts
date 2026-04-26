import api from './api'
import type { Member } from '@/types/company'

const BASE_PATH = '/members'

export interface MemberListResponse {
  data: Member[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    links: Array<{
      url: string | null
      label: string
      page: number | null
      active: boolean
    }>
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

export const memberService = {
  async getAll(filters?: { search?: string; page?: number; per_page?: number }): Promise<MemberListResponse> {
    const { data } = await api.get<MemberListResponse>(BASE_PATH, { params: filters })
    return data
  },

  async getById(id: number): Promise<Member> {
    const { data } = await api.get<{ data: Member }>(`${BASE_PATH}/${id}`)
    return data.data
  },

  async create(payload: Partial<Member>): Promise<Member> {
    const { data } = await api.post<{ data: Member }>(BASE_PATH, payload)
    return data.data
  },

  async update(id: number, payload: Partial<Member>): Promise<Member> {
    const { data } = await api.put<{ data: Member }>(`${BASE_PATH}/${id}`, payload)
    return data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`)
  },
}
