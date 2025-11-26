import api from "./api.service";

export const createLabels = async () => {
    const data = await api.get("/ink-types");
    return data.data;
};