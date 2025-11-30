import { defineStore } from 'pinia';

export const useCreateUserStore = defineStore('createUser', {
    state: () => ({
        email: '',
        password: '',
        legalForm: '',
        businessName: '',
        cf: '',
        piva: '',
        pecMail: '',
        taxCode: '',
        fePecAddress: '',
        address: '',
        city: '',
        province: '',
        cap: '',
        country: '',
        phone: '',
        consent: false
    }),

    getters: {
    },

    actions: {
        getAllData() {
            return {
                email: this.email,
                password: this.password,
                legalForm: this.legalForm,
                businessName: this.businessName,
                cf: this.cf,
                piva: this.piva,
                pecMail: this.pecMail,
                taxCode: this.taxCode,
                fePecAddress: this.fePecAddress,
                address: this.address,
                city: this.city,
                province: this.province,
                cap: this.cap,
                country: this.country,
                phone: this.phone,
                consent: this.consent,
            }
        },
        resetCreateUser() {
            this.email = '';
            this.password = '';
            this.legalForm = '';
            this.businessName = '';
            this.cf = '';
            this.piva = '';
            this.pecMail = '';
            this.taxCode = '';
            this.fePecAddress = '';
            this.address = '';
            this.city = '';
            this.province = '';
            this.cap = '';
            this.country = '';
            this.phone = '';
            this.consent = false;
        }
    },
})
