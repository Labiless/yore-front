import { defineStore } from 'pinia';

export const useTatoosStore = defineStore('tattoos', {
  state: () => ({
    tattoos: [] as any[],
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
  },
})
