import { defineStore } from 'pinia';

export const useCreateTattoStore = defineStore('createTattoo', {
    state: () => ({
        uuid: undefined,
        date: undefined,
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
        tattoo: {
            photo: []
        },
        sign: {
            customer: null,
            tattoArtist: null,
        },
    }),

    getters: {
        //title: (state) => state.title,
    },

    actions: {
        resetTattoo() {
            this.uuid = undefined;
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
            this.tattoo = {
                photo: []
            };
            this.sign = {
                customer: null,
                tattoArtist: null,
            };
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
            return this.tattoo.photo.length > 0
        },
        signValidation() {
            return this.sign.customer
                && this.sign.tattoArtist
        }
    },
})
