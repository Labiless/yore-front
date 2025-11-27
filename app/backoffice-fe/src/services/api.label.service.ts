import api from "./api.service";

export const createLabels = async (amount: number, inkTypeUuid: string) => {
    const data = await api.post("/labels", {
        amount,
        inkTypeUuid
    });
    return data.data;
};

export const getAllBatches = async () => {
    const data = await api.get("/label-batches");
    return data.data;
};

export const getLabelsByBatch = async (uuid: string) => {
    const data = await api.get(`/labels/batch/${uuid}`);
    return data.data;
};

export const getPrintFile = async (uuid: string) => {
    const data = await api.post(`/labels/pdf`,{
        batchId: uuid
    });
    return data.data;
}