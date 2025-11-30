import api from "./api.service";

export const createUser = async (userData: any) => {
    const data = await api.post("/users/create", userData);
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