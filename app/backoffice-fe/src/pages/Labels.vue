<template>
    <div class="mx-auto w-full items-start overflow-y-auto h-full px-4">
        <router-link to="/createlabels">
            <Button class="w-full h-12 mb-4">
                <Plus /> Crea etichette
            </Button>
        </router-link>
        <div class="flex justify-start items-center">
            <Input v-model="searchUuid" class="w-2/3 shadow-xl" type="text" />
            <Search class="ml-2" />
        </div>
        <div class="flex items-center gap-2 p-2 my-4 mx-auto rounded-md bg-slate-200">
            <Button @click="showTab = 0" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 0 ? 'bg-white!' : 'shadow-none'}`">Lotti etichette</Button>
        </div>

        <div v-show="showTab === 0">
            <Transition>
                <div v-if="!labelsStore.batchUuid">
                    <div  @click="showBatch(labelBatch.uuid)" class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
                        v-for="labelBatch in labelsStore.allBatches">
                        <p class="font-bold text-2xl">x{{ labelBatch.amount }}</p>
                        <div class="pl-4 flex justify-between items-center w-11/12">
                            <div>
                                <p class="flex capitalize text-sm">
                                    #{{ labelBatch.id }}
                                </p>
                                <p class="flex capitalize text-sm -translate-x-2">
                                    <Calendar class="scale-75" />{{ labelBatch.creationDate.split('T')[0] }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="flex items-center mb-4">
                        <ArrowLeft @click="labelsStore.resetSearch()" class="hover:cursor-pointer mr-2" />
                        <p class="font-bold text-md flex -translate-x-2">
                            <Calendar class="scale-75" /> {{ labelsStore.batchData[0].creationDate.split('T')[0] }} /
                            {{ labelsStore.batchUuid }}
                        </p>
                    </div>
                    <div class="flex gap-2 mb-4">
                        <Button @click="getPrintFileUrl" class="text-xs">Scarica etichette</Button>
                    </div>
                    <div
                        class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                        :class="`${''}`" v-for="label in labelsStore.batchData">
                        <p class="font-bold text-md">{{ label.id }}</p>
                        <div class="pl-4 flex justify-between items-center w-11/12">
                            <div>
                                <p class="flex items-center text-xs" v-if="label.userUuid">
                                    <User class="scale-50" />{{ label.userUuid }}
                                </p>
                            </div>
                            <p class="w-3 h-3 rounded-full"
                                :class="`${label.userUuid ? 'bg-orange-500' : 'bg-green-500'}`"></p>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { Search, Printer, User, ArrowLeft, Plus, Calendar } from 'lucide-vue-next';
import { getAllBatches, getBatchByUuid, getLabelByUuid, getPrintFile } from "@/services/api.label.service";
import { useUiStore } from '@/stores/ui';
import { useLabelsStore } from '@/stores/lables.store';
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import router from '@/router';
import { useRoute } from 'vue-router';

const uiStore = useUiStore();
const labelsStore = useLabelsStore();
const route = useRoute();
const transitionDirection = ref('next');

const showTab = ref(0);

const searchUuid = ref('');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const routeBatchUuid = () =>
    typeof route.params.labelsUuid === 'string' ? route.params.labelsUuid : '';

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

    const batchFromRoute = routeBatchUuid();
    if (batchFromRoute) {
        await router.replace('/labels');
    }

    labelsStore.resetSearch();
    labelsStore.allBatches = await getAllBatches();
    uiStore.loading = false;
});

const showBatch = async (uuid: string) => {
    transitionDirection.value = 'next';
    labelsStore.batchUuid = uuid;
    labelsStore.batchData = await getBatchByUuid(labelsStore.batchUuid);
}

const showLabel = async (uuid: string) => {
    transitionDirection.value = 'next';
    labelsStore.labelUuid = uuid;
    labelsStore.labelData = await getLabelByUuid(uuid);
}

const getPrintFileUrl = async () => {
    window.open(`https://res.cloudinary.com/dctifrnyc/labels/printfile_${labelsStore.batchUuid}.pdf`, "_blank");
}

</script>