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
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  },
)

export { API_PREFIX }
export default api
