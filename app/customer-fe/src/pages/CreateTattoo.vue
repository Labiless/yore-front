<template>
    <div class="w-full min-w-0">
        <Button @click="submit" :disabled="!createTattoStore.allValidation()" class="mb-6 w-full h-12">Genera
            certificato</Button>
        <p class="flex text-xl font-bold w-fit mx-auto">
            <Calendar class="mr-2 shrink-0" /> 01/01/2026
        </p>
        <p class="text-sm text-center text-gray-600">INK STUDIO - Tattoo studio</p>
        <div id="steps" class="py-4 flex flex-wrap justify-center gap-2 sm:gap-3 max-w-sm mx-auto">
            <Button
                :disabled="!createTattoStore.canAccessSection(status.name)"
                @click="goToStep(status.name)"
                v-for="status in allSteps"
                class="w-10 h-14 shrink-0 bg-white flex flex-col"
                :class="`${activeStep === status.name ? 'border-2 border-blue-500' : ''}`">
                <ClipboardList class="text-black" v-if="status.name === 'info'" />
                <FileText class="text-black" v-if="status.name === 'declarations'" />
                <PersonStanding class="text-black" v-if="status.name === 'kirbyDesay'" />
                <Droplet class="text-black" v-if="status.name === 'ink'" />
                <Brush class="text-black" v-if="status.name === 'tattoo'" />
                <PenTool class="text-black" v-if="status.name === 'sign'" />
                <div class="rounded-full bg-green-700 p-1" :class="`${status.validation() ? '' : 'bg-amber-500!'}`">
                </div>
            </Button>
        </div>
        <div id="info" class="flex flex-col gap-4 pt-6 pb-8 min-w-0" v-if="activeStep === 'info'">
            <CustomerInfo />
        </div>
        <div id="declarations" class="flex flex-col gap-4 pb-8 pt-6 min-w-0"
            v-if="activeStep === 'declarations' && createTattoStore.infoSectionConfirmed()">
            <Declarations />
        </div>
        <div id="kirbyDesay" class="flex flex-col gap-4 pb-8 pt-6 min-w-0"
            v-if="activeStep === 'kirbyDesay' && createTattoStore.infoSectionConfirmed()">
            <KirbyDesay />
        </div>
        <div id="ink" class="flex flex-col gap-4 pb-8 pt-6 min-w-0"
            v-if="activeStep === 'ink' && createTattoStore.infoSectionConfirmed()">
            <Inks />
        </div>
        <div id="tattoo" class="flex flex-col gap-4 pb-8 pt-6 min-w-0"
            v-if="activeStep === 'tattoo' && createTattoStore.infoSectionConfirmed()">
            <Tattoo />
        </div>
        <div id="sign" class="flex flex-col gap-4 pb-8 pt-6 min-w-0"
            v-if="activeStep === 'sign' && createTattoStore.infoSectionConfirmed()">
            <Signs />
        </div>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import CustomerInfo from '@/components/createTattoo/CustomerInfo.vue';
import Declarations from '@/components/createTattoo/Declarations.vue';
import KirbyDesay from '@/components/createTattoo/KirbyDesay.vue';
import Inks from '@/components/createTattoo/Inks.vue';
import Tattoo from '@/components/createTattoo/Tattoo.vue';
import Signs from '@/components/createTattoo/Signs.vue';
import { Brush, Calendar, ClipboardList, Droplet, FileText, PenTool, PersonStanding } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCreateTattoStore, type TattooSectionKey } from '@/stores/createTatto.store';
import { getTattoByUuid, closeTattoo, finalizeTattoo } from '@/services/api.tattoo.service';
import { getCustomerByUuid } from '@/services/api.customer.service';
import { hasKirbyDesayData } from '@/constants/tattoo.config';
import { hasDeclarationsData } from '@/constants/tattoo-declarations.config';
import { apiLabelService, inkLabelService } from '@/services/api.inks.service';
import router from '@/router';
import { useUserStore } from '@/stores/user.store';
import { useTatoosStore } from '@/stores/tattoos.store';
import { userService } from '@/services/api.user.service';

