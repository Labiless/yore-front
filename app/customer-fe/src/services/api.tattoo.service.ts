import api from "./api.service";

export const createTattoo = async (createTattooData: any) => {
    const data = await api.post("/tattoos", createTattooData);
    return data.data;
};

export const getAllTattoos = async () => {
    const data = await api.get("/tattoos");
    return data.data;
}

export const getTattoByUuid = async (uuid: string) => {
    const data = await api.get(`/tattoos/${uuid}`);
    return data.data;
}

export const updateTattoo = async (uuid: string, updateData: any) => {
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
    await updateTattoo(tattooUuid, {
        photoUrl: `http://localhost:3000/public/img/tattoo/${tattooUuid}.png`
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
    await updateTattoo(tattooUuid, {
        customerSign: data.data.customerUrl,
        userSign: data.data.userUrl, 
    });
    return data.data;
}