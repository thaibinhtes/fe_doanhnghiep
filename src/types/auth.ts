export interface AuthRole {
  id: number
  name: string
  slug: string
  level?: number
  description?: string | null
  permissionKeys?: string[]
}

export interface AuthUser {
  id: number
  name: string
  email: string
  isActive: boolean
  roleId?: number | null
  donViId?: number | null
  role?: AuthRole | null
  donVi?: {
    id: number
    ma: string
    ten: string
    cap: number
  } | null
  permissions?: string[]
  createdAt?: string
}

export interface LoginPayload {
  email: string
  password: string
  captchaToken?: string
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

export interface PermissionCreatePayload {
  key: string
  name: string
  type: 'menu' | 'feature'
  groupName: string
  path?: string | null
  sortOrder?: number
}

export interface RoleItem {
  id: number
  name: string
  slug: string
  level?: number
  description?: string | null
  permissions?: PermissionItem[]
  permissionKeys?: string[]
  usersCount?: number
}
