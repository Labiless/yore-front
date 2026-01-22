import { defineStore } from 'pinia';

export const useCreateTattoStore = defineStore('createTattoo', {
    state: () => ({
        uuid: undefined as string | undefined,
        customerUuid: undefined as string | undefined,
        date: undefined as string | undefined,
        user: undefined,
        info: {
            name: undefined,
            surname: undefined,
            email: undefined,
            cf: undefined,
            country: undefined,
            city: undefined,
            address: undefined,
            dataConsent: false,
            contractConsent: false,
        },
        kirbyDesay: {
            skinType: 0,
            position: 0,
            color: 0,
            inkAmount: 0,
            scars: 0,
            inkLayers: 0,
        },
        inks: [],
        photoUrl: undefined,
        customerSign: undefined,
        userSign: undefined
    }),

    getters: {
        //title: (state) => state.title,
    },

    actions: {
        resetTattoo() {
            this.uuid = undefined;
            this.customerUuid = undefined;
            this.date = undefined;
            this.user = undefined;
            this.info = {
                name: undefined,
                email: undefined,
                surname: undefined,
                cf: undefined,
                country: undefined,
                city: undefined,
                address: undefined,
                dataConsent: false,
                contractConsent: false,
            };
            this.kirbyDesay = {
                skinType: 0,
                position: 0,
                color: 0,
                inkAmount: 0,
                scars: 0,
                inkLayers: 0,
            };
            this.inks = [];
            this.photoUrl = undefined;
            this.customerSign = undefined;
            this.userSign = undefined;
        },
        infoValidation() {
            return this.info.cf
                && this.info.city
                && this.info.contractConsent
                && this.info.country
                && this.info.dataConsent
                && this.info.email
                && this.info.address
                && this.info.surname
        },
        addInfo(data: any){
            this.uuid = data.uuid;
            this.customerUuid = data.customerUuid;
            this.info = {
                name: data.name,
                email: data.email,
                surname: data.surname,
                cf: data.cf,
                country: data.country,
                city: data.city,
                address: data.address,
                dataConsent: data.dataConsent,
                contractConsent: data.contractConsent,
            };
        },
        kirbyDesayValidation() {
            return this.kirbyDesay.skinType > 0
                && this.kirbyDesay.position > 0
                && this.kirbyDesay.color > 0
                && this.kirbyDesay.inkAmount > 0
                && this.kirbyDesay.scars > 0
                && this.kirbyDesay.inkLayers > 0
        },
        updateKirbyDesay(data: any) {
            this.kirbyDesay.color = data.color;
            this.kirbyDesay.inkAmount = data.inkAmount;
            this.kirbyDesay.inkLayers = data.inkLayers;
            this.kirbyDesay.position = data.position;
            this.kirbyDesay.scars = data.scars;
            this.kirbyDesay.skinType = data.skinType;
        },
        inksValidation() {
            return this.inks.length > 0
        },
        tattooPhotoValidation() {
            return this.photoUrl
        },
        signValidation() {
            return this.customerSign
                && this.userSign
        }
    },
})
