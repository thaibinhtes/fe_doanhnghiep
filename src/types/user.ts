import type { AuthRole } from './auth'
import type { OrgUnit } from './orgUnit'

export interface PhongBanOption {
  id: number
  ma: string
  ten: string
}

export interface AppUser {
  id: number
  name: string
  email: string
  isActive: boolean
  roleId?: number | null
  donViId?: number | null
  phongBanId?: number | null
  chucDanh?: string | null
  role?: AuthRole | null
  donVi?: OrgUnit | null
  phongBan?: PhongBanOption | null
  createdAt?: string
}

export interface UserPayload {
  name: string
  email: string
  password?: string
  roleId?: number | null
  donViId?: number | null
  phongBanId?: number | null
  chucDanh?: string | null
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
