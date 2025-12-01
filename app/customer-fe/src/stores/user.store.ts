import { defineStore } from 'pinia';

export const userUserStore = defineStore('user', {
  state: () => ({
    uuid: '',
    email: '',
    businessName: ''
  }),

  getters: {
    getUiid: (state) => {
      const local = localStorage.getItem('userUuid');
      if(local) return local;
      return state.uuid;
    },
  },

  actions: {
    init(userData : any){
      localStorage.setItem('userUuid', userData.uuid);
      this.uuid = userData.uuid,
      this.email = userData.email,
      this.businessName = userData.businessName
    }
  },
})
