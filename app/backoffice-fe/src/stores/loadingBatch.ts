import { defineStore } from 'pinia';

export const useLoadingBatchStore = defineStore('loadingBatch', {
  state: () => ({
    color: '',
    inkType: '',
    amount: '',
    expirationDate: '',
    productionId: '',
    inkFormulaUrl: '',
    sdsUrl: '',
    sterilizationCertUrl: '',
    chemistryAnalysisUrl: '',
    microbiologicalAnalysisUrl: '',
  }),

  getters: {
    //title: (state) => state.title,
  },

  actions: {
    resetLoadingBatch() {
        this.color = '';
        this.inkType = '';
        this.amount = '';
        this.expirationDate = '';
        this.productionId = '';
        this.inkFormulaUrl = '';
        this.sdsUrl = '';
        this.sterilizationCertUrl = '';
        this.chemistryAnalysisUrl = '';
        this.microbiologicalAnalysisUrl = '';
    },
  },
})
