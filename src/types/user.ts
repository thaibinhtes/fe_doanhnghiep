import type { AuthRole } from './auth'
import type { OrgUnit } from './orgUnit'

export interface AppUser {
  id: number
  name: string
  email: string
  isActive: boolean
  roleId?: number | null
  donViId?: number | null
  role?: AuthRole | null
  donVi?: OrgUnit | null
  createdAt?: string
}

export interface UserPayload {
  name: string
  email: string
  password?: string
  roleId?: number | null
  donViId?: number | null
  isActive?: boolean
}

export interface UserListResponse {
  data: AppUser[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}
