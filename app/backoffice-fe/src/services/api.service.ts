// src/services/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:3000', // cambia con il tuo BE
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// opzionale: se il BE risponde 401, facciamo logout e redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()
    if (error.response?.status === 401) {
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
