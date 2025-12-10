<template>
    <div class="h-full mt-20">
        <Button @click="submit" :disabled="false" class="mb-8 w-full">Genera certificato</Button>
        <p class="flex text-xl font-bold w-fit m-auto">
            <Calendar class="mr-2" /> 01/01/2026
        </p>
        <p class="text-sm text-center">INK STUDIO - Tattoo studio</p>
        <div id="steps" class="py-4 flex justify-around w-5/6 mx-auto">
            <Button :disabled="status.name !== 'info' && !createTattoStore.uuid" @click="activeStep = status.name"
                v-for="status in allSteps" class="w-10 h-14 bg-white flex flex-col"
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
        <div id="info" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8" v-if="activeStep === 'info'">
            <CustomerInfo />
        </div>
        <div id="kirbyDesay" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8"
            v-if="activeStep === 'kirbyDesay'">
            <KirbyDesay />
        </div>
        <div id="ink" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8" v-if="activeStep === 'ink'">
            <Inks />
        </div>
        <div id="tattoo" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8" v-if="activeStep === 'tattoo'">
            <Tattoo />
        </div>
        <div id="sign" class="overflow-y-scroll hide-scrollbar flex flex-col gap-4 h-1/2 pb-16 pt-8" v-if="activeStep === 'sign'">
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
import { onMounted, ref, watch } from 'vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { getTattoByUuid, generateContract, getAllTattoos } from '@/services/api.tattoo.service';
import { getCustomerByUuid } from '@/services/api.customer.service';
import { getLabelByUuid } from '../../../backoffice-fe/src/services/api.label.service';
import router from '@/router';
import { useTatoosStore } from '@/stores/tattoos.store';

const uiStore = useUiStore();
const createTattoStore = useCreateTattoStore();
const tattooStore = useTatoosStore();

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
    if (createTattoStore.uuid) {
        const tattoo = await getTattoByUuid(createTattoStore.uuid);
        if (tattoo.customerUuid) {
            const customer = await getCustomerByUuid(tattoo.customerUuid)
            createTattoStore.info.name = customer.name
            createTattoStore.info.surname = customer.surname
            createTattoStore.info.email = customer.email
            createTattoStore.info.cf = customer.cf
            createTattoStore.info.country = customer.country
            createTattoStore.info.city = customer.city
            createTattoStore.info.address = customer.address
            createTattoStore.info.dataConsent = customer.consent
            createTattoStore.info.contractConsent = customer.consent
        }
        if (tattoo.inks.length > 0) {
            const inks = []
            for (let i = 0; i < tattoo.inks.length; i++) {
                const ink = await getLabelByUuid(tattoo.inks[i]);
                inks.push(ink);
            }
            createTattoStore.inks = inks;
        }
        if (tattoo.color > 0) {
            createTattoStore.updateKirbyDesay({
                color: tattoo.color,
                inkAmount: tattoo.inkAmount,
                inkLayers: tattoo.inkLayers,
                position: tattoo.position,
                scars: tattoo.scars,
                skinType: tattoo.skinType,
            });
        }
        if (tattoo.photoUrl) {
            createTattoStore.photoUrl = tattoo.photoUrl;
        }
        if (tattoo.customerSign && tattoo.userSign) {
            createTattoStore.customerSign = tattoo.customerSign;
            createTattoStore.userSign = tattoo.userSign;
        }
    }
    uiStore.loading = false;
});

const submit = async () => {
    uiStore.loading = true;
    await generateContract(createTattoStore.uuid);
    const res = await getAllTattoos();
    tattooStore.tattoos = res.sort((a: any, b: any) => b.id - a.id);
    router.push(`tattoos/${createTattoStore.uuid}`);
    uiStore.loading = false;
    uiStore.setToast('Tatuaggio completato!');
}

</script>
<style></style>