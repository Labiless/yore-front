<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Kirby-Desai data
    <div class="rounded-full p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.kirbyDesayValidation() ? 'bg-green-700' : 'bg-amber-500'}`"></div>
    </p>
    <hr />
    <Accordion type="single" collapsible class="w-full" default-value="item-1">
        <AccordionItem value="item-1">
            <AccordionTrigger>Tipo di pelle</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-2 gap-2">
                    <Button @click="createTattoStore.kirbyDesay.skinType = skinType.id" v-for="skinType in skinTypes"
                        class="h-28 shadow-xl bg-white text-black flex flex-col"
                        :class="`${createTattoStore.kirbyDesay.skinType === skinType.id ? 'border-2 border-blue-400' : ''}`">
                        <p class="text-center text-sm lowercase w-full rounded-sm p-1"
                            :style="`background-color: ${skinType.bg}`">{{ skinType.name }}</p>
                        <p class="text-center text-xs block whitespace-normal">{{ skinType.description }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger>Localizzazione Tatuaggio</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                    <Button @click="createTattoStore.kirbyDesay.position = position.id" v-for="position in positions"
                        class="h-fit shadow-xl bg-white text-black flex flex-col"
                        :class="`${createTattoStore.kirbyDesay.position === position.id ? 'border-2 border-blue-400' : ''}`">
                        <img class="" :src="`img/kirby_desay/location-${position.id}.svg`" />
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger>Colore dell'inchiostro</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                    <Button @click="createTattoStore.kirbyDesay.color = color.id" v-for="color in colors"
                        class="h-24 shadow-xl bg-white text-black flex"
                        :class="`${createTattoStore.kirbyDesay.color === color.id ? 'border-2 border-blue-400' : ''}`">
                        <div v-for="bgColor in color.colors" :style="`background-color: ${bgColor};`"
                            class="w-8 h-8 rounded-full border-1"></div>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
            <AccordionTrigger>Quantità Inchiostro</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                    <Button @click="createTattoStore.kirbyDesay.inkAmount = inkAmount.id"
                        v-for="inkAmount in inkAmounts"
                        class="h-40 shadow-xl bg-white text-black flex flex-col justify-start lg:justify-center"
                        :class="`${createTattoStore.kirbyDesay.inkAmount === inkAmount.id ? 'border-2 border-blue-400' : ''}`">
                        <p class="text-center rounded-sm p-1 whitespace-normal">{{ inkAmount.title }}</p>
                        <p class="text-center text-xs block whitespace-normal">{{ inkAmount.description }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
            <AccordionTrigger>Presenza cicatrici</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                    <Button @click="createTattoStore.kirbyDesay.scars = scar.id" v-for="scar in scars"
                        class="h-40 shadow-xl bg-white text-black flex flex-col justify-start lg:justify-center"
                        :class="`${createTattoStore.kirbyDesay.scars === scar.id ? 'border-2 border-blue-400' : ''}`">
                        <p class="text-center rounded-sm p-1 whitespace-normal">{{ scar.title }}</p>
                        <p class="text-center text-xs block whitespace-normal">{{ scar.description }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
            <AccordionTrigger>Stratificazione inchiostro</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-2 gap-2">
                    <Button @click="createTattoStore.kirbyDesay.inkLayers = inkLayer.id" v-for="inkLayer in inkLayers"
                        class="h-30 shadow-xl bg-white text-black flex flex-col justify-start lg:justify-center"
                        :class="`${createTattoStore.kirbyDesay.inkLayers === inkLayer.id ? 'border-2 border-blue-400' : ''}`">
                        <p class="text-center rounded-sm p-1 whitespace-normal">{{ inkLayer.title }}</p>
                        <p class="text-center text-xs block whitespace-normal">{{ inkLayer.description }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    <Button @click="submit"> Conferma</Button>
</template>
<script setup lang="ts">
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@shared/components/ui/accordion'
import Button from '@shared/components/ui/button/Button.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { userUserStore } from '@/stores/user.store';
import { updateTattoo } from '@/services/api.tattoo.service';
import { createTattoo } from '@/services/api.tattoo.service';
import { useUiStore } from '@/stores/ui';

const createTattoStore = useCreateTattoStore();
const userStore = userUserStore();
const uiStore = useUiStore();

const submit = async () => {
    uiStore.loading = true;
    if (createTattoStore.kirbyDesayValidation() && createTattoStore.uuid) {
        const kirbyDesayData = {
            color: createTattoStore.kirbyDesay.color,
            inkAmount: createTattoStore.kirbyDesay.inkAmount,
            inkLayers: createTattoStore.kirbyDesay.inkLayers,
            position: createTattoStore.kirbyDesay.position,
            scars: createTattoStore.kirbyDesay.scars,
            skinType: createTattoStore.kirbyDesay.skinType,
        }
        const tattoo = await updateTattoo(createTattoStore.uuid, kirbyDesayData);
        uiStore.loading = false;
        uiStore.setToast('Kirby-Desai data aggiunti');
    }else{
        uiStore.loading = false;
        uiStore.setToast('Compilare tutti i dati prima di inviare', 'error');
    }
}

const skinTypes = [
    {
        id: 1,
        name: 'molto chiara',
        description: 'descrizione della pelle',
        bg: '#F0E4F2'
    },
    {
        id: 2,
        name: 'CHIARA',
        description: 'Spesso si scotta, si abbronza leggermente',
        bg: '#FBC2CF'
    },
    {
        id: 3,
        name: 'MEDIO CHIARA',
        description: 'Si scotta a volte, si abbronza gradualmente',
        bg: '#FBB2A4'
    },
    {
        id: 4,
        name: 'MEDIO SCURA',
        description: 'Si scotta raramente, si abbronza facilmente',
        bg: '#D28D56'
    },
    {
        id: 5,
        name: 'SCURA',
        description: 'Quasi mai si scotta, si abbronza subito',
        bg: '#AB5F4D'
    },
    {
        id: 5,
        name: 'MOLTO SCURA',
        description: 'Mai ustionata, colore naturalmente scuro',
        bg: '#422421'
    },
]

const positions = [
    {
        id: 1,
        name: 'head',
    },
    {
        id: 2,
        name: 'chest',
    },
    {
        id: 3,
        name: 'upper_legs',
    },
    {
        id: 4,
        name: 'downer_legs_forearms',
    },
    {
        id: 5,
        name: 'feet_hands',
    },
]

const colors = [
    {
        id: 1,
        name: 'blue_black',
        colors: ['#050089', '#000000']
    },
    {
        id: 2,
        name: 'blue_black',
        colors: ['#541C00', '#FF0000', '#FF7F00']
    },
    {
        id: 3,
        name: 'blue_black',
        colors: ['#329D00', '#71A0FF', '#A600FF']
    },
    {
        id: 4,
        name: 'blue_black',
        colors: ['white', '#FFEA00', '#EAB1DF']
    },
]

const inkAmounts = [
    {
        id: 1,
        name: 'blue_black',
        title: 'Cosmetico (sopracciglia, labbra)',
        description: 'superficiale, poco denso'
    },
    {
        id: 2,
        name: 'blue_black',
        title: 'Professionale (tatuatore)',
        description: 'profondo e denso'
    },
    {
        id: 3,
        name: 'blue_black',
        title: 'Amatoriale (fatto in casa)',
        description: 'Spesso irregolare, quantità variabile'
    },
    {
        id: 4,
        name: 'blue_black',
        title: 'Copertura (cover-up)',
        description: 'Due o più strati di inchiostro'
    },
]

const scars = [
    {
        id: 1,
        name: 'blue_black',
        title: 'Pelle normale',
        description: 'Nessuna cicatrice o alterazione'
    },
    {
        id: 3,
        name: 'blue_black',
        title: 'Lieve cicatrice o ispessimento',
        description: 'Piccola area irregolare'
    },
    {
        id: 4,
        name: 'blue_black',
        title: 'Cicatrice evidente o ipertrofica',
        description: 'Tessuto duro, fibrotico'
    },
    {
        id: 5,
        name: 'blue_black',
        title: 'Cheloide / fibrosi estesa',
        description: 'Alterazione severa'
    },
    {
        id: 6,
        name: 'blue_black',
        title: 'Pelle normale',
        description: 'Nessuna cicatrice o alterazione'
    },
]

const inkLayers = [
    {
        id: 1,
        name: 'blue_black',
        title: 'Un solo strato di pigmento',
        description: 'Tatuaggio unico'
    },
    {
        id: 2,
        name: 'blue_black',
        title: 'Ritocco o rinforzo sullo stesso tatuaggio',
        description: 'Due passaggi di inchiostro'
    },
    {
        id: 3,
        name: 'blue_black',
        title: 'Copertura (cover-up)',
        description: 'Nuovo tatuaggio sopra il precedente'
    },
]

</script>

<style scoped>
.selected {
    border: 2px solid blue;
}
</style>