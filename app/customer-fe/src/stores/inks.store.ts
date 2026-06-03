import { defineStore } from 'pinia';
import { apiLabelService } from '@/services/api.inks.service';

const PAGE_SIZE = 20;

export const useInksStore = defineStore('inks', {
  state: () => ({
    availableCount: 0,
    usedInks: [] as any[],
    usedInksTotal: 0,
    usedInksPage: 0,
    usedInksHasMore: true,
    usedInksLoading: false,
  }),

  actions: {
    async fetchAvailableCount(userUuid: string) {
      const res = await apiLabelService.getLabelsByUserPage(userUuid, {
        page: 1,
        limit: 1,
        filter: 'available',
      });
      this.availableCount = res.total;
    },

    async fetchUsedInksPage(userUuid: string, options: { reset?: boolean } = {}) {
      if (this.usedInksLoading) return;
      if (!options.reset && !this.usedInksHasMore) return;

      if (options.reset) {
        this.usedInks = [];
        this.usedInksPage = 0;
        this.usedInksHasMore = true;
      }

      const nextPage = options.reset ? 1 : this.usedInksPage + 1;
      this.usedInksLoading = true;
      try {
        const res = await apiLabelService.getLabelsByUserPage(userUuid, {
          page: nextPage,
          limit: PAGE_SIZE,
          filter: 'used',
        });
        if (options.reset) {
          this.usedInks = res.items;
        } else {
          const existing = new Set(this.usedInks.map((ink) => ink.uuid));
          for (const item of res.items) {
            if (!existing.has(item.uuid)) {
              this.usedInks.push(item);
            }
          }
        }
        this.usedInksPage = res.page;
        this.usedInksTotal = res.total;
        this.usedInksHasMore = res.hasMore;
      } finally {
        this.usedInksLoading = false;
      }
    },
  },
});
