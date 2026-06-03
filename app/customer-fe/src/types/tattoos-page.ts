export type TattooListFilter = 'all' | 'close' | 'active' | 'deletable';

export type TattoosPageResponse = {
    items: Record<string, unknown>[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
};
