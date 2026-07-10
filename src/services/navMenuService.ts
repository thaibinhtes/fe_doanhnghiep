import api from './api'
import type { NavMenuNode, NavMenuReorderItem } from '@/types/navMenu'

export const navMenuService = {
  async getMenu(): Promise<NavMenuNode[]> {
    const { data } = await api.get<{ data: NavMenuNode[] }>('/nav-menu')
    return data.data ?? []
  },

  async getAdminMenu(): Promise<NavMenuNode[]> {
    const { data } = await api.get<{ data: NavMenuNode[] }>('/nav-menu/admin')
    return data.data ?? []
  },

  async reorder(items: NavMenuReorderItem[]): Promise<NavMenuNode[]> {
    const { data } = await api.put<{ data: NavMenuNode[] }>('/nav-menu/reorder', { items })
    return data.data ?? []
  },
}
