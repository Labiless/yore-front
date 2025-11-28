<template>
    <div class="mx-auto pt-48  mb-4 flex px-4 w-full">
        <router-link to="createlabels">
            <Button>
                <Plus />
                <Download /> Crea nuove etichette
            </Button>
        </router-link>
    </div>
    <div class="mx-auto flex px-4 w-full">
        <h1 class="font-bold text-lg">Storico creazione etichette</h1>
    </div>
    <div class="p-4 flex justify-start items-center">
        <Input v-model="searchUuid" class="w-1/3 shadow-xl" type="text" />
        <Search class="ml-2" />
    </div>
    <div class="mx-auto w-full items-start overflow-y-auto h-1/2" v-if="labelsStore.allBatches.length">
        <transition :name="transitionDirection">
            <div v-if="!labelsStore.batchUuid && !labelsStore.inkUuid">
                <div @click="showBatch(batch.uuid)"
                    class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
                    v-for="batch in labelsStore.allBatches">
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
                    <ArrowLeft @click="transitionDirection = 'back'; labelsStore.resetSearch()"
                        class="hover:cursor-pointer ml-4 mb-4 mr-4" />
                    <p class="font-bold text-xl">{{ labelsStore.batchUuid }}</p>
                </div>
                <div class="flex gap-2 mb-4 p-4">
                    <Button @click="getPrintFileUrl">
                        <Printer class="hover:cursor-pointer mt-1 mr-2" />
                        Stampa etichette
                    </Button>
                </div>
                <div @click="showLabel(label.uuid)"
                    :class="`${labelsStore.labelUuid === label.uuid ? 'h-80! items-start' : ''}`"
                    class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
                    v-for="label in labelsStore.batchData">
                    <p class="font-bold text-2xl pr-4 w-16 text-center">{{ label.id }}</p>
                    <div class="border-l-1 border-black pl-4">
                        <p class="font-bold">{{ label.uuid }}</p>
                        <p>{{ new Date(label.creationDate).toDateString() }}</p>
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

import { onMounted, ref, watch } from 'vue';
import { Search, Printer, ArrowLeft, Plus } from 'lucide-vue-next';
import { getAllBatches, getBatchByUuid, getLabelByUuid, getPrintFile } from "@/services/api.label.service";
import { useUiStore } from '@/stores/ui';
import { useLabelsStore } from '@/stores/lables.store';
import Input from '@shared/components/ui/input/input.vue';
import Button from '@shared/components/ui/button/button.vue';
import router from '@/router';

const uiStore = useUiStore();
const labelsStore = useLabelsStore();
const transitionDirection = ref('next');

const searchUuid = ref('');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const batchUuid = router.resolve().params.labelsUuid as string;

const isValidUuid = (uuid: string) => {
    return uuidRegex.test(uuid);
}

watch(searchUuid, async (newSearchUuid, oldSearchUuid) => {
    newSearchUuid = newSearchUuid.replace(/\s+/g, '');
    if (isValidUuid(newSearchUuid)) {
        const label = await getLabelByUuid(newSearchUuid);
        console.log('label', label);
        if (label.batchId) {
            labelsStore.batchUuid = label.batchId;
            labelsStore.batchData = [label];
            // warehouseStore.inkData = ink;
        }
        else {
            const batch = await getBatchByUuid(newSearchUuid);
            if (batch.length) {
                labelsStore.batchUuid = newSearchUuid;
                labelsStore.batchData = batch;
            }
        }
    }
})

onMounted(async () => {
    uiStore.title = "Etichette";
    uiStore.loading = true;
    if(batchUuid) {
        showBatch(batchUuid);
        router.replace("/labels");
    }
    if (!labelsStore.allBatches.length) {
        labelsStore.allBatches = await getAllBatches();
    }
    uiStore.loading = false;
});

const showBatch = async (uuid: string) => {
    transitionDirection.value = 'next';
    labelsStore.batchUuid = uuid;
    labelsStore.batchData = await getBatchByUuid(labelsStore.batchUuid);
    console.log(labelsStore.batchData)
}

const showLabel = async (uuid: string) => {
    transitionDirection.value = 'next';
    labelsStore.labelUuid = uuid;
    labelsStore.labelData = await getLabelByUuid(uuid);
}

const getPrintFileUrl = async () => {
    const printFileUrl = await getPrintFile(labelsStore.batchUuid);
    window.open(`http://localhost:3000/pdf/${printFileUrl}`, "_blank");
}

</script>