import { defineStore } from 'pinia';
import {
    createEmptyDeclarations,
    DECLARATION_QUESTIONS,
    DECLARATION_ANSWER_KEYS,
    type TattooDeclarationsState,
    type DeclarationAnswerKey,
} from '@/constants/tattoo-declarations.config';

export const useCreateTattoStore = defineStore('createTattoo', {
    state: () => ({
        id: undefined as number | undefined,
        uuid: undefined as string | undefined,
        customerUuid: undefined as string | undefined,
        date: undefined,
        user: undefined,
        info: {
            name: undefined as string | undefined,
            surname: undefined as string | undefined,
            email: undefined as string | undefined,
            cf: undefined as string | undefined,
            country: undefined as string | undefined,
            city: undefined as string | undefined,
            address: undefined as string | undefined,
            consent1: false,
            consent2: false,
            birthDate: undefined as string | undefined,
            birthPlace: undefined as string | undefined,
            streetNumber: undefined as string | undefined,
            cap: undefined as string | undefined,
            province: undefined as string | undefined,
        },
        declarations: createEmptyDeclarations(),
        kirbyDesay: {
            skinType: 0,
            position: 0,
            color: '' as string,
            tattooStyle: '' as string,
            tattooType: '' as string,
        },
        inks: [] as string[],
        tattooArtist: undefined as string | undefined,
        photoBeforeUrl: undefined as string | undefined,
        photoAfterUrl: undefined as string | undefined,
        customerSign: undefined as string | undefined,
        userSign: undefined as string | undefined,
    }),

    getters: {
        certificateData: (state) => ({
            tattooId: String(state.id),
            date: undefined,
            inkType: undefined,
            inkColor: undefined,
            brand: 'Yore',
            codiceUnivoco: undefined,
            customerName: [state.info.name, state.info.surname].filter(Boolean).join(' '),
            customerBirthDate: state.info.birthDate,
            customerCf: state.info.cf,
            customerAddress: state.info.address,
            inkBatchId: undefined,
            kirbySkinType: state.kirbyDesay.skinType,
            kirbyPosition: state.kirbyDesay.position,
            kirbyColor: state.kirbyDesay.color,
            kirbyTattooStyle: state.kirbyDesay.tattooStyle,
            kirbyTattooType: state.kirbyDesay.tattooType,
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
            tattooCertificateNumber: undefined,
        }),
        informedConsentData: (state) => ({
            date: undefined,
            customerFirstName: state.info.name,
            customerLastName: state.info.surname,
            customerName: [state.info.name, state.info.surname].filter(Boolean).join(' '),
            customerBirthDate: state.info.birthDate,
            customerBirthPlace: state.info.birthPlace,
            customerCity: state.info.city,
            customerCap: state.info.cap,
            customerProvince: state.info.province,
            customerAddress: state.info.address,
            customerStreetNumber: state.info.streetNumber,
            customerEmail: state.info.email,
            customerCf: state.info.cf,
            customerSignUrl: state.customerSign,
            signPlace: undefined,
            ...state.declarations,
        }),
    },

    actions: {
        getDate() {
            return '';
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
            this.declarations = createEmptyDeclarations();
            this.kirbyDesay = {
                skinType: 0,
                position: 0,
                color: '',
                tattooStyle: '',
                tattooType: '',
            };
            this.inks = [];
            this.tattooArtist = undefined;
            this.photoBeforeUrl = undefined;
            this.photoAfterUrl = undefined;
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
            this.info.birthDate = customer.birthDate;
            this.info.birthPlace = customer.birthPlace;
            this.info.streetNumber = customer.streetNumber;
            this.info.cap = customer.cap;
            this.info.province = customer.province;
        },
        allValidation() {
            return (
                this.infoValidation() &&
                this.declarationsValidation() &&
                this.kirbyDesayValidation() &&
                this.inksValidation() &&
                this.tattooPhotoValidation() &&
                this.signValidation()
            );
        },
        infoValidation() {
            return (
                this.info.name !== undefined &&
                this.info.email !== undefined &&
                this.info.surname !== undefined &&
                this.info.cf !== undefined &&
                this.info.country !== undefined &&
                this.info.city !== undefined &&
                this.info.address !== undefined &&
                this.info.consent1 &&
                this.info.consent2 &&
                this.info.birthDate !== undefined &&
                this.info.birthPlace !== undefined &&
                this.info.streetNumber !== undefined &&
                this.info.cap !== undefined &&
                this.info.province !== undefined
            );
        },
        addInfo(data: any) {
            this.uuid = data.uuid;
            this.customerUuid = data.customerUuid;
            this.info.name = data.name;
            this.info.email = data.email;
            this.info.surname = data.surname;
            this.info.cf = data.cf;
            this.info.country = data.country;
            this.info.city = data.city;
            this.info.address = data.address;
            this.info.consent1 = data.consent1;
            this.info.consent2 = data.consent2;
        },
        declarationsValidation() {
            for (const key of DECLARATION_ANSWER_KEYS) {
                if (this.declarations[key] === null) return false;
            }
            for (const q of DECLARATION_QUESTIONS) {
                if (q.detailKey && this.declarations[q.key] === true) {
                    const detail = this.declarations[q.detailKey]?.trim();
                    if (!detail) return false;
                }
            }
            return true;
        },
        buildDeclarationsPayload() {
            const payload: Record<string, boolean | string> = {};
            for (const key of DECLARATION_ANSWER_KEYS) {
                payload[key] = this.declarations[key] as boolean;
            }
            if (this.declarations.declSkinDiseases === true) {
                payload.declSkinDiseasesDetail =
                    this.declarations.declSkinDiseasesDetail.trim();
            }
            if (this.declarations.declPsoriasisFamily === true) {
                payload.declPsoriasisFamilyDetail =
                    this.declarations.declPsoriasisFamilyDetail.trim();
            }
            const notes = this.declarations.declMedicalConditionsNotes.trim();
            if (notes.length > 0) {
                payload.declMedicalConditionsNotes = notes;
            }
            return payload;
        },
        updateDeclarationsFromApi(data: Record<string, unknown>) {
            for (const key of DECLARATION_ANSWER_KEYS) {
                const value = data[key];
                if (value === true || value === false) {
                    (this.declarations as TattooDeclarationsState)[key] = value;
                }
            }
            if (typeof data.declSkinDiseasesDetail === 'string') {
                this.declarations.declSkinDiseasesDetail = data.declSkinDiseasesDetail;
            }
            if (typeof data.declPsoriasisFamilyDetail === 'string') {
                this.declarations.declPsoriasisFamilyDetail = data.declPsoriasisFamilyDetail;
            }
            if (typeof data.declMedicalConditionsNotes === 'string') {
                this.declarations.declMedicalConditionsNotes = data.declMedicalConditionsNotes;
            } else if (data.declMedicalConditionsNotes == null) {
                this.declarations.declMedicalConditionsNotes = '';
            }
        },
        setDeclarationAnswer(key: DeclarationAnswerKey, value: boolean) {
            this.declarations[key] = value;
            const question = DECLARATION_QUESTIONS.find((q) => q.key === key);
            if (question?.detailKey && value === false) {
                this.declarations[question.detailKey] = '';
            }
        },
        kirbyDesayValidation() {
            return (
                this.kirbyDesay.skinType > 0 &&
                this.kirbyDesay.position > 0 &&
                !!this.kirbyDesay.color &&
                !!this.kirbyDesay.tattooStyle &&
                !!this.kirbyDesay.tattooType
            );
        },
        updateKirbyDesay(data: {
            skinType?: number | null;
            position?: number | null;
            color?: string | null;
            tattooStyle?: string | null;
            tattooType?: string | null;
        }) {
            if (data.skinType != null) this.kirbyDesay.skinType = data.skinType;
            if (data.position != null) this.kirbyDesay.position = data.position;
            if (data.color) this.kirbyDesay.color = data.color;
            if (data.tattooStyle) this.kirbyDesay.tattooStyle = data.tattooStyle;
            if (data.tattooType) this.kirbyDesay.tattooType = data.tattooType;
        },
        inksValidation() {
            return this.inks.length > 0;
        },
        tattooPhotoValidation() {
            return !!this.photoBeforeUrl && !!this.photoAfterUrl && !!this.tattooArtist;
        },
        syncPhotosFromApi(photoUrl: string | string[] | null | undefined) {
            const photos = Array.isArray(photoUrl) ? photoUrl : photoUrl ? [photoUrl] : [];
            this.photoBeforeUrl = photos[0];
            this.photoAfterUrl = photos[1];
        },
        buildPhotoUrlPayload(): string[] {
            return [this.photoBeforeUrl, this.photoAfterUrl].filter(
                (url): url is string => !!url,
            );
        },
        signValidation() {
            return !!this.customerSign && !!this.userSign;
        },
    },
});
