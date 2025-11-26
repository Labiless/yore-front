<template>
    <Transition>
        <div v-if="!loadingBatchStore.amount" class="w-full flex justify-center items-center h-full">
            <inkTypeSelector @submit="addAmount" v-for="inkType in inkTypes" :inkType="inkType" />
        </div>
        <div v-else class="flex justify-center items-center w-full h-full mx-auto">
            <ArrowLeft @click="loadingBatchStore.resetLoadingBatch()" class="hover:cursor-pointer mt-1" />
            <InputBatchData @loadBatch="loadBatch" />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { ArrowLeft } from 'lucide-vue-next';
import inkTypeSelector from '@/components/inkTypeSelector.vue';
import InputBatchData from '@/components/InputBatchData.vue';
import { getInkTypes, loadInks } from '@/services/api.ink.service';
import { useLoadingBatchStore } from '@/stores/loadingBatch';
import { onMounted, ref } from 'vue';
import router from '@/router';

const loadingBatchStore = useLoadingBatchStore();
const inkTypes: any = ref(null);
const uiStore = useUiStore();

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Carica Lotto";
    inkTypes.value = await getInkTypes();
    console.log(inkTypes.value)
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
    const data = loadingBatchStore.$state;
    const date = new Date(data.expirationDate);
    data.expirationDate = date.toISOString();
    const res = await loadInks(data);
    if (res) {
        loadingBatchStore.resetLoadingBatch()
        router.push('/warehouse');
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