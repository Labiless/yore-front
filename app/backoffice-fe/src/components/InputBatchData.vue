<template>
    <form @submit.prevent="loadBatch" class="flex flex-col justify-center items-start gap-4 w-full">
        <div class="pb-2 border-b-1 border-black w-full flex justify-between items-end">
            <div>
                <p>{{ loadingBatchStore.color }}</p>
                <p class="text-2xl font-bold capitalize">X {{ loadingBatchStore.amount }} | {{ loadingBatchStore.inkType
                    }}</p>
            </div>
            <Trash @click="loadingBatchStore.resetLoadingBatch()" class="hover:cursor-pointer mt-1" color="red" />
        </div>
        <div class="flex flex-col justify-center items-start gap-2 w-full">
            <label for="expiration-date">Data di scadenza</label>
            <Input class="bg-white" v-model="loadingBatchStore.expirationDate" name="expiration-date" type="date"
                required />

            <label for="color">Colore</label>
            <Input class="bg-white" v-model="loadingBatchStore.color" name="color" type="text" required />

            <label for="inkFormulaUrl">Url formula inchiostro</label>
            <Input class="bg-white" v-model="loadingBatchStore.inkFormulaUrl" name="inkFormulaUrl" type="inkFormulaUrl"
                required />

            <label for="sdsUrl">Url SDS</label>
            <Input class="bg-white" v-model="loadingBatchStore.sdsUrl" name="sdsUrl" type="text" required />

            <label for="sterilizationCertUrl">Url certificato analisi chimiche</label>
            <Input class="bg-white" v-model="loadingBatchStore.sterilizationCertUrl" name="sterilizationCertUrl"
                type="text" required />

            <label for="chemistryAnalysisUrl">Url certificato sterilizzazione</label>
            <Input class="bg-white" v-model="loadingBatchStore.chemistryAnalysisUrl" name="chemistryAnalysisUrl"
                type="text" required />

            <label for="microbiologicalAnalysisUrl">Url certificato analisi microbiologiche</label>
            <Input class="bg-white" v-model="loadingBatchStore.microbiologicalAnalysisUrl"
                name="microbiologicalAnalysisUrl" type="text" required />

            <label for="productionId">Id lotto di produzione</label>
            <Input class="bg-white" v-model="loadingBatchStore.productionId" name="productionId" type="text" required />
            <Button type="submit" class="mt-4">Carica lotto</Button>
        </div>
    </form>
</template>

<script setup lang="ts">

import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import { Trash } from 'lucide-vue-next';
import { useLoadingBatchStore } from '@/stores/loadingBatch';

const loadingBatchStore = useLoadingBatchStore();

const emit = defineEmits(['loadBatch'])

const loadBatch = () => {
    emit('loadBatch');
}


</script>