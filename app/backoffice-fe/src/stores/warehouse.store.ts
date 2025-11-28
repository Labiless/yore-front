import { defineStore } from 'pinia';

export const useWharehouseStore = defineStore('warehouse', {
  state: () => ({
    allBatches : [],
    warehouse : [],
    batchUuid : '',
    batchData : [],
    inkUuid : '',
    inkData : {}
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
    resetSearch(){
            this.batchUuid = '';
            this.batchData = [];
            this.inkUuid = '';
            this.inkData = {};
    }
  },
})
