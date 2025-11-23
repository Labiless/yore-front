import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    title: ""
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
  },
})
