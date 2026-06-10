import api from './api.service';

export const getUserByUuid = async (uuid: string) => {
    const { data } = await api.get(`/users/${uuid}`);
    return data;
};

export const userService = {
    getUserByUuid,
};
