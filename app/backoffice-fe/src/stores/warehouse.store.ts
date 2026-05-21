import { defineStore } from 'pinia';
import { getAllBatches } from '@/services/api.ink.service';
import { getAvailableInksByType, getInkTypes } from '@/services/api.ink.service';

export const useWharehouseStore = defineStore('warehouse', {
  state: () => ({
    allBatches: [] as any[],
    warehouse: [] as any[],
    batchUuid: '',
    batchData: [] as any[],
    inkUuid: '',
    inkData: {} as Record<string, unknown>,
  }),

  actions: {
    resetSearch() {
      this.batchUuid = '';
      this.batchData = [];
      this.inkUuid = '';
      this.inkData = {};
    },

    async refreshWarehouse() {
      const inkTypes = await getInkTypes();
      const warehouse: any[] = [];

      for (const inkType of inkTypes) {
        const availableInks = await getAvailableInksByType(inkType.uuid);
        if (availableInks.length > 0) {
          warehouse.push({
            ...inkType,
            amount: availableInks.length,
          });
        }
      }

      this.warehouse = warehouse;
      this.allBatches = await getAllBatches();
    },
  },
});
