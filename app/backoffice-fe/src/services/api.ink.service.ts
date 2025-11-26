import api from "./api.service";

export const getInkTypes = async () => {
    const data = await api.get("/ink-types");
    return data.data;
};

export const getInksByType = async () => {
    const data = await api.get("/inks/types");
    return data.data;
}

export const loadInks = async (data: any) => {
    const res  = await api.post("/inks/load", data);
    return res.data;
}

export const getAllBatches = async () => {
    const res  = await api.get("/ink-batches");
    return res.data;
}

export const getBatchByUuid = async (batchId : string) => {
    const res = await api.get(`inks/batch/${batchId}`);
    return res.data;
}

export const getInkByUuid = async (uuid: string) => {
    const data = await api.get(`/inks/${uuid}`);
    return data.data;
};