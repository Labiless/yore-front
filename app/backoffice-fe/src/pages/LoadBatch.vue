<template>
    <div v-if="!loadingBatchStore.amount" class="w-full flex justify-center items-center h-full">
        <inkTypeSelector @addAmount="addAmount" v-for="inkType in inkTypes" :inkType="inkType" />
    </div>
    <div v-else class="flex justify-center items-center w-full h-full mx-auto">
        <div class="flex justify-center items-start gap-4">
            <ArrowLeft @click="loadingBatchStore.resetLoadingBatch()" class="hover:cursor-pointer mt-1" />
            <div class="pr-4">
                <p class="text-2xl font-bold capitalize">{{ loadingBatchStore.inkType }}</p>
                <p>{{ loadingBatchStore.color }}</p>
                <p class="font-bold">X {{ loadingBatchStore.amount }}</p>
            </div>
            <div class="flex flex-col justify-center items-start gap-2 border-l-1 border-black pl-4">
                <label for="expiration-date">Data di scadenza</label>
                <Input v-model="loadingBatchStore.expirationDate" name="expiration-date" type="date" />

                <label for="color">Colore</label>
                <Input v-model="loadingBatchStore.color" name="color" type="text" />

                <label for="inkFormulaUrl">Url formula inchiostro</label>
                <Input v-model="loadingBatchStore.inkFormulaUrl" name="inkFormulaUrl" type="inkFormulaUrl" />

                <label for="sdsUrl">Url SDS</label>
                <Input v-model="loadingBatchStore.sdsUrl" name="sdsUrl" type="text" />

                <label for="sterilizationCertUrl">Url certificato analisi chimiche</label>
                <Input v-model="loadingBatchStore.sterilizationCertUrl" name="sterilizationCertUrl" type="text" />

                <label for="chemistryAnalysisUrl">Url certificato sterilizzazione</label>
                <Input v-model="loadingBatchStore.chemistryAnalysisUrl" name="chemistryAnalysisUrl" type="text" />

                <label for="microbiologicalAnalysisUrl">Url certificato analisi microbiologiche</label>
                <Input v-model="loadingBatchStore.microbiologicalAnalysisUrl" name="microbiologicalAnalysisUrl" type="text" />

                <label for="productionId">Id lotto di prudzione</label>
                <Input v-model="loadingBatchStore.productionId" name="productionId" type="text" />
                <Button @click="loadBatch" class="mt-4">Carica lotto</Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { ArrowLeft } from 'lucide-vue-next';
import inkTypeSelector from '@/components/inkTypeSelector.vue';
import { getInkTypes, loadInks } from '@/services/api.ink.service';
import { useLoadingBatchStore } from '@/stores/loadingBatch';
import Input from '@shared/components/ui/input/input.vue';
import Button from '@shared/components/ui/button/button.vue';
import { onMounted, ref } from 'vue';
import router from '@/router';

const loadingBatchStore = useLoadingBatchStore();
const inkTypes: any = ref(null);
const uiStore = useUiStore();

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Carica Lotto";
    inkTypes.value = await getInkTypes();
    uiStore.loading = false;
})

const addAmount = (data: {
    color: string
    inkType: string
    amount: number
}) => {
    loadingBatchStore.initBatchLoading(data);
}

const loadBatch = async () => {
    const data = loadingBatchStore.$state;
    const date = new Date(data.expirationDate);
    data.expirationDate = date.toISOString();
    const res = await loadInks(data);
    if(res){
        router.push('/home');
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