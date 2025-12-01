import { defineStore } from 'pinia';

export const useTatoosStore = defineStore('tattoos', {
  state: () => ({
    tattoos : []
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
  },
})
