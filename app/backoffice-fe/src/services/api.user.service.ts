import api from "./api.service";

export const createUser = async (userData: any) => {
    const data = await api.post("/users/create", userData);
    return data.data;
};

export const getAllUsers = async () => {
    const data = await api.get("/users");
    return data.data;
};

export const getUserByUuid = async (uuid: string) => {
    const data = await api.get(`/users/${uuid}`);
    return data.data;
};

export const updateUser = async (uuid: string, userData: Record<string, unknown>) => {
    const data = await api.patch(`/users/${uuid}`, userData);
    return data.data;
};

export const updateUserPassword = async (uuid: string, password: string) => {
    const data = await api.patch(`/users/${uuid}/password`, { password });
    return data.data;
};

export const deleteUser = async (uuid: string) => {
    const data = await api.delete(`/users/${uuid}`);
    return data.data;
};