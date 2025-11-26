<template>
    <div class="mx-auto flex pt-48 w-full mb-8">
        <h1 class="font-bold text-2xl">Inchiostri disponibili</h1>
    </div>
    <div class="grid grid-cols-3 gap-4 mx-auto w-full items-start">
        <div class="shadow-2xl p-4 bg-white rounded-2xl flex justify-center items-center" v-for="inks in warehouse">
            <p class="font-bold text-xl pr-4 w-16 text-center">X {{ inks._count.id }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold capitalize text-2xl">{{ inks.name }}</p>
                <p :style="`color: ${inks.color}`">{{ inks.color }}</p>
                <p class="text-xs">{{ inks.inkTypeUuid }}</p>
            </div>
        </div>
    </div>
    <div class="mx-auto flex pt-8 w-full mb-8">
        <h1 class="font-bold text-lg">Storico caricamenti</h1>
    </div>
    <div class="mx-auto w-full items-start overflow-y-auto h-1/2">
        <router-link :to="`/warehouse/${batch.uuid}`"
            class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="batch in allBatches">
            <p class="font-bold text-2xl pr-4 w-16 text-center">x {{ batch.amount }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">N°{{ batch.id }}</p>
                <p>{{ new Date(batch.creationDate).toDateString() }}</p>
                <p class="text-xs">{{ batch.uuid }}</p>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue';
import { getAllBatches, getInksByType, getInkTypes } from "@/services/api.ink.service";
import { useUiStore } from '@/stores/ui';
import { ref } from 'vue';

const uiStore = useUiStore();
const allBatches = ref([]);
const warehouse = ref([]);
const inkTypes = ref([])

onMounted(async () => {
    uiStore.title = "Magazzino Inchiostri";
    uiStore.loading = true;
    allBatches.value = await getAllBatches();
    inkTypes.value = await getInkTypes();
    warehouse.value = (await getInksByType()).map(el => ({
        ...el,
        ...inkTypes.value.filter(newEl => newEl.uuid === el.inkTypeUuid)[0]
    }))
    uiStore.loading = false;
});

</script>