<template>
    <div class="mx-auto w-full items-start overflow-y-auto hide-scrollbar">
        <router-link to="/loadbatch">
            <Button class="w-full h-12 mb-4 ">
                <Plus /> Carica nuovi inchiostri
            </Button>
        </router-link>
        <h1 class="text-2xl mb-2 mt-4">Magazzino inchiostro</h1>
        <SearchBar v-model="searchUuid" @search="performSearch" />
        <div class="flex items-center gap-2 p-2 my-4 mx-auto rounded-md bg-slate-200">
            <Button @click="selectMagazzinoTab" type="button" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 0 ? 'bg-white!' : ''}`">Magazzino</Button>
            <Button @click="selectLottiTab" type="button" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 1 ? 'bg-white!' : ''}`">
                Lotti caricamento
            </Button>
        </div>
        <div v-show="showTab === 0" class="pb-24">
            <div v-if="warehouseStore.warehouse.length"
                class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
                v-for="inks in warehouseStore.warehouse"
                :key="inks.uuid">
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
            <p v-else class="text-sm text-gray-600 px-1">nessun inchiostro</p>
        </div>
        <div v-show="showTab === 1" class="pb-24">
            <Transition>
                <div v-if="!warehouseStore.batchUuid">
                    <div v-if="warehouseStore.allBatches.length">
                        <div @click="showBatch(batch.uuid)"
                            class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
                            v-for="batch in warehouseStore.allBatches"
                            :key="batch.uuid">
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
                    <p v-else class="text-sm text-gray-600 px-1">nessun lotto</p>
                </div>
                <div v-else-if="warehouseStore.batchData.length">
                    <div class="flex items-start gap-2 mb-4">
                        <ArrowLeft @click="backToBatchesList" class="hover:cursor-pointer shrink-0 mt-1" />
                        <div class="min-w-0">
                            <p class="font-bold text-md flex items-center gap-1">
                                <Calendar class="scale-75 shrink-0" />
                                {{ batchHeaderDate }}
                            </p>
                            <p class="text-xs text-gray-500 break-all">{{ warehouseStore.batchUuid }}</p>
                        </div>
                    </div>

                    <div v-if="batchDocuments.length" class="mb-4">
                        <p class="text-sm font-semibold text-gray-700 mb-2">Documenti</p>
                        <ul class="flex flex-col gap-2">
                            <li v-for="doc in batchDocuments" :key="doc.label">
                                <a
                                    :href="doc.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="block"
                                >
                                    <Button
                                        type="button"
                                        class="w-full h-11 justify-start px-4 text-sm font-normal bg-white text-black border border-gray-200 shadow-sm hover:bg-blue-50"
                                    >
                                        <FileText class="size-4 mr-2 shrink-0" />
                                        {{ doc.label }}
                                    </Button>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <section v-if="batchInkSummary">
                        <p class="text-sm font-semibold text-gray-700 mb-2">Inchiostri nel lotto</p>
                        <div
                            class="flex justify-start items-center shadow-md p-4 pl-4 bg-white rounded-md w-full h-fit">
                            <p class="font-bold text-2xl">x{{ batchInkSummary.count }}</p>
                            <div class="pl-4 flex items-center border-l border-black ml-2 min-w-0">
                                <Droplet class="m-2 shrink-0" />
                                <div class="min-w-0">
                                    <p class="font-bold capitalize truncate">{{ batchInkSummary.name }}</p>
                                    <p class="text-xs text-gray-600 truncate">{{ batchInkSummary.color }}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted, computed } from 'vue';
import { getBatchByUuid, getInkByUuid } from "@/services/api.ink.service";
import { ArrowLeft, FileText, Plus, Droplet, Calendar } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { useWharehouseStore } from '@/stores/warehouse.store';
import Button from '@shared/components/ui/button/Button.vue';
import SearchBar from '@/components/SearchBar.vue';
import { useRoute, useRouter } from 'vue-router';
import { useUniversalSearch, getUuidPrefix, UUID_REGEX } from '@/composables/useUniversalSearch';

const showTab = ref(0);
const route = useRoute();
const router = useRouter();
const batchUuid = typeof route.params.batchUuid === 'string' ? route.params.batchUuid : '';

const uiStore = useUiStore();
const warehouseStore = useWharehouseStore();
const transitionDirection = ref('next');
const { navigateByUuid } = useUniversalSearch();

const batchHeaderDate = computed(() => {
    const first = warehouseStore.batchData[0];
    if (!first?.creationDate) return '';
    return String(first.creationDate).split('T')[0];
});

const batchDocuments = computed(() => {
    const first = warehouseStore.batchData[0];
    if (!first) return [];
    return [
        { label: 'Formula inchiostro', url: first.inkFormulaUrl },
        { label: 'SDS', url: first.sdsUrl },
        { label: 'Certificato sterilizzazione', url: first.sterilizationCertUrl },
        { label: 'Analisi chimiche', url: first.chemistryAnalysisUrl },
        { label: 'Analisi microbiologiche', url: first.microbiologicalAnalysisUrl },
    ].filter((doc) => !!doc.url);
});

const batchInkSummary = computed(() => {
    const data = warehouseStore.batchData;
    if (!data.length) return null;
    const first = data[0];
    return {
        count: data.length,
        name: first.inkType ?? 'Inchiostro',
        color: first.color ?? '',
    };
});

const searchUuid = ref('');

const performSearch = async (uuid: string) => {
    uuid = uuid.replace(/\s+/g, '');
    if (!UUID_REGEX.test(uuid)) return;

    const prefix = getUuidPrefix(uuid);

    // cross-page navigation for non-warehouse UUIDs
    if (prefix && !['ink', 'ibt'].includes(prefix)) {
        navigateByUuid(uuid);
        return;
    }

    showTab.value = 1;
    try {
        const ink = await getInkByUuid(uuid);
        if (ink?.batchId) {
            warehouseStore.batchUuid = ink.batchId;
            warehouseStore.batchData = [ink];
            return;
        }
    } catch { /* not an ink UUID */ }

    try {
        const batch = await getBatchByUuid(uuid);
        if (batch.length) {
            warehouseStore.batchUuid = uuid;
            warehouseStore.batchData = batch;
        }
    } catch { /* not a batch UUID */ }
};

watch(searchUuid, async (newVal) => {
    await performSearch(newVal);
});

onMounted(async () => {
    uiStore.title = "Magazzino";
    uiStore.loading = true;
    await warehouseStore.refreshWarehouse();
    if (batchUuid) {
        await showBatch(batchUuid);
        showTab.value = 1;
    }
    const inkFromQuery = typeof route.query.ink === 'string' ? route.query.ink : '';
    if (inkFromQuery) {
        await performSearch(inkFromQuery);
    }
    uiStore.loading = false;
});

const backToBatchesList = () => {
    warehouseStore.resetSearch();
    if (route.params.batchUuid) {
        router.replace({ name: 'warehouse' });
    }
};

const selectMagazzinoTab = () => {
    showTab.value = 0;
};

const selectLottiTab = () => {
    showTab.value = 1;
    backToBatchesList();
};

const showBatch = async (uuid: string) => {
    transitionDirection.value = 'next';
    warehouseStore.batchUuid = uuid;
    warehouseStore.batchData = await getBatchByUuid(warehouseStore.batchUuid);
    if (route.params.batchUuid !== uuid) {
        router.replace({ name: 'inkBatch', params: { batchUuid: uuid } });
    }
};

</script>

<style scoped></style>
