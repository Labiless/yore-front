import { defineStore } from 'pinia';

export const useLabelsStore = defineStore('lables', {
  state: () => ({
    allBatches : [],
    batchUuid : '',
    batchData : [],
    labelUuid : '',
    labelData : {}
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
    resetBatches() {
        this.allBatches = []
    },
    resetSearch(){
            this.batchUuid = '';
            this.batchData = [];
            this.labelUuid = '';
            this.labelData = {};
    }
  },
})
