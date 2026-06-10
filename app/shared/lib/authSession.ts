import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { RouteLocationNormalized } from 'vue-router';
import { isTokenExpired } from './jwt';

export type AuthStoreLike = {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void | Promise<void>;
};

export type RouterLike = {
  push: (path: string) => unknown;
  currentRoute: {
    value: {
      path: string;
    };
  };
};

export type AuthSessionOptions = {
  getAuthStore: () => AuthStoreLike;
  getRouter: () => RouterLike;
  onSessionExpired?: () => void;
};

export type AuthSession = {
  refreshAccessToken: () => Promise<string>;
  ensureAuthenticated: () => Promise<boolean>;
  guardRoute: (to: RouteLocationNormalized) => Promise<string | null>;
  startSessionWatcher: () => () => void;
  redirectToLogin: () => void;
};

const AUTH_ENDPOINTS = ['/auth/signin', '/auth/signup', '/auth/refresh', '/auth/logout'];

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

export function createAuthSession(
  api: AxiosInstance,
  options: AuthSessionOptions,
): AuthSession {
  let refreshPromise: Promise<string> | null = null;
  let sessionWatcherId: ReturnType<typeof setInterval> | null = null;

  const refreshClient = axios.create({
    baseURL: api.defaults.baseURL,
    withCredentials: true,
  });

  const redirectToLogin = () => {
    void refreshClient.post('/auth/logout').catch(() => undefined);

    const authStore = options.getAuthStore();
    authStore.logout();
    options.onSessionExpired?.();

    const router = options.getRouter();
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login');
    }
  };

  const refreshAccessToken = async (): Promise<string> => {
    if (!refreshPromise) {
      refreshPromise = refreshClient
        .get('/auth/refresh')
        .then((response) => {
          const token = response.data?.accessToken as string | undefined;
          if (!token) {
            throw new Error('Missing access token in refresh response');
          }
          options.getAuthStore().setToken(token);
          return token;
        })
        .catch((error) => {
          redirectToLogin();
          throw error;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  };

  const hasValidAccessToken = () => {
    const token = options.getAuthStore().token;
    return !!token && !isTokenExpired(token);
  };

  const ensureAuthenticated = async (): Promise<boolean> => {
    if (hasValidAccessToken()) {
      return true;
    }

    try {
      await refreshAccessToken();
      return true;
    } catch {
      return false;
    }
  };

  const guardRoute = async (to: RouteLocationNormalized): Promise<string | null> => {
    if (to.path === '/login') {
      if (hasValidAccessToken()) {
        return '/';
      }

      const token = options.getAuthStore().token;
      if (token && isTokenExpired(token)) {
        try {
          await refreshAccessToken();
          return '/';
        } catch {
          return null;
        }
      }

      return null;
    }

    if (hasValidAccessToken()) {
      return null;
    }

    try {
      await refreshAccessToken();
      return null;
    } catch {
      return '/login';
    }
  };

  const startSessionWatcher = () => {
    if (sessionWatcherId) {
      clearInterval(sessionWatcherId);
    }

    sessionWatcherId = setInterval(async () => {
      const authStore = options.getAuthStore();
      if (!authStore.token) return;

      if (!isTokenExpired(authStore.token)) return;

      try {
        await refreshAccessToken();
      } catch {
        // redirect handled in refreshAccessToken
      }
    }, 30_000);

    return () => {
      if (sessionWatcherId) {
        clearInterval(sessionWatcherId);
        sessionWatcherId = null;
      }
    };
  };

  api.defaults.withCredentials = true;

  api.interceptors.request.use(async (config) => {
    const authStore = options.getAuthStore();

    if (authStore.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    if (isAuthEndpoint(config.url)) {
      return config;
    }

    if (authStore.token && isTokenExpired(authStore.token)) {
      try {
        const token = await refreshAccessToken();
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // response interceptor / route guard will handle logout
      }
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isAuthEndpoint(originalRequest.url)) {
        if (!originalRequest.url?.includes('/auth/signin') && !originalRequest.url?.includes('/auth/signup')) {
          redirectToLogin();
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const token = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );

  return {
    refreshAccessToken,
    ensureAuthenticated,
    guardRoute,
    startSessionWatcher,
    redirectToLogin,
  };
}
