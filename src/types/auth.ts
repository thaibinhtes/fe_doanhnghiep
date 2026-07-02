export interface AuthRole {
  id: number
  name: string
  slug: string
  description?: string | null
  permissionKeys?: string[]
}

export interface AuthUser {
  id: number
  name: string
  email: string
  isActive: boolean
  role?: AuthRole | null
  permissions?: string[]
  createdAt?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  user: AuthUser
}

export interface PermissionItem {
  id: number
  key: string
  name: string
  type: 'menu' | 'feature'
  groupName: string
  path?: string | null
  sortOrder: number
}

export interface PermissionGroup {
  group: string
  permissions: PermissionItem[]
}

export interface RoleItem {
  id: number
  name: string
  slug: string
  description?: string | null
  permissions?: PermissionItem[]
  permissionKeys?: string[]
  usersCount?: number
}
