import api from './api.service';

export const getCustomerByUuid = async (uuid: string) => {
    const { data } = await api.get(`customers/${uuid}`);
    return data;
};
