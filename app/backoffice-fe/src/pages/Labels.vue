<template>
    <div class="mx-auto w-full items-start overflow-y-auto hide-scrollbar">
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
                    <div
                        v-for="labelBatch in labelsStore.allBatches"
                        :key="labelBatch.uuid"
                        class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
                        @click="showBatch(labelBatch.uuid)"
                    >
                        <p class="font-bold text-2xl">x{{ labelBatch.amount }}</p>
                        <div class="pl-4 flex justify-between items-center gap-2 flex-1 min-w-0">
                            <div class="min-w-0 flex-1">
                                <p class="flex capitalize text-sm">
                                    #{{ labelBatch.id }}
                                </p>
                                <p class="flex capitalize text-sm -translate-x-2">
                                    <Calendar class="scale-75" />{{ labelBatch.creationDate.split('T')[0] }}
                                </p>
                                <p
                                    v-if="batchStudioDisplayName(labelBatch)"
                                    class="flex items-start gap-1.5 text-xs text-gray-600 mt-1 min-w-0"
                                >
                                    <User class="size-3.5 shrink-0 mt-0.5" />
                                    <span class="break-words">{{ batchStudioDisplayName(labelBatch) }}</span>
                                </p>
                                <p v-else class="text-xs text-gray-500 mt-1">Nessun studio associato</p>
                            </div>
                        </div>
                    </div>
                    <div ref="batchesListLoadMoreSentinel" class="h-1 shrink-0" aria-hidden="true" />
                    <p
                        v-if="batchesListLoading && labelsStore.allBatches.length"
                        class="text-center text-sm text-gray-500 py-3"
                    >
                        Caricamento...
                    </p>
                    <p
                        v-else-if="!batchesListHasMore && labelsStore.allBatches.length"
                        class="text-center text-xs text-gray-400 py-3"
                    >
                        Fine elenco ({{ batchesListTotal }} lotti)
                    </p>
                    <p
                        v-else-if="!batchesListLoading && !labelsStore.allBatches.length"
                        class="text-center text-sm text-gray-500 py-6"
                    >
                        Nessun lotto etichette
                    </p>
                    <p
                        v-else-if="batchesListLoading && !labelsStore.allBatches.length"
                        class="text-center text-sm text-gray-500 py-6"
                    >
                        Caricamento...
                    </p>
                </div>
                <div v-else>
                    <div class="flex items-center mb-4">
                        <ArrowLeft @click="backToBatchesList" class="hover:cursor-pointer mr-2" />
                        <p class="font-bold text-md flex -translate-x-2">
                            <Calendar class="scale-75" />
                            {{ batchHeaderDate }} / {{ labelsStore.batchUuid }}
                        </p>
                    </div>
                    <section class="mb-4">
                        <p class="text-sm font-semibold text-gray-700 mb-2">Azioni</p>
                        <ul class="flex flex-col gap-2">
                            <li>
                                <Button
                                    type="button"
                                    class="w-full h-11 justify-start px-4 text-sm font-normal bg-white text-black border border-gray-200 shadow-sm hover:bg-blue-50"
                                    @click="getPrintFileUrl"
                                >
                                    <Download class="size-4 mr-2 shrink-0" />
                                    Scarica etichette
                                </Button>
                            </li>
                            <li v-if="batchNeedsUserAssociation">
                                <Button
                                    type="button"
                                    class="w-full h-11 justify-start px-4 text-sm font-normal bg-white text-black border border-gray-200 shadow-sm hover:bg-blue-50"
                                    @click="openAssociateUserModal"
                                >
                                    <UserPlus class="size-4 mr-2 shrink-0" />
                                    Associa a studio
                                </Button>
                            </li>
                        </ul>
                    </section>
                    <section>
                        <p class="text-sm font-semibold text-gray-700 mb-2">Etichette lotto</p>
                        <div class="flex flex-wrap items-center gap-2 p-2 mb-4 rounded-md bg-slate-200">
                            <Button @click="setBatchLabelsFilter('all')" type="button"
                                class="text-xs w-fit h-8 bg-transparent text-black"
                                :class="labelsFilter === 'all' ? 'bg-white!' : ''">
                                Tutte
                            </Button>
                            <Button @click="setBatchLabelsFilter('available')" type="button"
                                class="text-xs w-fit h-8 bg-transparent text-black"
                                :class="labelsFilter === 'available' ? 'bg-white!' : ''">
                                Disponibili
                            </Button>
                            <Button @click="setBatchLabelsFilter('burned')" type="button"
                                class="text-xs w-fit h-8 bg-transparent text-black"
                                :class="labelsFilter === 'burned' ? 'bg-white!' : ''">
                                Bruciate
                            </Button>
                        </div>
                        <p
                            v-if="!batchLabelsLoading && batchLabels.length === 0"
                            class="text-sm text-gray-600 mb-4"
                        >
                            {{ labelsFilterEmptyMessage }}
                        </p>
                        <template v-else>
                            <div
                                v-for="label in batchLabels"
                                :key="label.uuid"
                                class="flex justify-between items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-full min-w-0 h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                                @click="copyLabelUuid(label.uuid)"
                            >
                                <div class="flex items-center justify-start gap-2 min-w-0 flex-1">
                                    <Copy :size="20" class="shrink-0" />
                                    <div class="min-w-0">
                                        <p class="text-sm break-all">{{ label.uuid }}</p>
                                        <p v-if="label.userUuid" class="flex items-start gap-1.5 text-xs min-w-0 mt-1">
                                            <User class="size-3.5 shrink-0 mt-0.5" />
                                            <span class="break-words">{{ labelUserDisplayName(label.userUuid) }}</span>
                                        </p>
                                        <p v-else class="text-xs text-gray-500 mt-1">Nessun utente associato</p>
                                    </div>
                                </div>
                                <div
                                    class="w-3 h-3 rounded-full shrink-0 ml-2"
                                    :class="label.burningDate ? 'bg-red-500' : 'bg-green-500'"
                                />
                            </div>
                            <div ref="batchLoadMoreSentinel" class="h-1 shrink-0" aria-hidden="true" />
                            <p
                                v-if="batchLabelsLoading && batchLabels.length"
                                class="text-center text-sm text-gray-500 py-3"
                            >
                                Caricamento...
                            </p>
                            <p
                                v-else-if="!batchLabelsHasMore && batchLabels.length"
                                class="text-center text-xs text-gray-400 py-3"
                            >
                                Fine elenco ({{ batchLabelsTotal }} etichette)
                            </p>
                        </template>
                        <p
                            v-if="batchLabelsLoading && !batchLabels.length"
                            class="text-center text-sm text-gray-500 py-6"
                        >
                            Caricamento...
                        </p>
                    </section>
                </div>
            </Transition>
        </div>

        <div
            v-if="showAssociateModal"
            class="fixed inset-0 z-50 bg-black/55 flex justify-center items-center p-4"
            @click.self="closeAssociateUserModal"
        >
            <div class="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col p-4 shadow-xl">
                <p class="font-bold text-lg mb-1">Associa lotto a uno studio</p>
                <p class="text-sm text-gray-600 mb-4">
                    Seleziona lo studio a cui associare tutte le etichette di questo lotto.
                </p>
                <div class="overflow-y-auto flex-1 min-h-0 -mx-1 px-1">
                    <button
                        v-for="studio in studioUsers"
                        :key="studio.uuid"
                        type="button"
                        class="w-full text-left flex items-start gap-2 shadow-md p-3 bg-white mb-3 rounded-md hover:bg-blue-50 border-2 transition-colors"
                        :class="selectedAssociateUserUuid === studio.uuid ? 'border-blue-500' : 'border-transparent'"
                        @click="selectedAssociateUserUuid = studio.uuid"
                    >
                        <User class="size-4 shrink-0 mt-0.5" />
                        <span class="min-w-0 flex-1">
                            <span class="block font-bold text-sm break-words">{{ studio.businessName || studio.email }}</span>
                            <span v-if="studio.email" class="block text-xs text-gray-500 break-words">{{ studio.email }}</span>
                        </span>
                    </button>
                </div>
                <div class="flex gap-2 mt-4 pt-2 border-t border-gray-200">
                    <Button type="button" class="flex-1 bg-red-500" @click="closeAssociateUserModal">Annulla</Button>
                    <Button
                        type="button"
                        class="flex-1"
                        :disabled="!selectedAssociateUserUuid"
                        @click="confirmAssociateUser"
                    >
                        Associa
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { onMounted, onBeforeUnmount, ref, watch, computed, nextTick } from 'vue';
import { Search, User, ArrowLeft, Plus, Calendar, Download, UserPlus, Copy } from 'lucide-vue-next';
import {
    getAllBatchesPage,
    getBatchByUuidPage,
    getLabelByUuid,
    getLabelBatchByUuid,
    associateBatchToUser,
    getSignedLabelsPdfUrl,
} from '@/services/api.label.service';
import { getAllUsers } from '@/services/api.user.service';
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
const userDisplayNameByUuid = ref<Record<string, string>>({});
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const loadUserDisplayNames = async () => {
    const users = await getAllUsers();
    const map: Record<string, string> = {};
    for (const user of users) {
        if (user.uuid) {
            map[user.uuid] = user.businessName || user.email || user.uuid;
        }
    }
    userDisplayNameByUuid.value = map;
};

