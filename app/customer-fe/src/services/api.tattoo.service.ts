import api from "./api.service";
import { getCustomerByUuid } from "./api.customer.service";

export const createTattoo = async (createTattooData: any) => {
    const data = await api.post("/tattoos", createTattooData);
    return data.data;
};

export const getAllTattoos = async () => {
    const data = await api.get("/tattoos");
    for(let i = 0; i < data.data.length; i++){
        if(data.data[i].customerUuid){
            data.data[i].customer = await getCustomerByUuid(data.data[i].customerUuid);
        } 
    }
    return data.data;
}

export const getTattoosByUserUuid = async (userUuid : string) => {
    const data = await api.get("/tattoos/user/" + userUuid);
    return data.data;
}

export const getTattoByUuid = async (uuid: string) => {
    const data = await api.get(`/tattoos/${uuid}`);
    return data.data;
}

export const updateTattoo = async (uuid: string, updateData: any) => {
    console.log("Updating tattoo:", uuid, updateData);
    const data = await api.patch(`tattoos/${uuid}`, updateData);
    return data.data;
}

export const addImage = async (tattooUuid: string, img: any) => {
    const formData = new FormData();
    formData.append("file", img);
    const data = await api.post(`tattoos/img/${tattooUuid}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data.data;
}

export const generateContract = async(tattooUuid: string) => {
    const data = await updateTattoo(tattooUuid, {
        status: 'CLOSE',
    });
    return data.data;
}

export const saveSigns = async (tattooUuid : string, customerSign: string, userSign: string) => {
    const data = await api.post(`tattoos/sign/${tattooUuid}`, {
        customerSign,
        userSign
    });
    return data.data;
}

export const deleteTattoo = async (tattooUuid: string) => {
    const data = await api.delete(`tattoos/${tattooUuid}`);
    return data.data;
}