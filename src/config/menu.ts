import type { Component } from 'vue'
import { TableIcon, UserGroupIcon, SettingsIcon, PieChartIcon } from '@/icons'

export interface MenuSubItem {
  name: string
  path: string
  permission: string
}

export interface MenuItem {
  name: string
  icon: Component
  permission?: string
  path?: string
  subItems?: MenuSubItem[]
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

export const menuConfig: MenuGroup[] = [
  {
    title: 'Danh mục',
    items: [
      {
        name: 'Quản lý doanh nghiệp',
        icon: TableIcon,
        subItems: [
          { name: 'Danh sách doanh nghiệp', path: '/companies', permission: 'menu.companies.list' },
          { name: 'Bản đồ doanh nghiệp', path: '/companies/map', permission: 'menu.companies.map' },
          { name: 'Định danh doanh nghiệp', path: '/companies/identity', permission: 'menu.companies.identity' },
          { name: 'Tạo doanh nghiệp', path: '/companies/create', permission: 'menu.companies.create' },
          { name: 'Trạng thái doanh nghiệp', path: '/companies/statuses', permission: 'menu.companies.statuses' },
        ],
      },
      {
        name: 'Thành viên',
        icon: UserGroupIcon,
        subItems: [
          { name: 'Danh sách thành viên', path: '/members', permission: 'menu.members.list' },
          { name: 'Tạo thành viên', path: '/members/create', permission: 'menu.members.create' },
        ],
      },
      {
        name: 'Báo cáo',
        icon: PieChartIcon,
        subItems: [
          { name: 'Báo cáo tổng hợp', path: '/reports/summary', permission: 'menu.reports.summary' },
          {
            name: 'Báo cáo tiến độ định danh',
            path: '/reports/progress',
            permission: 'menu.reports.progress',
          },
        ],
      },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      {
        name: 'Phân quyền',
        icon: SettingsIcon,
        path: '/admin/roles',
        permission: 'menu.admin.roles',
      },
      {
        name: 'Quản lý địa chính (ProvinceCode)',
        icon: SettingsIcon,
        path: '/admin/cadastral',
        permission: 'menu.admin.roles',
      },
    ],
  },
]

export const routePermissions: Record<string, string> = {
  '/': 'menu.companies.list',
  '/companies': 'menu.companies.list',
  '/companies/map': 'menu.companies.map',
  '/companies/identity': 'menu.companies.identity',
  '/companies/create': 'menu.companies.create',
  '/companies/statuses': 'menu.companies.statuses',
  '/members': 'menu.members.list',
  '/members/create': 'menu.members.create',
  '/reports/summary': 'menu.reports.summary',
  '/reports/progress': 'menu.reports.progress',
  '/admin/roles': 'menu.admin.roles',
  '/admin/cadastral': 'menu.admin.roles',
}

export function getRoutePermission(path: string): string | undefined {
  if (routePermissions[path]) {
    return routePermissions[path]
  }

  if (/^\/companies\/\d+\/map$/.test(path)) {
    return 'menu.companies.map'
  }

  return undefined
}