const labelUserDisplayName = (userUuid: string) =>
    userDisplayNameByUuid.value[userUuid] ?? userUuid;

const batchStudioDisplayName = (batch: {
    studioName?: string | null;
    studioUserUuid?: string | null;
}) => {
    if (batch.studioName) return batch.studioName;
    if (batch.studioUserUuid) {
        return labelUserDisplayName(batch.studioUserUuid);
    }
    return null;
};

const currentBatchMeta = computed(() =>
    labelsStore.allBatches.find((batch: { uuid: string }) => batch.uuid === labelsStore.batchUuid),
);

const batchHeaderDate = computed(() => {
    const date =
        activeBatchMeta.value?.creationDate ?? currentBatchMeta.value?.creationDate;
    return date ? String(date).split('T')[0] : '—';
});

const batchNeedsUserAssociation = computed(() => {
    if (!labelsStore.batchUuid) return false;
    const studioUuid =
        activeBatchMeta.value?.studioUserUuid ?? currentBatchMeta.value?.studioUserUuid;
    return !studioUuid;
});

const labelsFilter = ref<'all' | 'available' | 'burned'>('all');
const batchLabels = ref<any[]>([]);
const batchLabelsPage = ref(0);
const batchLabelsHasMore = ref(true);
const batchLabelsLoading = ref(false);
const batchLabelsTotal = ref(0);
const batchLoadMoreSentinel = ref<HTMLElement | null>(null);
let batchLoadMoreObserver: IntersectionObserver | null = null;

