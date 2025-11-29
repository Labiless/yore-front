<template>
    <div class="h-full pt-32">
        <Button disabled class="mb-8 w-full">Genera certificato</Button>
        <p class="flex text-xl font-bold w-fit m-auto">
            <Calendar class="mr-2" /> 01/01/2026
        </p>
        <p class="text-sm text-center">INK STUDIO - Tattoo studio</p>
        <div id="steps" class="py-4 flex justify-around w-5/6 mx-auto">
            <Button @click="activeStep = status.name" v-for="status in allSteps"
                class="w-10 h-14 bg-white flex flex-col"
                :class="`${activeStep === status.name ? 'border-2 border-blue-500' : ''}`">
                <ClipboardList class="text-black" v-if="status.name === 'info'" />
                <PersonStanding class="text-black" v-if="status.name === 'kirbyDesay'" />
                <Droplet class="text-black" v-if="status.name === 'ink'" />
                <Brush class="text-black" v-if="status.name === 'tattoo'" />
                <PenTool class="text-black" v-if="status.name === 'sign'" />
                <div class="rounded-full bg-green-700 p-1"
                    :class="`${status.validation() ? '' : 'bg-amber-500!'}`"></div>
            </Button>
        </div>
        <div id="info" class="overflow-y-scroll flex flex-col gap-4 h-1/2 pb-16 pt-8" v-if="activeStep === 'info'">
            <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
                <ClipboardList class="text-black mr-2" />
                Informazioni Tatuato
            <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
                :class="`${createTattoStore.infoValidation() ? '' : 'bg-amber-500!'}`"></div>
            </p>
            <hr>
            </hr>
            <label>
                Nome
                <Input v-model="createTattoStore.info.name" />
            </label>
            <label>
                Cognome
                <Input v-model="createTattoStore.info.surname" />
            </label>

            <label>
                Codice Fiscale
                <Input v-model="createTattoStore.info.cf" />
            </label>

            <label>
                Paese di residenza
                <Input v-model="createTattoStore.info.country" />
            </label>

            <label>
                Città di residenza
                <Input v-model="createTattoStore.info.city" />
            </label>

            <label>
                Indirizzo di residenza
                <Input v-model="createTattoStore.info.street" />
            </label>
            <div class="flex flex-col justify-around mt-2">
                <Label for="terms" class="text-xs mb-4">
                    <Checkbox v-model="createTattoStore.info.dataConsent" />
                    Do il consenso per il trattamento dati
                </Label>
                <Label for="terms" class="text-xs">
                    <Checkbox v-model="createTattoStore.info.contractConsent" />
                    Do il consenso per la liberatoria
                </Label>
            </div>
        </div>
        <div id="kirbyDesay" v-if="activeStep === 'kirbyDesay'">
            <h1>kirbyDesay</h1>
        </div>
        <div id="ink" v-if="activeStep === 'ink'">
            <h1>ink</h1>
        </div>
        <div id="tattoo" v-if="activeStep === 'tattoo'">
            <h1>tattoo</h1>
        </div>
        <div id="sign" v-if="activeStep === 'sign'">
            <h1>sign</h1>
        </div>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/button.vue';
import Input from '@shared/components/ui/input/input.vue';
import Checkbox from '@shared/components/ui/checkbox/Checkbox.vue';
import { Brush, Calendar, ClipboardList, Droplet, PenTool, PersonStanding } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';

const uiStore = useUiStore();
const createTattoStore = useCreateTattoStore();

const activeStep = ref('info');
const allSteps = [
    {
        name: 'info',
        validation : createTattoStore.infoValidation
    },
    {
        name: 'kirbyDesay',
        validation : createTattoStore.kirbyDesayValidation
    },
    {
        name: 'ink',
        validation : createTattoStore.inksValidation
    },
    {
        name: 'tattoo',
        validation : createTattoStore.tattooPhotoValidation
    },
    {
        name: 'sign',
        validation : createTattoStore.signValidation
    },
]

onMounted(() => {
    uiStore.title = "Crea Tatuaggio";
});

</script>
<style></style>