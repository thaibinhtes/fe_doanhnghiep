import type { Component } from 'vue'
import {
  TableIcon,
  UserGroupIcon,
  SettingsIcon,
  PieChartIcon,
  LayoutDashboardIcon,
  BoxCubeIcon,
  GridIcon,
  ArchiveIcon,
} from '@/icons'

export interface MenuSubItem {
  name: string
  path?: string
  /** Primary permission key (used in admin UI). */
  permission: string
  /** When set, user needs any of these keys to see the item. */
  permissions?: string[]
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
        name: 'Lịch sử import',
        icon: ArchiveIcon,
        path: '/admin/import-history',
        permission: 'menu.import-history',
      },
      {
        name: 'Quản lý doanh nghiệp',
        icon: TableIcon,
        subItems: [
          { name: 'Doanh nghiệp', path: '/companies', permission: 'menu.companies.list' },
          {
            name: 'Tạo mới doanh nghiệp',
            path: '/companies/create',
            permission: 'menu.companies.create',
          },
          {
            name: 'Import doanh nghiệp',
            path: '/companies/import',
            permission: 'feature.companies.import',
            permissions: ['feature.companies.import', 'menu.companies.list'],
          },
          {
            name: 'Lịch sử import',
            path: '/companies/import-history',
            permission: 'feature.companies.import',
            permissions: ['feature.companies.import', 'menu.companies.list'],
          },
          {
            name: 'Import thuế doanh nghiệp',
            path: '/companies/import-tax',
            permission: 'menu.admin.org-units',
          },
          {
            name: 'Thuế doanh nghiệp',
            path: '/admin/tax-management?tab=companies',
            permission: 'menu.admin.org-units',
          },
        ],
      },
      {
        name: 'Quản lý hợp tác xã',
        icon: BoxCubeIcon,
        subItems: [
          {
            name: 'Hợp tác xã',
            path: '/cooperatives',
            permission: 'menu.cooperatives.list',
            permissions: ['menu.cooperatives.list', 'menu.companies.list'],
          },
          {
            name: 'Thêm mới hợp tác xã',
            path: '/cooperatives/create',
            permission: 'menu.cooperatives.list',
            permissions: ['menu.cooperatives.list', 'menu.companies.list'],
          },
          {
            name: 'Import hợp tác xã',
            path: '/cooperatives/import',
            permission: 'feature.cooperatives.import',
            permissions: ['feature.cooperatives.import', 'menu.cooperatives.list', 'menu.companies.list'],
          },
          {
            name: 'Lịch sử import',
            path: '/cooperatives/import-history',
            permission: 'feature.cooperatives.import',
            permissions: ['feature.cooperatives.import', 'menu.cooperatives.list', 'menu.companies.list'],
          },
          {
            name: 'Import thuế hợp tác xã',
            path: '/cooperatives/import-tax',
            permission: 'menu.admin.org-units',
          },
          {
            name: 'Thuế hợp tác xã',
            path: '/cooperatives/tax',
            permission: 'menu.admin.org-units',
          },
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
        name: 'Thuế',
        icon: SettingsIcon,
        permission: 'menu.admin.org-units',
        subItems: [
          {
            name: 'Danh sách đơn vị thuế',
            path: '/admin/tax-management?tab=tax-units',
            permission: 'menu.admin.org-units',
          },
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
                path: '/admin/cadastral?tab=new',
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

export type RoutePermission = string | string[]

export const routePermissions: Record<string, RoutePermission> = {
  '/': 'menu.dashboard',
  '/dashboard': 'menu.dashboard',
  '/companies': 'menu.companies.list',
  '/companies/import': ['feature.companies.import', 'menu.companies.list'],
  '/companies/import-history': ['feature.companies.import', 'menu.companies.list'],
  '/companies/import-tax': 'menu.admin.org-units',
  '/companies/map': 'menu.companies.map',
  '/companies/identity': 'menu.companies.identity',
  '/companies/create': 'menu.companies.create',
  '/companies/statuses': 'menu.companies.statuses',
  '/cooperatives': ['menu.cooperatives.list', 'menu.companies.list'],
  '/cooperatives/create': ['menu.cooperatives.list', 'menu.companies.list'],
  '/cooperatives/import': ['feature.cooperatives.import', 'menu.cooperatives.list', 'menu.companies.list'],
  '/cooperatives/import-history': ['feature.cooperatives.import', 'menu.cooperatives.list', 'menu.companies.list'],
  '/cooperatives/import-tax': 'menu.admin.org-units',
  '/cooperatives/tax': 'menu.admin.org-units',
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
  '/admin/tax-management': 'menu.admin.org-units',
  '/admin/users': 'menu.admin.users',
  '/admin/import-history': 'menu.import-history',
}

export function canAccessPermission(
  permission: string,
  hasPermission: (key: string) => boolean,
  alternatives?: string[],
): boolean {
  const keys = alternatives?.length ? alternatives : [permission]
  return keys.some((key) => hasPermission(key))
}

export function getRoutePermission(path: string): RoutePermission | undefined {
  const pathname = path.split('?')[0]
  if (routePermissions[pathname]) {
    return routePermissions[pathname]
  }

  if (/^\/companies\/\d+\/map$/.test(pathname)) {
    return 'menu.companies.map'
  }

  return undefined
}

export function hasRouteAccess(
  required: RoutePermission | undefined,
  hasPermission: (key: string) => boolean,
): boolean {
  if (!required) return true
  if (Array.isArray(required)) {
    return required.some((key) => hasPermission(key))
  }
  return hasPermission(required)
}

/** First menu route the user may open (stable order from routePermissions). */
export function getFirstAccessibleRoute(hasPermission: (key: string) => boolean): string {
  const paths = Object.keys(routePermissions)
    .filter((path) => path !== '/')
    .sort((a, b) => a.length - b.length)

  for (const path of paths) {
    const permission = routePermissions[path]
    if (hasRouteAccess(permission, hasPermission)) {
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
        if (!canAccessPermission(sub.permission, hasPermission, sub.permissions)) return null
        return { ...sub, subItems: nested }
      }

      if (!canAccessPermission(sub.permission, hasPermission, sub.permissions)) return null
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