const BATCH_LABELS_PAGE_SIZE = 20;
const BATCHES_LIST_PAGE_SIZE = 20;

const batchesListPage = ref(0);
const batchesListHasMore = ref(true);
const batchesListLoading = ref(false);
const batchesListTotal = ref(0);
const batchesListLoadMoreSentinel = ref<HTMLElement | null>(null);
let batchesListLoadMoreObserver: IntersectionObserver | null = null;
const activeBatchMeta = ref<any>(null);

const labelsFilterEmptyMessage = computed(() => {
    if (labelsFilter.value === 'available') return 'Nessuna etichetta disponibile';
    if (labelsFilter.value === 'burned') return 'Nessuna etichetta bruciata';
    return 'Nessuna etichetta in questo lotto';
});

const showAssociateModal = ref(false);
const selectedAssociateUserUuid = ref('');
const studioUsers = ref<{ uuid: string; businessName?: string; email?: string }[]>([]);

const routeBatchUuid = () =>
    typeof route.params.labelsUuid === 'string' ? route.params.labelsUuid : '';

const isValidUuid = (uuid: string) => {
    return uuidRegex.test(uuid);
}

watch(searchUuid, async (newSearchUuid) => {
    newSearchUuid = newSearchUuid.replace(/\s+/g, '');
    if (!isValidUuid(newSearchUuid)) return;

    try {
        const label = await getLabelByUuid(newSearchUuid);
        if (label?.batchId) {
            await openBatch(label.batchId);
            return;
        }
    } catch {
        // non è un'etichetta singola
    }

    await openBatch(newSearchUuid);
});

watch(batchLoadMoreSentinel, () => {
    if (labelsStore.batchUuid) {
        setupBatchLoadMoreObserver();
    }
});

