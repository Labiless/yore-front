// src/services/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import router from '@/router';

const api = axios.create({
  baseURL: "https://yore-back.onrender.com",
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const uiStore = useUiStore();
    const authStore = useAuthStore();
    if (error.response?.status === 401) {
      alert("Session expired");
      authStore.logout();
      router.push('/login');
    }
    else {
      // alert("Error with BE");
      // router.push('/home');
    }
    uiStore.loading = false;
    return Promise.reject(error)
  },
)

export default api
