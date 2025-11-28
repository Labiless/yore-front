<template>
    <div class="mx-auto flex pt-48 w-full mb-8">
        <h1 class="font-bold text-2xl">Inchiostri disponibili</h1>
    </div>
    <div class="grid grid-cols-3 gap-4 mx-auto w-full items-start" v-if="warehouseStore.warehouse.length">
        <div class="shadow-2xl p-4 bg-white rounded-2xl flex justify-center items-center"
            v-for="inks in warehouseStore.warehouse">
            <p class="font-bold text-xl pr-4 w-16 text-center">X {{ inks.amount }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold capitalize text-2xl">{{ inks.name }}</p>
                <p :style="`color: ${inks.color}`">{{ inks.color }}</p>
                <p class="text-xs">{{ inks.uuid }}</p>
            </div>
        </div>
    </div>
    <div v-else>
        <h1>Magazzino vuoto</h1>
    </div>
    <div class="mx-auto flex pt-8 px-4 w-full">
        <h1 class="font-bold text-lg">Storico caricamenti</h1>
    </div>
    <div class="p-4 flex justify-start items-center">
        <Input v-model="searchUuid" class="w-1/3 shadow-xl" type="text" />
        <Search class="ml-2" />
    </div>
    <div class="mx-auto w-full items-start overflow-y-auto h-1/2" v-if="warehouseStore.allBatches.length">
        <transition :name="transitionDirection">
            <div v-if="!warehouseStore.batchUuid && !warehouseStore.inkUuid">
                <div @click="showBatch(batch.uuid)"
                    class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
                    v-for="batch in warehouseStore.allBatches">
                    <p class="font-bold text-2xl pr-4 w-16 text-center">x {{ batch.amount }}</p>
                    <div class="border-l-1 border-black pl-4">
                        <p class="font-bold">N°{{ batch.id }}</p>
                        <p>{{ new Date(batch.creationDate).toDateString() }}</p>
                        <p class="text-xs">{{ batch.uuid }}</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="flex py-4">
                    <ArrowLeft @click="transitionDirection = 'back'; warehouseStore.resetSearch()"
                        class="hover:cursor-pointer ml-4 mb-4 mr-4" />
                    <p class="font-bold text-xl">{{ warehouseStore.batchUuid }}</p>
                </div>
                <div class="flex gap-2 mb-4 p-4">
                    <a :href="warehouseStore.batchData[0].chemistryAnalysisUrl" target="_blank">
                        <Button>
                            <Download /> Chemistry Analysis
                        </Button>
                    </a>
                    <a :href="warehouseStore.batchData[0].inkFormulaUrl" target="_blank">
                        <Button>
                            <Download /> inkFormulaUrl
                        </Button>
                    </a>
                    <a :href="warehouseStore.batchData[0].microbiologicalAnalysisUrl" target="_blank">
                        <Button>
                            <Download /> microbiologicalAnalysisUrl
                        </Button>
                    </a>
                    <a :href="warehouseStore.batchData[0].sterilizationCertUrl" target="_blank">
                        <Button>
                            <Download /> sterilizationCertUrl
                        </Button>
                    </a>
                    <a :href="warehouseStore.batchData[0].sdsUrl" target="_blank">
                        <Button>
                            <Download /> sdsUrl
                        </Button>
                    </a>
                </div>
                <div @click="showInk(ink.uuid)"
                    :class="`${warehouseStore.inkUuid === ink.uuid ? 'h-80! items-start' : ''}`"
                    class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
                    v-for="ink in warehouseStore.batchData">
                    <p class="font-bold text-2xl pr-4 w-16 text-center">{{ ink.id }}</p>
                    <div class="border-l-1 border-black pl-4">
                        <p class="font-bold">{{ ink.uuid }}</p>
                        <p>{{ new Date(ink.creationDate).toDateString() }}</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <div v-else>
        <h1>Nessun lotto creato</h1>
    </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue';
import { getAllBatches, getAvailableInksByType, getInkTypes, getBatchByUuid, getInkByUuid } from "@/services/api.ink.service";
import { ArrowLeft, Download, Search } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { useWharehouseStore } from '@/stores/warehouse.store';
import Input from '@shared/components/ui/input/input.vue';
import Button from '@shared/components/ui/button/button.vue';

const uiStore = useUiStore();
const warehouseStore = useWharehouseStore();
const transitionDirection = ref('next');

const searchUuid = ref('');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUuid = (uuid: string) => {
    return uuidRegex.test(uuid);
}

watch(searchUuid, async (newSearchUuid, oldSearchUuid) => {
    newSearchUuid = newSearchUuid.replace(/\s+/g, '');
    if (isValidUuid(newSearchUuid)) {
        const ink = await getInkByUuid(newSearchUuid);
        if (ink.batchId) {
            warehouseStore.batchUuid = ink.batchId;
            warehouseStore.batchData = [ink];
            // warehouseStore.inkData = ink;
        }
        else {
            const batch = await getBatchByUuid(newSearchUuid);
            if (batch.length) {
                warehouseStore.batchUuid = newSearchUuid;
                warehouseStore.batchData = batch;
            }
        }
    }
})

onMounted(async () => {
    uiStore.title = "Magazzino Inchiostri";
    uiStore.loading = true;
    if (!warehouseStore.allBatches.length) {
        warehouseStore.allBatches = await getAllBatches();
        const inkTypes = await getInkTypes();
        for (let i = 0; i < inkTypes.length; i++) {
            const availableAmount = await getAvailableInksByType(inkTypes[i].uuid);
            //@ts-ignore
            if (availableAmount.length) warehouseStore.warehouse[i] = {
                ...inkTypes[i],
                amount: availableAmount.length
            }
        }
    }
    uiStore.loading = false;
});

const showBatch = async (uuid: string) => {
    transitionDirection.value = 'next';
    warehouseStore.batchUuid = uuid;
    warehouseStore.batchData = await getBatchByUuid(warehouseStore.batchUuid);
}

const showInk = async (uuid: string) => {
    transitionDirection.value = 'next';
    warehouseStore.inkUuid = uuid;
    warehouseStore.inkData = await getInkByUuid(uuid);
}

</script>

<style scoped></style>