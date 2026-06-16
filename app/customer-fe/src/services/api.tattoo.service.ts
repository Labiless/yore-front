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

export const getTattoosByUserUuid = async (userUuid: string) => {
    const data = await api.get('/tattoos/user/' + userUuid);
    return data.data;
};

export const getTattoosByUserUuidPage = async (
    userUuid: string,
    params: { page: number; limit?: number; filter?: string },
) => {
    const data = await api.get(`/tattoos/user/${userUuid}`, {
        params: {
            page: params.page,
            limit: params.limit ?? 20,
            filter: params.filter ?? 'all',
        },
    });
    return data.data as {
        items: any[];
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    };
};

export const getTattoByUuid = async (uuid: string) => {
    const data = await api.get(`/tattoos/${uuid}`);
    return data.data;
}

export const getTattooConfig = async () => {
    const data = await api.get('/tattoos/config');
    return data.data as {
        inkColors: string[];
        tattooStyles: string[];
        tattooTypes: string[];
    };
}

export const updateTattoo = async (uuid: string, updateData: any) => {
    console.log("Updating tattoo:", uuid, updateData);
    const data = await api.patch(`tattoos/${uuid}`, updateData);
    return data.data;
}

export const addImage = async (tattooUuid: string, img: any, slot: 'before' | 'after') => {
    const formData = new FormData();
    formData.append("file", img);
    const data = await api.post(`tattoos/img/${tattooUuid}?slot=${slot}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data.data;
}

export const closeTattoo = async(tattooUuid: string) => {
    const data = await updateTattoo(tattooUuid, {
        status: 'CLOSE',
    });
    return data.data;
}

export const createInformedConsentPdf = async (tattooUuid: string, consentData: any) => {
    const data = await api.post(`tattoos/pdf/consent/${tattooUuid}`, consentData);
    return data.data;
}

export const createCertificatePdf = async(tattooUuid: string, certificateData : any) => {
    const data = await api.post(`tattoos/pdf/certificate/${tattooUuid}`, certificateData);
    return data.data;
}

export const finalizeTattoo = async (tattooUuid: string, payload: {
    customerEmail: string;
    customerName: string;
    studioName?: string;
    certificate: Record<string, unknown>;
    consent: Record<string, unknown>;
}) => {
    const data = await api.post(`tattoos/finalize/${tattooUuid}`, payload);
    return data.data as {
        certificateUrl: string;
        consentUrl: string;
        emailSent: boolean;
    };
}

export const closeTattooWithEmail = async (tattooUuid: string, payload: {
    customerEmail: string;
    customerName: string;
    studioName?: string;
}) => {
    const data = await api.post(`tattoos/close/${tattooUuid}`, payload);
    return data.data as { emailSent: boolean; emailError: string | null };
}

export const saveSigns = async (tattooUuid: string, customerSign: string) => {
    const data = await api.post(`tattoos/sign/${tattooUuid}`, { customerSign });
    return data.data;
}

export const deleteTattoo = async (tattooUuid: string) => {
    const data = await api.delete(`tattoos/${tattooUuid}`);
    return data.data;
}