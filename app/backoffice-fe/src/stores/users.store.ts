import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => ({
    allUsers: [] as any[],
    userData: null as any,
    userUuid : '',
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
    resetUsersStore(){
      this.allUsers = [];
      this.userData = null;
      this.userUuid = '';
    },
    
    resetSearch(){
        this.userUuid = '';
    }
  },
})
