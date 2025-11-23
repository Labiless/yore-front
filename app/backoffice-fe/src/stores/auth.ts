import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    loginSuccess(token: string) {
      this.setToken(token);
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token')
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    }
  },
})
