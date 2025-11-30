<template>
    <Accordion type="single" collapsible class="w-full" default-value="item-1">
        <AccordionItem value="item-1">
            <AccordionTrigger>Tipo di pelle</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                    <Button v-for="skinType in skinTypes" class="h-fit shadow-xl bg-white text-black flex flex-col">
                        <p class="text-center rounded-sm p-1" :class="`${skinType.bg}`">{{ skinType.name }}</p>
                        <p class="text-center text-xs block whitespace-normal">{{ skinType.description }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger>Localizzazione Tatuaggio</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                    <Button v-for="position in positions" class="h-fit shadow-xl bg-white text-black flex flex-col">
                        <img class="" :src="`img/kirby_desay/location-${position.id}.svg`" />
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger>Colore dell'inchiostro</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                    <Button v-for="color in colors" class="h-24 shadow-xl bg-white text-black flex">
                        <div v-for="bgColor in color.colors" :style="`background-color: ${bgColor};`" class="w-8 h-8 rounded-full border-1"></div>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
            <AccordionTrigger>Quantità Inchiostro</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                    <Button v-for="inkAmount in inkAmounts" class="h-40 shadow-xl bg-white text-black flex flex-col justify-start">
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
                    <Button v-for="scar in scars" class="h-40 shadow-xl bg-white text-black flex flex-col justify-start">
                        <p class="text-center rounded-sm p-1 whitespace-normal">{{ scar.title }}</p>
                        <p class="text-center text-xs block whitespace-normal">{{ scar.description }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
            <AccordionTrigger>Stratificazione inchiostro</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-2 gap-2">
                    <Button v-for="inkLayer in inkLayers" class="h-30 shadow-xl bg-white text-black flex flex-col justify-start">
                        <p class="text-center rounded-sm p-1 whitespace-normal">{{ inkLayer.title }}</p>
                        <p class="text-center text-xs block whitespace-normal">{{ inkLayer.description }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
</template>
<script setup lang="ts">
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@shared/components/ui/accordion'
import Button from '@shared/components/ui/button/button.vue';
import Input from '@shared/components/ui/input/input.vue';

const skinTypes = [
    {
        id: 1,
        name: 'molto chiara',
        description: 'descrizione della pelle',
        bg: 'bg-fuchsia-100'
    },
    {
        id: 1,
        name: 'molto chiara',
        description: 'descrizione della pelle',
        bg: 'bg-red-500'
    },
    {
        id: 1,
        name: 'molto chiara',
        description: 'descrizione della pelle',
        bg: 'bg-red-500'
    },
    {
        id: 1,
        name: 'molto chiara',
        description: 'descrizione della pelle',
        bg: 'bg-red-500'
    },
    {
        id: 1,
        name: 'molto chiara',
        description: 'descrizione della pelle',
        bg: 'bg-red-500'
    },
    {
        id: 1,
        name: 'molto chiara',
        description: 'descrizione della pelle',
        bg: 'bg-red-500'
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
        id: 1,
        name: 'blue_black',
        colors: ['#541C00', '#FF0000', '#FF7F00']
    },
    {
        id: 1,
        name: 'blue_black',
        colors: ['#329D00', '#71A0FF', '#A600FF']
    },
    {
        id: 1,
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
        id: 1,
        name: 'blue_black',
        title: 'Professionale (tatuatore)',
        description: 'profondo e denso'
    },
    {
        id: 1,
        name: 'blue_black',
        title: 'Amatoriale (fatto in casa)',
        description: 'Spesso irregolare, quantità variabile'
    },
    {
        id: 1,
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
        id: 2,
        name: 'blue_black',
        title: 'Lieve cicatrice o ispessimento',
        description: 'Piccola area irregolare'
    },
    {
        id: 3,
        name: 'blue_black',
        title: 'Cicatrice evidente o ipertrofica',
        description: 'Tessuto duro, fibrotico'
    },
    {
        id: 4,
        name: 'blue_black',
        title: 'Cheloide / fibrosi estesa',
        description: 'Alterazione severa'
    },
    {
        id: 5,
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