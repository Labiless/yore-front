import Tattoo from '@/components/createTattoo/Tattoo.vue';
import { defineStore } from 'pinia';

export const useCreateTattoStore = defineStore('createTattoo', {
    state: () => ({
        id: undefined,
        uuid: undefined,
        customerUuid: undefined,
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
            consent1: false,
            consent2: false,
            birthDate: undefined,
            birthPlace: undefined,
            streetNumber: undefined,
            cap: undefined,
            province: undefined,
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
        tattooArtist: undefined as string | undefined,
        photoUrl: undefined as string | undefined,
        customerSign: undefined,
        userSign: undefined
    }),

    getters: {

        certificateData: (state) => ({
            tattooId: String(state.id),
            date: undefined,
            inkType: undefined,
            inkColor: undefined,
            brand: 'Yore',
            codiceUnivoco: undefined,
            customerName: state.info.name,
            customerBirthDate: state.info.birthDate,
            customerCf: state.info.cf,
            customerAddress: state.info.address,
            inkBatchId: undefined,
            kirbySkinType: state.kirbyDesay.skinType,
            kirbyPosition: state.kirbyDesay.position,
            kirbyColor: state.kirbyDesay.color,
            kirbyInkAmount: state.kirbyDesay.inkAmount,
            kirbyScars: state.kirbyDesay.scars,
            kirbyInkLayers: state.kirbyDesay.inkLayers,
            sterilizationUrl: undefined,
            chemistryAnalysisUrl: undefined,
            microbiologicalAnalysisUrl: undefined,
            inkSds: undefined,
            inkFormulaUrl: undefined,
            customerSignUrl: state.customerSign,
            tattooArtistSignUrl: state.userSign,
            signPlace: undefined,
            tattooStudio: undefined,
            tattooArtist: state.tattooArtist,
            tattooCertificateNumber: undefined
        }),
        releaseFormData: (state) => ({
            date: undefined,
            customerName: `${state.info.name} ${state.info.surname}`,
            customerBirthDate: state.info.birthDate,
            customerBirthPlace: state.info.birthPlace,
            customerCity: state.info.city,
            customerAddress: state.info.address,
            customerStreetNumber: state.info.streetNumber,
            customerSignUrl: state.customerSign,
            signPlace: undefined,
        }),
        gdprData: (state) => ({
            date: undefined,
            customerName: `${state.info.name} ${state.info.surname}`,
            customerBirthDate: state.info.birthDate,
            customerBirthPlace: state.info.birthPlace,
            customerCity: state.info.city,
            customerAddress: state.info.address,
            customerStreetNumber: state.info.streetNumber,
            customerSignUrl: state.customerSign,
            signPlace: undefined,
        })
    },

    actions: {
        getDate() {
            return ''
        },        
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
                consent1: false,
                consent2: false,
                birthDate: undefined,
                birthPlace: undefined,
                streetNumber: undefined,
                cap: undefined,
                province: undefined,
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
            this.tattooArtist = undefined;
            this.photoUrl = undefined;
            this.customerSign = undefined;
            this.userSign = undefined;
        },
        initCustomer(customer: any) {
            this.customerUuid = customer.uuid;
            this.info.name = customer.name;
            this.info.surname = customer.surname;
            this.info.email = customer.email;
            this.info.cf = customer.cf;
            this.info.country = customer.country;
            this.info.city = customer.city;
            this.info.address = customer.address;
            this.info.consent1 = customer.consent1;
            this.info.consent2 = customer.consent2;
            this.info.birthDate = customer.birthDate
            this.info.birthPlace = customer.birthPlace;
            this.info.streetNumber = customer.streetNumber;
            this.info.cap = customer.cap;
            this.info.province = customer.province;
        },
        allValidation() {
            return this.infoValidation()
                && this.kirbyDesayValidation()
                && this.inksValidation()
                && this.tattooPhotoValidation()
                && this.signValidation();
        },
        infoValidation() {
            return this.info.name !== undefined
                && this.info.email !== undefined
                && this.info.surname !== undefined
                && this.info.cf !== undefined
                && this.info.country !== undefined
                && this.info.city !== undefined
                && this.info.address !== undefined
                && this.info.consent1
                && this.info.consent2
                && this.info.birthDate !== undefined
                && this.info.birthPlace !== undefined
                && this.info.streetNumber !== undefined
                && this.info.cap !== undefined
                && this.info.province !== undefined
        },
        addInfo(data: any) {
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
