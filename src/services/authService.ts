import api from './api'
import type { AuthUser, LoginPayload, LoginResponse } from '@/types/auth'

const BASE_PATH = '/auth'

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<{ data: LoginResponse; message: string }>(
      `${BASE_PATH}/login`,
      payload,
    )
    return data.data
  },

  async logout(): Promise<void> {
    await api.post(`${BASE_PATH}/logout`)
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<{ data: AuthUser }>(`${BASE_PATH}/me`)
    return data.data
  },

  async refresh(): Promise<LoginResponse> {
    const { data } = await api.post<{ data: LoginResponse }>(`${BASE_PATH}/refresh`)
    return data.data
  },
}
