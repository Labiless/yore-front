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
                </div>
                <div v-else>
                    <div class="flex items-center mb-4">
                        <ArrowLeft @click="backToBatchesList" class="hover:cursor-pointer mr-2" />
                        <p class="font-bold text-md flex -translate-x-2">
                            <Calendar class="scale-75" /> {{ labelsStore.batchData[0].creationDate.split('T')[0] }} /
                            {{ labelsStore.batchUuid }}
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
                            <Button @click="labelsFilter = 'all'" type="button"
                                class="text-xs w-fit h-8 bg-transparent text-black"
                                :class="labelsFilter === 'all' ? 'bg-white!' : ''">
                                Tutte
                            </Button>
                            <Button @click="labelsFilter = 'available'" type="button"
                                class="text-xs w-fit h-8 bg-transparent text-black"
                                :class="labelsFilter === 'available' ? 'bg-white!' : ''">
                                Disponibili
                            </Button>
                            <Button @click="labelsFilter = 'burned'" type="button"
                                class="text-xs w-fit h-8 bg-transparent text-black"
                                :class="labelsFilter === 'burned' ? 'bg-white!' : ''">
                                Bruciate
                            </Button>
                        </div>
                        <p v-if="filteredBatchLabels.length === 0" class="text-sm text-gray-600 mb-4">
                            {{ labelsFilterEmptyMessage }}
                        </p>
                        <div
                            v-else
                            class="flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-full min-w-0 h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                            v-for="label in filteredBatchLabels"
                            :key="label.uuid">
                            <p class="font-bold text-md shrink-0">{{ label.id }}</p>
                            <div class="pl-4 flex justify-between items-center gap-2 flex-1 min-w-0">
                                <div class="min-w-0 flex-1">
                                    <p v-if="label.userUuid" class="flex items-start gap-1.5 text-xs min-w-0">
                                        <User class="size-3.5 shrink-0 mt-0.5" />
                                        <span class="break-words">{{ labelUserDisplayName(label.userUuid) }}</span>
                                    </p>
                                    <p v-else class="text-xs text-gray-500">Nessun utente associato</p>
                                </div>
                                <p class="w-3 h-3 rounded-full shrink-0"
                                    :class="label.burningDate ? 'bg-red-500' : 'bg-green-500'"></p>
                            </div>
                        </div>
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

import { onMounted, ref, watch, computed } from 'vue';
import { Search, User, ArrowLeft, Plus, Calendar, Download, UserPlus } from 'lucide-vue-next';
import { getAllBatches, getBatchByUuid, getLabelByUuid, associateBatchToUser } from "@/services/api.label.service";
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

const batchNeedsUserAssociation = computed(() => {
    const labels = labelsStore.batchData;
    if (!labels.length) return false;
    return labels.every((label: { userUuid?: string | null }) => !label.userUuid);
});

const labelsFilter = ref<'all' | 'available' | 'burned'>('all');

const filteredBatchLabels = computed(() => {
    const labels = labelsStore.batchData;
    if (labelsFilter.value === 'available') {
        return labels.filter((label: { burningDate?: string | null }) => !label.burningDate);
    }
    if (labelsFilter.value === 'burned') {
        return labels.filter((label: { burningDate?: string | null }) => !!label.burningDate);
    }
    return labels;
});

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
    await loadUserDisplayNames();
    labelsStore.allBatches = await getAllBatches();
    uiStore.loading = false;
});

const backToBatchesList = () => {
    labelsFilter.value = 'all';
    labelsStore.resetSearch();
};

const showBatch = async (uuid: string) => {
    transitionDirection.value = 'next';
    labelsFilter.value = 'all';
    labelsStore.batchUuid = uuid;
    labelsStore.batchData = await getBatchByUuid(labelsStore.batchUuid);
    if (!Object.keys(userDisplayNameByUuid.value).length) {
        await loadUserDisplayNames();
    }
}

const showLabel = async (uuid: string) => {
    transitionDirection.value = 'next';
    labelsStore.labelUuid = uuid;
    labelsStore.labelData = await getLabelByUuid(uuid);
}

const getPrintFileUrl = async () => {
    window.open(`https://res.cloudinary.com/dctifrnyc/labels/printfile_${labelsStore.batchUuid}.pdf`, "_blank");
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
        labelsStore.batchData = await getBatchByUuid(labelsStore.batchUuid);
        labelsStore.allBatches = await getAllBatches();
        await loadUserDisplayNames();
        closeAssociateUserModal();
        uiStore.setToast('Etichette associate allo studio');
    } catch {
        uiStore.setToast('Errore nell\'associazione del lotto', 'error');
    }
    uiStore.loading = false;
}

</script>