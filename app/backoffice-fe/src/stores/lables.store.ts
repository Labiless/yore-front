import { defineStore } from 'pinia';

export const useLabelsStore = defineStore('lables', {
  state: () => ({
    allBatches: [] as any[],
    batchUuid: '',
    batchData: [] as any[],
    labelUuid: '',
    labelData: {} as Record<string, unknown>,
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
