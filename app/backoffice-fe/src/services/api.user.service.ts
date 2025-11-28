import api from "./api.service";

export const createUser = async (amount: number, inkTypeUuid: string) => {
    const data = await api.post("/labels", {
        amount,
        inkTypeUuid
    });
    return data.data;
};

export const getAllUsers = async () => {
    const data = await api.get("/users");
    console.log(data);
    return data.data;
};

export const getUserByUuid = async (uuid: string) => {
    const data = await api.get(`labels/${uuid}`);
    return data.data;
}