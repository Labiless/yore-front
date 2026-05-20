<template>
    <div class="mx-auto w-full px-4 items-start overflow-y-auto h-full">
        <router-link to="/loadbatch">
            <Button class="w-full h-12 mb-4 ">
                <Plus /> Carica nuovi inchiostri
            </Button>
        </router-link>
        <h1 class="text-2xl mb-2 mt-4">Magazzino inchiostro</h1>
        <div class="flex  justify-start items-center">
            <Input v-model="searchUuid" class="w-2/3 shadow-xl" type="text" />
            <Search class="ml-2" />
        </div>
        <div class="flex items-center gap-2 p-2 my-4 mx-auto rounded-md bg-slate-200">
            <Button @click="showTab = 0" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 0 ? 'bg-white!' : ''}`">Magazzino</Button>
            <Button @click="showTab = 1" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 1 ? 'bg-white!' : ''}`">
                Lotti caricamento
            </Button>
        </div>
        <div v-show="showTab === 0" class="pb-50">
            <div class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
                v-for="inks in warehouseStore.warehouse">
                <p class="font-bold text-2xl">x{{ inks.amount }}</p>
                <div class="pl-4 flex justify-between items-center w-11/12">
                    <div>
                        <p class="flex capitalize text-md font-bold -translate-x-2">
                            <Droplet class="scale-75" />{{ inks.name }}
                        </p>
                        <p class="capitalize text-xs">{{ inks.color }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="showTab === 1" class="pb-50">
            <Transition>
                <div v-if="!warehouseStore.batchUuid">
                    <div @click="showBatch(batch.uuid)"
                        class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
                        v-for="batch in warehouseStore.allBatches">
                        <p class="font-bold text-2xl">x{{ batch.amount }}</p>
                        <div class="pl-4 flex justify-between items-center w-11/12">
                            <div>
                                <p class="flex capitalize text-md font-bold -translate-x-2">
                                    <Calendar class="scale-75" />{{ batch.creationDate.split('T')[0] }}
                                </p>
                                <p class="flex capitalize text-xs -translate-x-2">{{ batch.uuid }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="flex items-center mb-4">
                        <ArrowLeft @click="warehouseStore.batchUuid = '';" class="hover:cursor-pointer mr-2" />
                        <p class="font-bold text-md flex -translate-x-2">
                            <Calendar class="scale-75" /> {{ warehouseStore.batchData[0].creationDate.split('T')[0] }} /
                            {{ warehouseStore.batchUuid }}
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <a target="_blank" :href="warehouseStore.batchData[0].inkFormulaUrl">
                            <Button class="text-xs">Formula Inchiostro</Button>
                        </a>
                        <a target="_blank" :href="warehouseStore.batchData[0].sdsUrl">
                            <Button class="text-xs">Sds</Button>
                        </a>
                        <a target="_blank" :href="warehouseStore.batchData[0].sterilizationCertUrl">
                            <Button class="text-xs">Certificato sterilizzazione</Button>
                        </a>
                        <a target="_blank" :href="warehouseStore.batchData[0].chemistryAnalysisUrl">
                            <Button class="text-xs">Analisi chimiche</Button>
                        </a>
                        <a target="_blank" :href="warehouseStore.batchData[0].microbiologicalAnalysisUrl">
                            <Button class="text-xs">Analisi microbiologiche</Button>
                        </a>
                    </div>
                    <div @click="showInk(ink.uuid)"
                        class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
                        :class="`${''}`" v-for="ink in warehouseStore.batchData">
                        <p class="font-bold text-md">{{ ink.id }}</p>
                        <div class="pl-4 flex justify-between items-center w-11/12">
                            <div>
                                <p class="flex items-center text-xs" v-if="ink.color">
                                    <Pipette class="scale-50" />{{ ink.color }}
                                </p>
                                <p class="flex items-center text-xs" v-if="ink.labelUuid">
                                    <Tag class="scale-50" />{{ ink.labelUuid }}
                                </p>
                            </div>
                            <p class="w-3 h-3 rounded-full"
                                :class="`${ink.labelUuid ? 'bg-orange-500' : 'bg-green-500'}`"></p>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue';
import { getAllBatches, getAvailableInksByType, getInkTypes, getBatchByUuid, getInkByUuid } from "@/services/api.ink.service";
import { ArrowLeft, Pipette, Tag, Download, Search, Plus, Droplet, Warehouse, Calendar } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { useWharehouseStore } from '@/stores/warehouse.store';
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import { useRoute } from 'vue-router';

const showTab = ref(0);
const route = useRoute();
const batchUuid = typeof route.params.batchUuid === 'string' ? route.params.batchUuid : '';

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
    uiStore.title = "Magazzino";
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
    if (batchUuid) {
        await showBatch(batchUuid);
        showTab.value = 1;
    }
    uiStore.loading = false;
});

const showBatch = async (uuid: string) => {
    transitionDirection.value = 'next';
    warehouseStore.batchUuid = uuid;
    warehouseStore.batchData = await getBatchByUuid(warehouseStore.batchUuid);
    console.log(warehouseStore.batchUuid)
    console.log(warehouseStore.batchData)
}

const showInk = async (uuid: string) => {
    transitionDirection.value = 'next';
    warehouseStore.inkUuid = uuid;
    warehouseStore.inkData = await getInkByUuid(uuid);
}

</script>

<style scoped></style>