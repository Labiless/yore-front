import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => ({
    allUsers : [],
    userUuid : '',
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
    resetSearch(){
        this.userUuid = '';
    }
  },
})
