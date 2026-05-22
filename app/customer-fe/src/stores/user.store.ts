import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    uuid: '',
    email: '',
    businessName: '',
    city: '',
  }),

  getters: {
    getUiid: (state) => {
      const local = localStorage.getItem('userUuid');
      if (local) return local;
      return state.uuid;
    },
    getUser: (state) => {
      return {
        uuid: state.uuid,
        email: state.email,
        businessName: state.businessName
      }
    }
  },

  actions: {
    init(userData: any) {
      localStorage.setItem('userUuid', userData.uuid);
      this.uuid = userData.uuid ?? '';
      this.email = userData.email ?? '';
      this.businessName = userData.businessName ?? '';
      this.city = userData.city ?? '';
    }
  },
})
