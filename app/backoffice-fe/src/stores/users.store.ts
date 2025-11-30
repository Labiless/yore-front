import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => ({
    allUsers : [],
    userData: null,
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
