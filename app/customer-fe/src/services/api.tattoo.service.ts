import api from "./api.service";

export const createTattoo = async (createTattooData: any) => {
    const data = await api.post("/tattoos", createTattooData);
    return data.data;
};

export const getAllTattoos = async () => {
    const data = await api.get("/tattoos");
    return data.data;
}