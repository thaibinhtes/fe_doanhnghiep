import type { NavMenuNode } from '@/types/navMenu'

export type RoutePermission = string | string[]

/** Static fallbacks for routes not driven by nav menu or dynamic paths. */
export const routePermissions: Record<string, RoutePermission> = {
  '/': 'menu.dashboard',
  '/dashboard': 'menu.dashboard',
  '/companies': 'menu.companies.list',
  '/companies/import': ['feature.companies.import', 'menu.companies.list'],
  '/companies/update-fields': ['feature.companies.import', 'menu.companies.list'],
  '/companies/import-history': ['feature.companies.import', 'menu.companies.list'],
  '/companies/import-tax': 'menu.admin.org-units',
  '/companies/map': 'menu.companies.map',
  '/companies/identity': 'menu.companies.identity',
  '/companies/identity-history': 'menu.reports.identity-history',
  '/reports/identity-history': 'menu.reports.identity-history',
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
  '/admin/tax-management': ['menu.admin.org-units', 'menu.admin.tax-units'],
  '/admin/tax-units': 'menu.admin.tax-units',
  '/admin/users': 'menu.admin.users',
  '/admin/import-history': 'menu.import-history',
  '/admin/menu-config': '__root__',
  '/admin/import-mapping/companies': 'menu.admin.import-mapping-companies',
  '/admin/import-mapping/cooperatives': 'menu.admin.import-mapping-cooperatives',
}

export function getRoutePermission(
  path: string,
  dynamicMap?: Record<string, RoutePermission>,
): RoutePermission | undefined {
  const pathname = path.split('?')[0]
  const map = dynamicMap ?? routePermissions

  if (map[pathname]) {
    return map[pathname]
  }

  if (/^\/companies\/\d+\/map$/.test(pathname)) {
    return 'menu.companies.map'
  }

  return undefined
}

export function hasRouteAccess(
  required: RoutePermission | undefined,
  hasPermission: (key: string) => boolean,
  isRoot = false,
): boolean {
  if (!required) return true
  if (required === '__root__') return isRoot
  if (Array.isArray(required)) {
    return required.some((key) => hasPermission(key))
  }
  return hasPermission(required)
}

export function getFirstAccessibleRoute(
  hasPermission: (key: string) => boolean,
  menuNodes: NavMenuNode[] = [],
  isRoot = false,
): string {
  const paths = collectNavPaths(menuNodes)
  const map = { ...routePermissions }
  walkMenuForRoutes(menuNodes, map)

  for (const fullPath of paths) {
    const pathname = fullPath.split('?')[0]
    const required = map[pathname]
    if (hasRouteAccess(required, hasPermission, isRoot)) {
      return pathname
    }
  }

  for (const path of Object.keys(routePermissions).filter((p) => p !== '/')) {
    if (hasRouteAccess(routePermissions[path], hasPermission, isRoot)) {
      return path
    }
  }

  return '/dashboard'
}

function walkMenuForRoutes(
  nodes: NavMenuNode[],
  map: Record<string, RoutePermission>,
): void {
  for (const node of nodes) {
    if (node.path && node.permissionKey) {
      const pathname = node.path.split('?')[0]
      const permission = node.permissionKeys?.length ? node.permissionKeys : node.permissionKey
      if (!map[pathname]) {
        map[pathname] = permission
      }
    }
    if (node.children?.length) {
      walkMenuForRoutes(node.children, map)
    }
  }
}

export function collectNavPaths(nodes: NavMenuNode[]): string[] {
  const paths: string[] = []
  for (const node of nodes) {
    if (node.path) paths.push(node.path)
    if (node.children?.length) {
      paths.push(...collectNavPaths(node.children))
    }
  }
  return paths
}
