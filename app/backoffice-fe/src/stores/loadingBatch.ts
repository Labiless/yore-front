import { defineStore } from 'pinia';

export const useLoadingBatchStore = defineStore('loadingBatch', {
  state: () => ({
    color: '',
    inkType: '',
    amount: 0,
    expirationDate: '',
    productionId: '',
    inkFormulaUrl: '',
    sdsUrl: '',
    sterilizationCertUrl: '',
    chemistryAnalysisUrl: '',
    microbiologicalAnalysisUrl: '',
  }),

  getters: {
  },

  actions: {
    resetLoadingBatch() {
      this.color = '';
      this.inkType = '';
      this.amount = 0;
      this.expirationDate = '';
      this.productionId = '';
      this.inkFormulaUrl = '';
      this.sdsUrl = '';
      this.sterilizationCertUrl = '';
      this.chemistryAnalysisUrl = '';
      this.microbiologicalAnalysisUrl = '';
    },
    initBatchLoading(data : {
      color: string
      inkType: string
      amount: number
    }) {
      this.color = data.color;
      this.inkType = data.inkType;
      this.amount = data.amount;
    }
  },
})
