import api from './api.service';

export const getTattoByUuid = async (uuid: string) => {
    const { data } = await api.get(`/tattoos/${uuid}`);
    return data;
};

export const tattooService = {
    getTattoByUuid,
};
