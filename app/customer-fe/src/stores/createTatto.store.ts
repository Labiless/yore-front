import { defineStore } from 'pinia';

export const useCreateTattoStore = defineStore('createTattoo', {
    state: () => ({
        date: '',
        user: null,
        info: {
            name: '',
            surname: '',
            email: '',
            cf: '',
            country: '',
            city: '',
            street: '',
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
            this.info = {
                name: '',
                surname: '',
                cf: '',
                country: '',
                city: '',
                street: '',
                dataConsent: false,
                contractConsent: false,
            };
            this.kirbyDesay = {
                skinType: '',
                position: '',
                color: '',
                inkAmount: '',
                scars: '',
                inkLayers: '',
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
            return this.info.name.length > 0
                && this.info.surname.length > 0
                && this.info.cf.length > 0
                && this.info.country.length > 0
                && this.info.city.length > 0
                && this.info.street.length > 0
                && this.info.dataConsent
                && this.info.contractConsent
        },
        kirbyDesayValidation() {
            return this.kirbyDesay.skinType > 0
            && this.kirbyDesay.position > 0
            && this.kirbyDesay.color > 0
            && this.kirbyDesay.inkAmount > 0
            && this.kirbyDesay.scars > 0
            && this.kirbyDesay.inkLayers > 0
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
