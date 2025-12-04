import { defineStore } from 'pinia';


export const useUiStore = defineStore('ui', {
  state: () => ({
    title: "",
    loading: false,
    toast : '',
    toastType: ''
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
    setToast(text: string, type: string = 'success'){
      this.toast = text;
      this.toastType = type;
      setTimeout(() => {
        this.toast = '';
      }, 3000)
    }
  },
})
