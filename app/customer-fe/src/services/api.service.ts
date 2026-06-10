// src/services/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { normalizePayload, shouldNormalizeRequest } from '@shared/lib/normalizePayload';
import { createAuthSession, type AuthSession, type AuthSessionOptions, type RouterLike } from '@shared/lib/authSession';

const api = axios.create({
  baseURL: import.meta.env.VITE_BE_BASE_URL, // "https://yore-back.onrender.com/api",
})

let authSessionInstance: AuthSession | null = null;

export function bindAuthSession(
  router: RouterLike,
  options?: Pick<AuthSessionOptions, 'onSessionExpired'>,
) {
  authSessionInstance = createAuthSession(api, {
    getAuthStore: () => useAuthStore(),
    getRouter: () => router,
    onSessionExpired: options?.onSessionExpired,
  });
  return authSessionInstance;
}

export function getAuthSession(): AuthSession {
  if (!authSessionInstance) {
    throw new Error('Auth session is not initialized');
  }
  return authSessionInstance;
}

api.interceptors.request.use((config) => {
  if (shouldNormalizeRequest(config.method, config.data)) {
    config.data = normalizePayload(config.data)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const uiStore = useUiStore();
    if (error.response?.status === 401 && error.config?.url?.includes('/auth/signin')) {
      uiStore.loading = false;
      uiStore.loadingMessage = '';
      return Promise.reject(error)
    }
    uiStore.loading = false;
    uiStore.loadingMessage = '';
    return Promise.reject(error)
  },
)

export default api
