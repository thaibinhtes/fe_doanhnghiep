import axios from 'axios'
import { API_PREFIX } from '@/config/env'

const api = axios.create({
  baseURL: API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
})

if (import.meta.env.DEV) {
  console.info('[API] prefix =', API_PREFIX)
}
// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // FormData: let browser set multipart boundary (manual Content-Type breaks upload → 422)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const isAuthLogin = url.includes('/auth/login')

    if (status === 401 && !isAuthLogin) {
      localStorage.removeItem('token')
      if (!window.location.pathname.startsWith('/signin')) {
        window.location.href = '/signin'
      }
    }
    return Promise.reject(error)
  },
)

export { API_PREFIX }
export default api
