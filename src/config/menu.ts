import type { Component } from 'vue'
import {
  TableIcon,
  UserGroupIcon,
  SettingsIcon,
  PieChartIcon,
  LayoutDashboardIcon,
  BoxCubeIcon,
  GridIcon,
} from '@/icons'

export interface MenuSubItem {
  name: string
  path?: string
  permission: string
  subItems?: MenuSubItem[]
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
    title: '',
    items: [
      {
        name: 'Dashboard',
        icon: LayoutDashboardIcon,
        path: '/dashboard',
        permission: 'menu.dashboard',
      },
      {
        name: 'Quản lý doanh nghiệp',
        icon: TableIcon,
        subItems: [
          { name: 'Doanh nghiệp', path: '/companies', permission: 'menu.companies.list' },
          { name: 'Thành viên', path: '/members', permission: 'menu.members.list' },
        ],
      },
      {
        name: 'Quản lý hợp tác xã',
        icon: BoxCubeIcon,
        subItems: [
          { name: 'Hợp tác xã', path: '/cooperatives', permission: 'menu.companies.list' },
          { name: 'Thành viên', path: '/cooperatives/members', permission: 'menu.members.list' },
        ],
      },
      {
        name: 'Định danh tổ chức',
        icon: GridIcon,
        subItems: [
          { name: 'Bản đồ số', path: '/companies/map', permission: 'menu.companies.map' },
          { name: 'Định danh', path: '/companies/identity', permission: 'menu.companies.identity' },
        ],
      },
      {
        name: 'Báo cáo - thống kê',
        icon: PieChartIcon,
        subItems: [
          { name: 'Báo cáo tổng hợp', path: '/reports/summary', permission: 'menu.reports.summary' },
          { name: 'Báo cáo tiến độ', path: '/reports/progress', permission: 'menu.reports.progress' },
        ],
      },
      {
        name: 'Hệ thống và danh mục',
        icon: SettingsIcon,
        subItems: [
          {
            name: 'Danh mục đơn vị hành chính',
            permission: 'menu.admin.cadastral',
            subItems: [
              {
                name: 'Đơn vị hành chính cũ',
                path: '/admin/cadastral?tab=legacy',
                permission: 'menu.admin.cadastral',
              },
              {
                name: 'Đơn vị hành chính mới',
                path: '/admin/cadastral?tab=lookup',
                permission: 'menu.admin.cadastral',
              },
              {
                name: 'Ánh xạ đơn vị hành chính',
                path: '/admin/cadastral?tab=mapping',
                permission: 'menu.admin.cadastral',
              },
            ],
          },
          {
            name: 'Danh mục ngành nghề',
            path: '/admin/industry-categories',
            permission: 'menu.admin.industry-categories',
          },
          {
            name: 'Danh mục loại hình doanh nghiệp',
            path: '/admin/business-types',
            permission: 'menu.admin.business-types',
          },
          {
            name: 'Danh mục loại hình hợp tác xã',
            path: '/admin/cooperative-business-types',
            permission: 'menu.admin.business-types',
          },
          {
            name: 'Danh mục đơn vị',
            path: '/admin/org-units',
            permission: 'menu.admin.org-units',
          },
          {
            name: 'Danh mục người dùng',
            path: '/admin/users',
            permission: 'menu.admin.users',
          },
          {
            name: 'Phân quyền',
            path: '/admin/roles',
            permission: 'menu.admin.roles',
          },
        ],
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
  '/cooperatives': 'menu.companies.list',
  '/cooperatives/members': 'menu.members.list',
  '/members': 'menu.members.list',
  '/members/create': 'menu.members.create',
  '/reports/summary': 'menu.reports.summary',
  '/reports/progress': 'menu.reports.progress',
  '/admin/roles': 'menu.admin.roles',
  '/admin/cadastral': 'menu.admin.cadastral',
  '/admin/business-types': 'menu.admin.business-types',
  '/admin/cooperative-business-types': 'menu.admin.business-types',
  '/admin/industry-categories': 'menu.admin.industry-categories',
  '/admin/org-units': 'menu.admin.org-units',
  '/admin/users': 'menu.admin.users',
}

export function getRoutePermission(path: string): string | undefined {
  const pathname = path.split('?')[0]
  if (routePermissions[pathname]) {
    return routePermissions[pathname]
  }

  if (/^\/companies\/\d+\/map$/.test(pathname)) {
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

export function filterMenuSubItems(
  subItems: MenuSubItem[],
  hasPermission: (key: string) => boolean,
): MenuSubItem[] {
  return subItems
    .map((sub) => {
      if (sub.subItems?.length) {
        const nested = filterMenuSubItems(sub.subItems, hasPermission)
        if (nested.length === 0) return null
        if (!hasPermission(sub.permission)) return null
        return { ...sub, subItems: nested }
      }

      if (!hasPermission(sub.permission)) return null
      return sub
    })
    .filter((sub): sub is MenuSubItem => sub !== null)
}

export function collectSubItemPaths(subItems: MenuSubItem[]): string[] {
  const paths: string[] = []
  for (const sub of subItems) {
    if (sub.path) paths.push(sub.path)
    if (sub.subItems?.length) paths.push(...collectSubItemPaths(sub.subItems))
  }
  return paths
}
