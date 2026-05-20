<template>
    <div>
        <Button @click="submit" :disabled="!createTattoStore.allValidation()" class="mb-8 w-full h-12">Genera
            certificato</Button>
        <p class="flex text-xl font-bold w-fit m-auto">
            <Calendar class="mr-2" /> 01/01/2026
        </p>
        <p class="text-sm text-center">INK STUDIO - Tattoo studio</p>
        <div id="steps" class="py-4 flex justify-around md:justify-center w-5/6 mx-auto">
            <Button :disabled="status.name !== 'info' && !createTattoStore.uuid" @click="activeStep = status.name"
                v-for="status in allSteps" class="w-10 h-14 bg-white flex flex-col md:mx-4"
                :class="`${activeStep === status.name ? 'border-2 border-blue-500' : ''}`">
                <ClipboardList class="text-black" v-if="status.name === 'info'" />
                <PersonStanding class="text-black" v-if="status.name === 'kirbyDesay'" />
                <Droplet class="text-black" v-if="status.name === 'ink'" />
                <Brush class="text-black" v-if="status.name === 'tattoo'" />
                <PenTool class="text-black" v-if="status.name === 'sign'" />
                <div class="rounded-full bg-green-700 p-1" :class="`${status.validation() ? '' : 'bg-amber-500!'}`">
                </div>
            </Button>
        </div>
        <div id="info" class="flex flex-col gap-4 h-1/2 pt-8 pb-12" v-if="activeStep === 'info'">
            <CustomerInfo />
        </div>
        <div id="kirbyDesay" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8"
            v-if="activeStep === 'kirbyDesay'">
            <KirbyDesay />
        </div>
        <div id="ink" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8"
            v-if="activeStep === 'ink'">
            <Inks />
        </div>
        <div id="tattoo" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8"
            v-if="activeStep === 'tattoo'">
            <Tattoo />
        </div>
        <div id="sign" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8"
            v-if="activeStep === 'sign'">
            <Signs />
        </div>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import CustomerInfo from '@/components/createTattoo/CustomerInfo.vue';
import KirbyDesay from '@/components/createTattoo/KirbyDesay.vue';
import Inks from '@/components/createTattoo/Inks.vue';
import Tattoo from '@/components/createTattoo/Tattoo.vue';
import Signs from '@/components/createTattoo/Signs.vue';
import { Brush, Calendar, ClipboardList, Droplet, PenTool, PersonStanding } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { getTattoByUuid, closeTattoo, getAllTattoos, createCertificatePdf, createGdprPdf, createReleaseFormPdf } from '@/services/api.tattoo.service';
import { getCustomerByUuid } from '@/services/api.customer.service';
import { getTattooPhotoUrl, hasKirbyDesayData } from '@/constants/tattoo.config';
import { apiLabelService, inkLabelService } from '@/services/api.inks.service';
import router from '@/router';
import { useUserStore } from '@/stores/user.store';
import { useTatoosStore } from '@/stores/tattoos.store';

const uiStore = useUiStore();
const createTattoStore = useCreateTattoStore();
const tattooStore = useTatoosStore();
const userStore = useUserStore();

const activeStep = ref('info');
const allSteps = [
    {
        name: 'info',
        validation: createTattoStore.infoValidation
    },
    {
        name: 'kirbyDesay',
        validation: createTattoStore.kirbyDesayValidation
    },
    {
        name: 'ink',
        validation: createTattoStore.inksValidation
    },
    {
        name: 'tattoo',
        validation: createTattoStore.tattooPhotoValidation
    },
    {
        name: 'sign',
        validation: createTattoStore.signValidation
    },
]

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Crea Tatuaggio";
    const tattooUuid = createTattoStore.uuid;
    createTattoStore.resetTattoo();
    if (tattooUuid) {
        const tattoo = await getTattoByUuid(tattooUuid);
        createTattoStore.uuid = tattoo.uuid;
        createTattoStore.id = tattoo.id;
        if (tattoo.customerUuid) {
            const customer = await getCustomerByUuid(tattoo.customerUuid)
            createTattoStore.initCustomer(customer);
        }
        createTattoStore.inks = tattoo.inks ?? [];
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
        createTattoStore.photoUrl = getTattooPhotoUrl(tattoo.photoUrl);
        createTattoStore.customerSign = tattoo.customerSign;
        createTattoStore.userSign = tattoo.userSign;
    }
    uiStore.loading = false;
});

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
            console.log(createTattoStore)

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
                codiceUnivoco: '???????',
                inkBatchId: labelsData[0].batchId,
                sterilizationUrl: labelsData[0].sterilizationCertUrl,
                chemistryAnalysisUrl: labelsData[0].chemistryAnalysisUrl,
                microbiologicalAnalysisUrl: labelsData[0].microbiologicalAnalysisUrl,
                inkSds: labelsData[0].sdsUrl,
                inkFormulaUrl: labelsData[0].inkFormulaUrl,
                signPlace: userStore.city,
                tattooStudio: userStore.businessName,
                tattooCertificateNumber: String(createTattoStore.id),
            }

            console.log(certificateData);

            const certificateUrl = await createCertificatePdf(createTattoStore.uuid, certificateData);

            const releaseFormData = {
                ...createTattoStore.releaseFormData,
                date: getToday(),
                signPlace: userStore.city,
            }

            const releaseFormUrl = await createReleaseFormPdf(createTattoStore.uuid, releaseFormData);
            const gdprUrl = await createGdprPdf(createTattoStore.uuid, releaseFormData);

            const res = await getAllTattoos();
            tattooStore.tattoos = res.sort((a: any, b: any) => b.id - a.id);
            router.push(`tattoos/${createTattoStore.uuid}`);
            uiStore.setToast('Tatuaggio completato!');

        } catch {
            uiStore.setToast('Qualcosa è andato storto', 'error');
        }

    }
    else {
        uiStore.setToast('Nessun ID tatuaggio', 'error');
    }
    uiStore.loading = false;
}

</script>
<style></style>