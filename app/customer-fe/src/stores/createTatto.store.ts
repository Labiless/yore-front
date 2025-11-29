import { defineStore } from 'pinia';

export const useCreateTattoStore = defineStore('createTattoo', {
    state: () => ({
        date: '',
        user: null,
        info: {
            name: '',
            surname: '',
            cf: '',
            country: '',
            city: '',
            street: '',
            dataConsent: false,
            contractConsent: false,
        },
        kirbyDesay: {
            skinType: '',
            position: '',
            color: '',
            inkAmount: '',
            scars: '',
            inkLayers: '',
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
            return this.kirbyDesay.skinType.length > 0
            && this.kirbyDesay.position.length > 0
            && this.kirbyDesay.color.length > 0
            && this.kirbyDesay.inkAmount.length > 0
            && this.kirbyDesay.scars.length > 0
            && this.kirbyDesay.inkLayers.length > 0
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
