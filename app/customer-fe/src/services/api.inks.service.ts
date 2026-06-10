import api from './api.service';

export const apiLabelService = {
    getLabelByUuid: async (uuid: string) => {
        const data = await api.get(`labels/${uuid}`);
        return data.data;
    },

    updateLabelByUuid: async (uuid: string, updateData: any) => {
        const data = await api.patch(`labels/${uuid}`, updateData);
        return data.data;
    },

    getLabelsByTattooUuid: async (uuid: string) => {
        const data = await api.get(`labels/tattoo/${uuid}`);
        return data.data;
    },

    getLabelsByUserPage: async (
        userUuid: string,
        params: { page: number; limit?: number; filter?: 'all' | 'available' | 'used' },
    ) => {
        const data = await api.get(`labels/users/${userUuid}`, {
            params: {
                page: params.page,
                limit: params.limit ?? 20,
                filter: params.filter ?? 'all',
            },
        });
        return data.data as {
            items: any[];
            total: number;
            page: number;
            limit: number;
            hasMore: boolean;
        };
    },
};

export const inkLabelService = {
    getInkByUuid: async (uuid: string) => {
        const data = await api.get(`/inks/${uuid}`);
        return data.data;
    },

    getInkTypes: async () => {
        const data = await api.get('/ink-types');
        return data.data;
    },
};
