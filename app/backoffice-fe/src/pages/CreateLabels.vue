<template>
    <div class="w-full flex justify-center items-center h-full" v-if="warehouse.length">
        <inkTypeSelector @submit="create" v-for="inkType in warehouse" :ink-type="inkType">Crea etichette
        </inkTypeSelector>
    </div>
    <div v-else class="w-full flex justify-center items-center h-full">
        <h1>Nessun inchiostro disponibile per creazione etichette</h1>
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { getInkTypes, getInksByType, getAvailableInksByType } from "@/services/api.ink.service";
import { createLabels } from '@/services/api.label.service';
import { useUiStore } from '@/stores/ui';
import inkTypeSelector from '@/components/inkTypeSelector.vue';
import router from '@/router';

const uiStore = useUiStore();
const warehouse = ref([]);

onMounted(async () => {
    uiStore.title = "Crea etichette";
    uiStore.loading = true;
    const inkTypes = await getInkTypes();
    for(let i = 0; i <inkTypes.length; i++){
        const availableAmount = await getAvailableInksByType(inkTypes[i].uuid);
        if(availableAmount.length) warehouse.value[i] = {
            ...inkTypes[i],
            amount : availableAmount.length
        }
    }
    uiStore.loading = false;
});

const create = async (data: {
    color: string,
    inkType: string,
    inkTypeUuid: string,
    amount: number,
}) => {
    try {
        uiStore.loading = true;
        const res = await createLabels(data.amount, data.inkTypeUuid);
        router.push("labels");
    } catch (error) {
        alert(error.message);
        uiStore.loading = false;
    }
}

</script>