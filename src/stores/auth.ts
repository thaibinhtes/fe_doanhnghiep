import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { AuthUser, LoginPayload } from '@/types/auth'

const TOKEN_KEY = 'token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const loading = ref(false)
  const initialized = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const permissions = computed(() => user.value?.permissions ?? [])

  function hasPermission(key: string): boolean {
    return permissions.value.includes(key)
  }

  function hasAnyPermission(keys: string[]): boolean {
    return keys.some((key) => hasPermission(key))
  }

  function setToken(value: string | null) {
    token.value = value
    if (value) {
      localStorage.setItem(TOKEN_KEY, value)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null
    try {
      const result = await authService.login(payload)
      setToken(result.token)
      user.value = {
        ...result.user,
        permissions: result.user.permissions ?? result.user.role?.permissionKeys ?? [],
      }
      return result
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr.response?.data?.message ?? 'Đăng nhập thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      return null
    }

    try {
      const me = await authService.me()
      user.value = {
        ...me,
        permissions: me.permissions ?? me.role?.permissionKeys ?? [],
      }
      return me
    } catch {
      setToken(null)
      user.value = null
      return null
    }
  }

  async function init() {
    if (initialized.value) return
    loading.value = true
    try {
      if (token.value) {
        await fetchUser()
      }
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await authService.logout()
      }
    } catch {
      // ignore logout errors
    } finally {
      setToken(null)
      user.value = null
    }
  }

  return {
    user,
    token,
    loading,
    initialized,
    error,
    isAuthenticated,
    permissions,
    hasPermission,
    hasAnyPermission,
    login,
    fetchUser,
    init,
    logout,
    setToken,
  }
})