watch(batchesListLoadMoreSentinel, () => {
    if (!labelsStore.batchUuid) {
        setupBatchesListLoadMoreObserver();
    }
});

onBeforeUnmount(() => {
    batchLoadMoreObserver?.disconnect();
    batchesListLoadMoreObserver?.disconnect();
});

onMounted(async () => {
    uiStore.title = "Etichette";
    uiStore.loading = true;

    const batchFromRoute = routeBatchUuid();
    labelsStore.resetSearch();
    await loadUserDisplayNames();
    await loadBatchesList(true);
    uiStore.loading = false;
    if (batchFromRoute) {
        await openBatch(batchFromRoute);
    }
});

const setupBatchesListLoadMoreObserver = () => {
    batchesListLoadMoreObserver?.disconnect();
    if (!batchesListLoadMoreSentinel.value || labelsStore.batchUuid) return;

    batchesListLoadMoreObserver = new IntersectionObserver(
        (entries) => {
            if (
                entries[0]?.isIntersecting &&
                !labelsStore.batchUuid &&
                batchesListHasMore.value &&
                !batchesListLoading.value
            ) {
                loadBatchesList(false);
            }
        },
        { root: null, rootMargin: '120px', threshold: 0 },
    );
    batchesListLoadMoreObserver.observe(batchesListLoadMoreSentinel.value);
};

const loadBatchesList = async (reset = false) => {
    if (batchesListLoading.value) return;
    if (!reset && !batchesListHasMore.value) return;

    if (reset) {
        labelsStore.allBatches = [];
        batchesListPage.value = 0;
        batchesListHasMore.value = true;
        batchesListTotal.value = 0;
    }

    const nextPage = reset ? 1 : batchesListPage.value + 1;
    batchesListLoading.value = true;
    try {
        const res = await getAllBatchesPage({
            page: nextPage,
            limit: BATCHES_LIST_PAGE_SIZE,
        });
        if (reset) {
            labelsStore.allBatches = res.items;
        } else {
            const existing = new Set(
                labelsStore.allBatches.map((batch: { uuid: string }) => batch.uuid),
            );
            for (const item of res.items) {
                if (!existing.has(item.uuid)) {
                    labelsStore.allBatches.push(item);
                }
            }
        }
        batchesListPage.value = res.page;
        batchesListTotal.value = res.total;
        batchesListHasMore.value = res.hasMore;
    } finally {
        batchesListLoading.value = false;
        await nextTick();
        setupBatchesListLoadMoreObserver();
    }
};

const upsertBatchMeta = (batch: any) => {
    const index = labelsStore.allBatches.findIndex(
        (item: { uuid: string }) => item.uuid === batch.uuid,
    );
    if (index >= 0) {
        labelsStore.allBatches[index] = batch;
    } else {
        labelsStore.allBatches.unshift(batch);
    }
};

const resolveBatchMeta = async (uuid: string) => {
    const fromList = labelsStore.allBatches.find(
        (batch: { uuid: string }) => batch.uuid === uuid,
    );
    if (fromList) {
        activeBatchMeta.value = fromList;
        return;
    }
    try {
        activeBatchMeta.value = await getLabelBatchByUuid(uuid);
        upsertBatchMeta(activeBatchMeta.value);
    } catch {
        activeBatchMeta.value = null;
    }
};

const setupBatchLoadMoreObserver = () => {
    batchLoadMoreObserver?.disconnect();
    if (!batchLoadMoreSentinel.value) return;

    batchLoadMoreObserver = new IntersectionObserver(
        (entries) => {
            if (
                entries[0]?.isIntersecting &&
                labelsStore.batchUuid &&
                batchLabelsHasMore.value &&
                !batchLabelsLoading.value
            ) {
                loadBatchLabels(false);
            }
        },
        { root: null, rootMargin: '120px', threshold: 0 },
    );
    batchLoadMoreObserver.observe(batchLoadMoreSentinel.value);
};

