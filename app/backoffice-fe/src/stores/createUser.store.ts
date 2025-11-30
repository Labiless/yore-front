import { defineStore } from 'pinia';

export const useCreateUserStore = defineStore('createUser', {
    state: () => ({
        legalForm: '',
        businessName: '',
        cf: '',
        piva: '',
        pecMail: '',
        taxCode: '',
        fePecAddress: '',
        email: '',
        address: '',
        city: '',
        province: '', 
        cap: '',
        country: '',
        consent: false
    }),

    getters: {
        //title: (state) => state.title,
    },

    actions: {
        resetLoadingBatch() {

        }
    },
})
