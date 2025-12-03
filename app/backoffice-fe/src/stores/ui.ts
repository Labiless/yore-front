import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    title: "",
    loading: false,
    toast : '',
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
    setToast(text: string){
      this.toast = text;
      setTimeout(() => {
        this.toast = '';
      }, 3000)
    }
  },
})
