import type { Component } from 'vue'
import { TableIcon, UserGroupIcon, SettingsIcon, PieChartIcon, LayoutDashboardIcon } from '@/icons'

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
    title: 'Tổng quan',
    items: [
      {
        name: 'Dashboard',
        icon: LayoutDashboardIcon,
        path: '/dashboard',
        permission: 'menu.dashboard',
      },
    ],
  },
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
        name: 'Quản lý địa chính',
        icon: SettingsIcon,
        path: '/admin/cadastral',
        permission: 'menu.admin.cadastral',
      },
      {
        name: 'Loại hình doanh nghiệp',
        icon: SettingsIcon,
        path: '/admin/business-types',
        permission: 'menu.admin.business-types',
      },
      {
        name: 'Danh mục ngành nghề',
        icon: SettingsIcon,
        path: '/admin/industry-categories',
        permission: 'menu.admin.industry-categories',
      },
      {
        name: 'Quản lý đơn vị',
        icon: SettingsIcon,
        path: '/admin/org-units',
        permission: 'menu.admin.org-units',
      },
      {
        name: 'Quản lý người dùng',
        icon: SettingsIcon,
        path: '/admin/users',
        permission: 'menu.admin.users',
      },
    ],
  },
]

export const routePermissions: Record<string, string> = {
  '/': 'menu.dashboard',
  '/dashboard': 'menu.dashboard',
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
  '/admin/cadastral': 'menu.admin.cadastral',
  '/admin/business-types': 'menu.admin.business-types',
  '/admin/industry-categories': 'menu.admin.industry-categories',
  '/admin/org-units': 'menu.admin.org-units',
  '/admin/users': 'menu.admin.users',
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

/** First menu route the user may open (stable order from routePermissions). */
export function getFirstAccessibleRoute(hasPermission: (key: string) => boolean): string {
  const paths = Object.keys(routePermissions)
    .filter((path) => path !== '/')
    .sort((a, b) => a.length - b.length)

  for (const path of paths) {
    const permission = routePermissions[path]
    if (permission && hasPermission(permission)) {
      return path
    }
  }

  return '/dashboard'
}