const loadBatchLabels = async (reset = false) => {
    if (!labelsStore.batchUuid || batchLabelsLoading.value) return;
    if (!reset && !batchLabelsHasMore.value) return;

    if (reset) {
        batchLabels.value = [];
        batchLabelsPage.value = 0;
        batchLabelsHasMore.value = true;
        batchLabelsTotal.value = 0;
    }

    const nextPage = reset ? 1 : batchLabelsPage.value + 1;
    batchLabelsLoading.value = true;
    try {
        const res = await getBatchByUuidPage(labelsStore.batchUuid, {
            page: nextPage,
            limit: BATCH_LABELS_PAGE_SIZE,
            filter: labelsFilter.value,
        });
        if (reset) {
            batchLabels.value = res.items;
        } else {
            const existing = new Set(batchLabels.value.map((label) => label.uuid));
            for (const item of res.items) {
                if (!existing.has(item.uuid)) {
                    batchLabels.value.push(item);
                }
            }
        }
        batchLabelsPage.value = res.page;
        batchLabelsTotal.value = res.total;
        batchLabelsHasMore.value = res.hasMore;
    } finally {
        batchLabelsLoading.value = false;
        await nextTick();
        setupBatchLoadMoreObserver();
    }
};

const setBatchLabelsFilter = async (filter: 'all' | 'available' | 'burned') => {
    if (labelsFilter.value === filter) return;
    labelsFilter.value = filter;
    await loadBatchLabels(true);
};

const backToBatchesList = () => {
    labelsFilter.value = 'all';
    batchLabels.value = [];
    activeBatchMeta.value = null;
    batchLoadMoreObserver?.disconnect();
    labelsStore.resetSearch();
    setupBatchesListLoadMoreObserver();
    if (route.name !== 'labels') {
        router.replace({ name: 'labels' });
    }
};

const openBatch = async (uuid: string) => {
    if (route.name !== 'labelBatch' || route.params.labelsUuid !== uuid) {
        router.replace({ name: 'labelBatch', params: { labelsUuid: uuid } });
    }
    transitionDirection.value = 'next';
    labelsFilter.value = 'all';
    batchesListLoadMoreObserver?.disconnect();
    labelsStore.batchUuid = uuid;
    labelsStore.batchData = [];
    if (!Object.keys(userDisplayNameByUuid.value).length) {
        await loadUserDisplayNames();
    }
    await resolveBatchMeta(uuid);
    await loadBatchLabels(true);
};

const showBatch = async (uuid: string) => {
    await openBatch(uuid);
};

const copyLabelUuid = async (uuid: string) => {
    try {
        await navigator.clipboard.writeText(uuid);
        uiStore.setToast('UUID etichetta copiato negli appunti');
    } catch {
        uiStore.setToast('Errore durante la copia dell\'UUID', 'error');
    }
};

const showLabel = async (uuid: string) => {
    transitionDirection.value = 'next';
    labelsStore.labelUuid = uuid;
    labelsStore.labelData = await getLabelByUuid(uuid);
}

const getPrintFileUrl = async () => {
    const url = await getSignedLabelsPdfUrl(labelsStore.batchUuid);
    window.open(url, "_blank");
}

const openAssociateUserModal = async () => {
    uiStore.loading = true;
    try {
        const users = await getAllUsers();
        studioUsers.value = users
            .filter((u: { role?: string }) => u.role !== 'admin')
            .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
        selectedAssociateUserUuid.value = '';
        showAssociateModal.value = true;
    } catch {
        uiStore.setToast('Errore nel caricamento degli studi', 'error');
    }
    uiStore.loading = false;
}

const closeAssociateUserModal = () => {
    showAssociateModal.value = false;
    selectedAssociateUserUuid.value = '';
}

const confirmAssociateUser = async () => {
    if (!selectedAssociateUserUuid.value || !labelsStore.batchUuid) return;
    uiStore.loading = true;
    try {
        await associateBatchToUser(labelsStore.batchUuid, selectedAssociateUserUuid.value);
        const updatedBatch = await getLabelBatchByUuid(labelsStore.batchUuid);
        upsertBatchMeta(updatedBatch);
        activeBatchMeta.value = updatedBatch;
        await loadBatchLabels(true);
        await loadUserDisplayNames();
        closeAssociateUserModal();
        uiStore.setToast('Etichette associate allo studio');
    } catch {
        uiStore.setToast('Errore nell\'associazione del lotto', 'error');
    }
    uiStore.loading = false;
}

</script>