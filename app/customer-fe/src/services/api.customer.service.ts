import api from "./api.service";

export const createCustomer = async (customerData: any) => {
    const data = await api.post("/customers", customerData);
    return data.data;
};