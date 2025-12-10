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

export const getLabelsByUser = async (uuid: string) => {
    const data = await api.get(`labels/users/${uuid}`);
    return data.data;
}

export const updateLabelByUuid = async (uuid: string, updateData: any) => {
    console.log(updateData);
    const data = await api.patch(`labels/${uuid}`, updateData);
    return data.data;
}


export const getBatchByUuid = async (uuid: string) => {
    const data = await api.get(`/labels/batch/${uuid}`);
    return data.data;
};

export const getPrintFile = async (uuid: string) => {
    const data = await api.get(`/labels/pdf/${uuid}`);
    return data.data;
}