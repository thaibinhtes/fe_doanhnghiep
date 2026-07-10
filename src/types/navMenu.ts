export interface NavMenuNode {
  id: number
  parentId: number | null
  label: string
  path: string | null
  icon: string | null
  permissionKey: string | null
  permissionKeys: string[] | null
  sortOrder: number
  isDashboard: boolean
  isRootOnly: boolean
  isActive: boolean
  children: NavMenuNode[]
}

export interface NavMenuReorderItem {
  id: number
  parentId: number | null
  sortOrder: number
  label?: string
}

/** Sidebar group shape (single default group). */
export interface NavMenuGroup {
  title: string
  items: NavMenuNode[]
}
