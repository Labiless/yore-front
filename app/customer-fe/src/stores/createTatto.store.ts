import { defineStore } from 'pinia';
import {
    createEmptyDeclarations,
    DECLARATION_QUESTIONS,
    DECLARATION_ANSWER_KEYS,
    type TattooDeclarationsState,
    type DeclarationAnswerKey,
} from '@/constants/tattoo-declarations.config';
import { buildPhotoUrlArray, hasKirbyDesayData, syncTattooPhotos } from '@/constants/tattoo.config';
import { hasDeclarationsData } from '@/constants/tattoo-declarations.config';

export type TattooSectionKey =
    | 'info'
    | 'declarations'
    | 'kirbyDesay'
    | 'inks'
    | 'tattoo'
    | 'sign';

const emptySectionsConfirmed = (): Record<TattooSectionKey, boolean> => ({
    info: false,
    declarations: false,
    kirbyDesay: false,
    inks: false,
    tattoo: false,
    sign: false,
});

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
        sectionsConfirmed: emptySectionsConfirmed(),
        infoSnapshot: '',
        isHydrating: false,
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
            this.sectionsConfirmed = emptySectionsConfirmed();
            this.infoSnapshot = '';
            this.isHydrating = false;
        },
        setHydrating(value: boolean) {
            this.isHydrating = value;
        },
        canAccessSection(section: TattooSectionKey) {
            return section === 'info' || this.sectionsConfirmed.info;
        },
        serializeInfo() {
            return JSON.stringify(this.info);
        },
        captureInfoSnapshot() {
            this.infoSnapshot = this.serializeInfo();
        },
        infoChangedSinceSnapshot() {
            return this.infoSnapshot !== this.serializeInfo();
        },
        touchInfoSection() {
            if (
                this.sectionsConfirmed.info &&
                !this.isHydrating &&
                this.infoChangedSinceSnapshot()
            ) {
                this.sectionsConfirmed.info = false;
            }
        },
        confirmSection(section: TattooSectionKey) {
            this.sectionsConfirmed[section] = true;
            if (section === 'info') {
                this.captureInfoSnapshot();
            }
        },
        invalidateSection(section: TattooSectionKey) {
            if (this.isHydrating) return;
            this.sectionsConfirmed[section] = false;
        },
        infoSectionConfirmed() {
            return this.sectionsConfirmed.info;
        },
        declarationsSectionConfirmed() {
            return this.sectionsConfirmed.declarations;
        },
        kirbyDesaySectionConfirmed() {
            return this.sectionsConfirmed.kirbyDesay;
        },
        inksSectionConfirmed() {
            return this.sectionsConfirmed.inks;
        },
        tattooSectionConfirmed() {
            return this.sectionsConfirmed.tattoo;
        },
        signSectionConfirmed() {
            return this.sectionsConfirmed.sign;
        },
        syncSectionsConfirmedFromTattoo(tattoo: Record<string, unknown>) {
            const confirmed = emptySectionsConfirmed();
            if (this.customerUuid || tattoo.customerUuid) {
                confirmed.info = true;
            }
            if (hasDeclarationsData(tattoo)) {
                confirmed.declarations = true;
            }
            if (hasKirbyDesayData(tattoo)) {
                confirmed.kirbyDesay = true;
            }
            if (Array.isArray(tattoo.inks) && tattoo.inks.length > 0) {
                confirmed.inks = true;
            }
            if (this.tattooPhotoValidation()) {
                confirmed.tattoo = true;
            }
            if (this.signValidation()) {
                confirmed.sign = true;
            }
            this.sectionsConfirmed = confirmed;
            if (confirmed.info) {
                this.captureInfoSnapshot();
            }
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
            this.info.consent1 = !!customer.consent1;
            this.info.consent2 = !!customer.consent2;
            this.info.birthDate = customer.birthDate
                ? String(customer.birthDate).split('T')[0]
                : undefined;
            this.info.birthPlace = customer.birthPlace;
            this.info.streetNumber = customer.streetNumber;
            this.info.cap = customer.cap;
            this.info.province = customer.province;
        },
        allValidation() {
            return Object.values(this.sectionsConfirmed).every(Boolean);
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
            this.invalidateSection('declarations');
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
            this.invalidateSection('kirbyDesay');
        },
        inksValidation() {
            return this.inks.length > 0;
        },
        tattooPhotoValidation() {
            return (
                !!this.photoBeforeUrl &&
                !!this.photoAfterUrl &&
                !!this.tattooArtist?.trim()
            );
        },
        syncPhotosFromApi(photoUrl: string | string[] | null | undefined) {
            const { before, after } = syncTattooPhotos(photoUrl);
            this.photoBeforeUrl = before;
            this.photoAfterUrl = after;
        },
        buildPhotoUrlPayload(): string[] {
            return buildPhotoUrlArray(this.photoBeforeUrl, this.photoAfterUrl);
        },
        signValidation() {
            return !!this.customerSign && !!this.userSign;
        },
    },
});
