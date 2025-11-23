import api from "./api.service";

export const getInkTypes = async () => {
    const data = await api.get("/ink-types");
    return data.data;
};