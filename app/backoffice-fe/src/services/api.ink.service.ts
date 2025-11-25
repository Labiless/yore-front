import api from "./api.service";

export const getInkTypes = async () => {
    const data = await api.get("/ink-types");
    return data.data;
};

export const loadInks = async (data: any) => {
    const res  = await api.post("/inks/load", data);
    return res.data;
}

export const getAllBatches = async () => {
    const res  = await api.get("/ink-batches");
    return res.data;
}