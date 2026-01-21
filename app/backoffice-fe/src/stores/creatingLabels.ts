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
    userUuid: '',
  }),

  getters: {
  },

  actions: {
    resetCreatingLabels() {
      this.color = '';
      this.inkType = '';
      this.inkTypeUuid = '';
      this.amount = 0;
      this.expirationDate = '';
      this.productionId = '';
      this.inkFormulaUrl = '';
      this.sdsUrl = '';
      this.sterilizationCertUrl = '';
      this.chemistryAnalysisUrl = '';
      this.microbiologicalAnalysisUrl = '';
      this.userUuid = '';
    },
    initLabelsCreation(data : {
      inkTypeUuid: string,
      amount: number,
    }) {
      this.amount = data.amount;
      this.inkTypeUuid = data.inkTypeUuid;
    }
  },
})
