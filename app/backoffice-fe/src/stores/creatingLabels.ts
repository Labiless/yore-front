import { defineStore } from 'pinia';

export const useCreatingLabelsStore = defineStore('creatingLabels', {
  state: () => ({
    color: '',
    inkType: '',
    inkTypeUuid: '',
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
    resetCreatingLabels() {
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
    initLabelsCreation(data : {
      color: string,
      inkType: string,
      inkTypeUuid: string,
      amount: number,
    }) {
      this.color = data.color;
      this.inkType = data.inkType;
      this.amount = data.amount;
      this.inkTypeUuid = data.inkTypeUuid;
    }
  },
})
