import api from './api'
import type { PermissionCreatePayload, PermissionGroup, PermissionItem, RoleItem } from '@/types/auth'

export const roleService = {
  async getRoles(): Promise<RoleItem[]> {
    const { data } = await api.get<{ data: RoleItem[] }>('/roles')
    return data.data
  },

  async getRole(id: number): Promise<RoleItem> {
    const { data } = await api.get<{ data: RoleItem }>(`/roles/${id}`)
    return data.data
  },

  async updateRolePermissions(id: number, permissionKeys: string[]): Promise<RoleItem> {
    const { data } = await api.put<{ data: RoleItem }>(`/roles/${id}/permissions`, {
      permissionKeys,
    })
    return data.data
  },

  async getPermissions(): Promise<{ all: PermissionItem[]; grouped: PermissionGroup[] }> {
    const { data } = await api.get<{
      data: { all: PermissionItem[]; grouped: PermissionGroup[] }
    }>('/permissions')
    return data.data
  },

  async createPermission(payload: PermissionCreatePayload): Promise<PermissionItem> {
    const { data } = await api.post<{ data: PermissionItem }>('/permissions', payload)
    return data.data
  },
}
