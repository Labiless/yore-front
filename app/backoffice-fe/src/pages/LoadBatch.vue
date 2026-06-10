<template>
    <div class="mx-auto w-full flex items-center justify-center overflow-y-auto hide-scrollbar min-h-full">
        <Transition>
            <div v-if="!loadingBatchStore.amount"
                class="w-full flex flex-col md:flex-row justify-center items-center overflow-y-auto">
                <inkTypeSelector @submit="addAmount" v-for="inkType in inkTypes" :inkType="inkType">Carica inchiostro
                </inkTypeSelector>
            </div>
            <div v-else class="flex flex-col justify-center items-center w-full mx-auto overflow-y-auto pt-100 pb-40 md:pt-0">
                <InputBatchData @loadBatch="loadBatch" />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import inkTypeSelector from '@/components/inkTypeSelector.vue';
import InputBatchData from '@/components/InputBatchData.vue';
import { getInkTypes, loadInks } from '@/services/api.ink.service';
import { useLoadingBatchStore } from '@/stores/loadingBatch';
import { onMounted, ref } from 'vue';
import router from '@/router';
import { useWharehouseStore } from '@/stores/warehouse.store';
const loadingBatchStore = useLoadingBatchStore();
const inkTypes: any = ref(null);
const uiStore = useUiStore();
const warehouseStore = useWharehouseStore();

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Carica Lotto";
    inkTypes.value = await getInkTypes();
    uiStore.loading = false;
})

const addAmount = (data: {
    color: string,
    inkType: string,
    inkTypeUuid: string,
    amount: number,
}) => {
    loadingBatchStore.initBatchLoading(data);
}

const loadBatch = async () => {
    uiStore.loading = true;
    const data = loadingBatchStore.$state;
    const date = new Date(data.expirationDate);
    data.expirationDate = date.toISOString();
    const res = await loadInks(data);
    if (res) {
        loadingBatchStore.resetLoadingBatch()
        await warehouseStore.refreshWarehouse();
        router.push(`/warehouse/${res.batchId}`);
        uiStore.loading = false;
        uiStore.setToast('Inchiostri caricati correttamente');
    } else {
        uiStore.loading = false;
        uiStore.setToast('Errore nel caricamento inchiostri');
    }
}

</script>

<style scoped>
label {
    font-size: 12px;
}

input {
    background: var(--color-white);
}
</style>