const uiStore = useUiStore();
const createTattoStore = useCreateTattoStore();
const tattooStore = useTatoosStore();
const userStore = useUserStore();
const route = useRoute();

const activeStep = ref('info');
const skipRouteWatch = ref(true);

const goToStep = (step: string) => {
    if (!createTattoStore.canAccessSection(step as TattooSectionKey)) {
        uiStore.setToast('Inserisci e conferma prima i dati del tatuato', 'error');
        activeStep.value = 'info';
        return;
    }
    activeStep.value = step;
};

const allSteps = [
    { name: 'info', validation: createTattoStore.infoSectionConfirmed },
    { name: 'declarations', validation: createTattoStore.declarationsSectionConfirmed },
    { name: 'kirbyDesay', validation: createTattoStore.kirbyDesaySectionConfirmed },
    { name: 'ink', validation: createTattoStore.inksSectionConfirmed },
    { name: 'tattoo', validation: createTattoStore.tattooSectionConfirmed },
    { name: 'sign', validation: createTattoStore.signSectionConfirmed },
];

const refreshStudioProfile = async () => {
    const profile = await userService.getUserByUuid(userStore.getUiid);
    userStore.init(profile);
};

const studioSignPlace = () => (userStore.city ?? '').trim();
const studioName = () =>
    (userStore.businessName ?? '').trim() || (userStore.email ?? '').trim() || 'Studio';

const studioAddress = () => {
    const cityLine = [userStore.cap, userStore.city, userStore.province]
        .map((part) => (part ?? '').trim())
        .filter(Boolean)
        .join(' ');
    return [
        (userStore.address ?? '').trim(),
        cityLine,
        (userStore.country ?? '').trim(),
    ].filter(Boolean).join(', ');
};

const getRouteTattooUuid = (): string => {
    const tattooUuid = route.params.tattooUuid;
    return typeof tattooUuid === 'string' ? tattooUuid : '';
};

const applyTattooToStore = async (tattoo: Awaited<ReturnType<typeof getTattoByUuid>>) => {
    createTattoStore.uuid = tattoo.uuid;
    createTattoStore.id = tattoo.id;
    if (tattoo.customerUuid) {
        const customer = await getCustomerByUuid(tattoo.customerUuid);
        createTattoStore.initCustomer(customer);
    }
    createTattoStore.inks = tattoo.inks ?? [];
    if (hasDeclarationsData(tattoo)) {
        createTattoStore.updateDeclarationsFromApi(tattoo);
    }
    if (hasKirbyDesayData(tattoo)) {
        createTattoStore.updateKirbyDesay({
            skinType: tattoo.skinType,
            position: tattoo.position,
            color: tattoo.color,
            tattooStyle: tattoo.tattooStyle,
            tattooType: tattoo.tattooType,
        });
    }
    createTattoStore.tattooArtist = tattoo.tattooArtist;
    createTattoStore.syncPhotosFromApi(tattoo.photoUrl);
    createTattoStore.customerSign = tattoo.customerSign;
    createTattoStore.userSign = tattoo.userSign;
    createTattoStore.syncSectionsConfirmedFromTattoo(tattoo);
};

const hydrateTattooFromRoute = async (tattooUuid: string) => {
    createTattoStore.setHydrating(true);
    try {
        const tattoo = await getTattoByUuid(tattooUuid);
        if (tattoo.status === 'CLOSE') {
            await router.replace(`/tattoos/${tattooUuid}`);
            return;
        }
        await applyTattooToStore(tattoo);
    } catch {
        uiStore.setToast('Tatuaggio non trovato', 'error');
        await router.replace('/createtattoo');
    } finally {
        createTattoStore.setHydrating(false);
    }
};

