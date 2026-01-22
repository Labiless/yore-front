import api from "./api.service";

export const createCustomer = async (customerData: any) => {
    const data = await api.post("/customers", customerData);
    return data.data;
};

export const getCustomerByUuid = async (uuid: string) => {
    const data = await api.get(`customers/${uuid}`);
    return data.data;
}

export const updateCustomer = async (uuid: string, customerData: any) => {
    const data = await api.patch(`customers/${uuid}`, customerData);
    return data.data;
}