import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    title: "",
    loading: false,
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
  },
})
