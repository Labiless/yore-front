import { defineStore } from 'pinia';
import { getTattoosByUserUuidPage } from '@/services/api.tattoo.service';
import type { TattooListFilter } from '@/types/tattoos-page';

const PAGE_SIZE = 20;

export const useTatoosStore = defineStore('tattoos', {
  state: () => ({
    tattoos: [] as any[],
    tattoosTotal: 0,
    tattoosPage: 0,
    tattoosHasMore: true,
    tattoosListLoading: false,
    tattoosListFilter: 'all' as TattooListFilter,
  }),

  actions: {
    upsertTattoo(tattoo: any) {
      const index = this.tattoos.findIndex((t) => t.uuid === tattoo.uuid);
      if (index >= 0) {
        this.tattoos[index] = { ...this.tattoos[index], ...tattoo };
      } else {
        this.tattoos.unshift(tattoo);
        this.tattoos.sort((a: { id: number }, b: { id: number }) => b.id - a.id);
        this.tattoosTotal += 1;
      }
    },

    replaceTattooInList(tattoo: any) {
      this.tattoos = this.tattoos
        .map((t) => (t.uuid === tattoo.uuid ? { ...t, ...tattoo } : t))
        .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
    },

    removeTattooFromList(uuid: string) {
      const had = this.tattoos.some((t) => t.uuid === uuid);
      this.tattoos = this.tattoos.filter((t) => t.uuid !== uuid);
      if (had && this.tattoosTotal > 0) {
        this.tattoosTotal -= 1;
      }
    },

    async fetchTattoosPage(
      userUuid: string,
      options: { reset?: boolean; filter?: TattooListFilter } = {},
    ) {
      if (this.tattoosListLoading) return;
      if (!options.reset && !this.tattoosHasMore) return;

      const filter = options.filter ?? this.tattoosListFilter;
      if (options.reset) {
        this.tattoos = [];
        this.tattoosPage = 0;
        this.tattoosHasMore = true;
        this.tattoosListFilter = filter;
      }

      const nextPage = options.reset ? 1 : this.tattoosPage + 1;
      this.tattoosListLoading = true;
      try {
        const res = await getTattoosByUserUuidPage(userUuid, {
          page: nextPage,
          limit: PAGE_SIZE,
          filter,
        });
        if (options.reset) {
          this.tattoos = res.items;
        } else {
          const existing = new Set(this.tattoos.map((t) => t.uuid));
          for (const item of res.items) {
            if (!existing.has(item.uuid)) {
              this.tattoos.push(item);
            }
          }
        }
        this.tattoosPage = res.page;
        this.tattoosTotal = res.total;
        this.tattoosHasMore = res.hasMore;
      } finally {
        this.tattoosListLoading = false;
      }
    },
  },
});