const syncFromRoute = async () => {
    const tattooUuid = getRouteTattooUuid();
    createTattoStore.resetTattoo();
    activeStep.value = 'info';
    if (tattooUuid) {
        await hydrateTattooFromRoute(tattooUuid);
    }
};

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Crea Tatuaggio";
    try {
        await refreshStudioProfile();
    } catch {
        // proceed with cached profile
    }
    await syncFromRoute();
    skipRouteWatch.value = false;
    uiStore.loading = false;
});

watch(
    () => route.params.tattooUuid as string | undefined,
    async (tattooUuid, previousUuid) => {
        if (skipRouteWatch.value || tattooUuid === previousUuid) return;
        if (tattooUuid && createTattoStore.uuid === tattooUuid) return;
        uiStore.loading = true;
        await syncFromRoute();
        uiStore.loading = false;
    },
);

const getToday = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
}

const submit = async () => {
    uiStore.loading = true;
    if (createTattoStore.uuid) {
        try {
            await refreshStudioProfile();

            const closedTattoo = await closeTattoo(createTattoStore.uuid);
            const labelsData = await apiLabelService.getLabelsByTattooUuid(createTattoStore.uuid);

            for (let i = 0; i < labelsData.length; i++) {
                const inkData = await inkLabelService.getInkByUuid(labelsData[0].inkUuid);
                labelsData[0] = {
                    ...labelsData[0],
                    ...inkData
                }
            }

            const certificateData = {
                ...createTattoStore.certificateData,
                date: getToday(),
                inkType: labelsData[0].inkType,
                inkColor: labelsData[0].color,
                codiceUnivoco: createTattoStore.inks.join(', '),
                inkBatchId: labelsData[0].batchId,
                sterilizationUrl: labelsData[0].sterilizationCertUrl,
                chemistryAnalysisUrl: labelsData[0].chemistryAnalysisUrl,
                microbiologicalAnalysisUrl: labelsData[0].microbiologicalAnalysisUrl,
                inkSds: labelsData[0].sdsUrl,
                inkFormulaUrl: labelsData[0].inkFormulaUrl,
                signPlace: studioSignPlace(),
                tattooStudio: studioName(),
                tattooStudioAddress: studioAddress(),
                tattooPhotoUrl:
                    createTattoStore.photoAfterUrl ?? createTattoStore.photoBeforeUrl,
                tattooCertificateNumber: String(createTattoStore.id),
            }
            const informedConsentData = {
                ...createTattoStore.informedConsentData,
                date: getToday(),
                signPlace: studioSignPlace(),
            };

            const customerEmail = createTattoStore.info.email;
            if (!customerEmail) {
                uiStore.setToast('Email del cliente obbligatoria per l\'invio dei documenti', 'error');
                uiStore.loading = false;
                uiStore.loadingMessage = '';
                return;
            }

            uiStore.loadingMessage =
                'Stiamo generando tutti i documenti, potrebbe volerci un attimo :)';
            await finalizeTattoo(createTattoStore.uuid, {
                customerEmail,
                customerName: [createTattoStore.info.name, createTattoStore.info.surname]
                    .filter(Boolean)
                    .join(' '),
                studioName: studioName(),
                certificate: certificateData,
                consent: informedConsentData,
            });
            uiStore.loadingMessage = '';

            await tattooStore.fetchTattoosPage(userStore.getUiid, { reset: true, filter: 'all' });
            router.push(`/tattoos/${createTattoStore.uuid}`);
            uiStore.setToast('Tatuaggio completato! Email inviata al cliente.');

        } catch {
            uiStore.setToast('Qualcosa è andato storto', 'error');
        }

    }
    else {
        uiStore.setToast('Nessun ID tatuaggio', 'error');
    }
    uiStore.loading = false;
    uiStore.loadingMessage = '';
}

</script>
<style></style>