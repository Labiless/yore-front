import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    title: "",
    loading: false,
    toast: '',
    toastType: '',
    popup: {
      action: null as Function | null,
      text: '' as string
    }
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
    setToast(text: string, type: string = 'success') {
      this.toast = text;
      this.toastType = type;
      setTimeout(() => {
        this.toast = '';
      }, 3000)
    },
    setPopoup(text: string, action: Function | null = null) {
      this.popup.text = text;
      this.popup.action = action;
    },
    closePopup() {
      this.popup.text = '';
      this.popup.action = null;
    }
  },
})
