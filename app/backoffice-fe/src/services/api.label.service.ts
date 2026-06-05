import api from "./api.service";

export const createLabels = async (labelsData: any) => {
    const data = await api.post("/labels", labelsData);
    return data.data;
};

export const getAllBatches = async () => {
    const data = await api.get("/label-batches");
    return data.data;
};

export const getLabelByUuid = async (uuid: string) => {
    const data = await api.get(`labels/${uuid}`);
    return data.data;
}

export const getLabelsByTattooUuid = async (uuid: string) => {
    const data = await api.get(`labels/tattoo/${uuid}`);
    return data.data;
}

export const getLabelsByUser = async (uuid: string) => {
    const data = await api.get(`labels/users/${uuid}`);
    return data.data;
};

export const getLabelsByUserPage = async (
    uuid: string,
    params: { page: number; limit?: number; filter?: 'all' | 'available' | 'used' },
) => {
    const data = await api.get(`labels/users/${uuid}`, {
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
};

export const updateLabelByUuid = async (uuid: string, updateData: any) => {
    console.log(updateData);
    const data = await api.patch(`labels/${uuid}`, updateData);
    return data.data;
}


export const getBatchByUuid = async (uuid: string) => {
    const data = await api.get(`/labels/batch/${uuid}`);
    return data.data;
};

export const getBatchByUuidPage = async (
    batchId: string,
    params: { page: number; limit?: number; filter?: 'all' | 'available' | 'burned' },
) => {
    const data = await api.get(`/labels/batch/${batchId}`, {
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
};

export const getPrintFile = async (uuid: string) => {
    const data = await api.get(`/labels/pdf/${uuid}`);
    return data.data;
}

export const associateBatchToUser = async (batchId: string, userUuid: string) => {
    const data = await api.patch(`/labels/batch/${batchId}/associate-user`, { userUuid });
    return data.data;
};