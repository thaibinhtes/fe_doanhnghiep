import type { AuthUser } from '@/types/auth'

export interface OrgUnit {
  id: number
  parentId: number | null
  cap: number
  ma: string
  ten: string
  moTa?: string | null
  thuTu: number
  isActive: boolean
  childrenCount?: number
  usersCount?: number
  companiesCount?: number
  parent?: Pick<OrgUnit, 'id' | 'cap' | 'ma' | 'ten'> | null
  children?: OrgUnit[]
  createdAt?: string
  updatedAt?: string
}

export interface OrgUnitPayload {
  parentId?: number | null
  cap: number
  ma: string
  ten: string
  moTa?: string | null
  thuTu?: number
  isActive?: boolean
}

export interface OrgUnitListResponse {
  data: OrgUnit[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}

export interface OrgUnitTreeRow extends OrgUnit {
  depth: number
  label: string
}

export function flattenOrgUnitTree(items: OrgUnit[], depth = 0): OrgUnitTreeRow[] {
  const rows: OrgUnitTreeRow[] = []

  for (const item of items) {
    rows.push({
      ...item,
      depth,
      label: `${item.ma} — ${item.ten}`,
    })

    if (item.children?.length) {
      rows.push(...flattenOrgUnitTree(item.children, depth + 1))
    }
  }

  return rows
}

/** ROOT (đơn vị gốc) hoặc role root — xem toàn bộ cây đơn vị. */
export function hasUnrestrictedOrgScope(user: AuthUser | null | undefined): boolean {
  if (!user) return false
  if (user.role?.slug === 'root') return true
  return user.donVi?.ma === 'ROOT'
}

export function extractOrgUnitSubtree(items: OrgUnit[], donViId: number): OrgUnit[] {
  const unit = findOrgUnitById(items, donViId)
  return unit ? [unit] : []
}

export function buildScopedOrgUnitOptions(
  tree: OrgUnit[],
  user: AuthUser | null | undefined,
): Array<{ id: number; label: string; cap: number }> {
  if (!user || hasUnrestrictedOrgScope(user)) {
    return buildOrgUnitOptions(tree)
  }
  if (!user.donViId) return []
  return buildOrgUnitOptions(extractOrgUnitSubtree(tree, user.donViId))
}

export function defaultOrgUnitFilterValue(
  options: Array<{ id: number }>,
  user: AuthUser | null | undefined,
): string {
  if (hasUnrestrictedOrgScope(user)) {
    return ''
  }
  if (user?.donViId && options.some((opt) => opt.id === user.donViId)) {
    return String(user.donViId)
  }
  return options[0] ? String(options[0].id) : ''
}

/** Giá trị gửi API — luôn dùng đơn vị mặc định khi user thuộc phạm vi đơn vị. */
export function resolveOrgUnitFilterValue(
  donViId: string | number,
  user: AuthUser | null | undefined,
  options: Array<{ id: number }>,
): string | number | undefined {
  const resolved = donViId || defaultOrgUnitFilterValue(options, user)
  return resolved || undefined
}

export function buildOrgUnitOptions(items: OrgUnit[], depth = 0): Array<{ id: number; label: string; cap: number }> {
  const options: Array<{ id: number; label: string; cap: number }> = []

  for (const item of items) {
    options.push({
      id: item.id,
      cap: item.cap,
      label: `${'— '.repeat(depth)}${item.ma} — ${item.ten}`,
    })

    if (item.children?.length) {
      options.push(...buildOrgUnitOptions(item.children, depth + 1))
    }
  }

  return options
}

export interface ImportScopeOrgUnit {
  id: number
  ma: string
  ten: string
  cap: number
  isPrimary: boolean
}

export function findOrgUnitById(items: OrgUnit[], id: number): OrgUnit | null {
  for (const item of items) {
    if (item.id === id) {
      return item
    }
    if (item.children?.length) {
      const found = findOrgUnitById(item.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

export function findOrgUnitAncestors(items: OrgUnit[], donViId: number): ImportScopeOrgUnit[] {
  const unit = findOrgUnitById(items, donViId)
  if (!unit) return []

  const ancestors: ImportScopeOrgUnit[] = []
  let parentId = unit.parentId

  while (parentId) {
    const parent = findOrgUnitById(items, parentId)
    if (!parent) break
    ancestors.unshift({
      id: parent.id,
      ma: parent.ma,
      ten: parent.ten,
      cap: parent.cap,
      isPrimary: false,
    })
    parentId = parent.parentId
  }

  return ancestors
}

export function resolveImportScopeOrgUnits(
  donViId: number | null | undefined,
  donVi: { id: number; ma: string; ten: string; cap: number } | null | undefined,
  tree: OrgUnit[],
  directChildren: OrgUnit[] = [],
  includeAncestors = false,
): ImportScopeOrgUnit[] {
  if (!donViId) {
    return donVi
      ? [{ id: donVi.id, ma: donVi.ma, ten: donVi.ten, cap: donVi.cap, isPrimary: true }]
      : []
  }

  const primaryFromTree = findOrgUnitById(tree, donViId)
  const primary: ImportScopeOrgUnit = primaryFromTree
    ? {
        id: primaryFromTree.id,
        ma: primaryFromTree.ma,
        ten: primaryFromTree.ten,
        cap: primaryFromTree.cap,
        isPrimary: true,
      }
    : donVi
      ? { id: donVi.id, ma: donVi.ma, ten: donVi.ten, cap: donVi.cap, isPrimary: true }
      : { id: donViId, ma: String(donViId), ten: 'Đơn vị', cap: 0, isPrimary: true }

  const children =
    directChildren.length > 0
      ? directChildren
      : (primaryFromTree?.children ?? []).filter((item) => item.isActive !== false)

  const ancestors = includeAncestors && donViId ? findOrgUnitAncestors(tree, donViId) : []

  return [
    ...ancestors,
    primary,
    ...children.map((item) => ({
      id: item.id,
      ma: item.ma,
      ten: item.ten,
      cap: item.cap,
      isPrimary: false,
    })),
  ]
}
