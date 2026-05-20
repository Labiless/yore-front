import { defineStore } from 'pinia';

export const useWharehouseStore = defineStore('warehouse', {
  state: () => ({
    allBatches: [] as any[],
    warehouse: [] as any[],
    batchUuid: '',
    batchData: [] as any[],
    inkUuid: '',
    inkData: {} as Record<string, unknown>,
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
