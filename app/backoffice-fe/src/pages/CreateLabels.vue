<template>
    <div class="w-full flex justify-center items-center h-full">
        <inkTypeSelector v-for="inkType in warehouse" :ink-type="inkType" />
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { getInkTypes, getInksByType } from "@/services/api.ink.service";
import { useUiStore } from '@/stores/ui';
import inkTypeSelector from '@/components/inkTypeSelector.vue';

const uiStore = useUiStore();
const inkTypes = ref([]);
const warehouse = ref([]);

onMounted(async () => {
    uiStore.title = "Crea etichette";
    uiStore.loading = true;
    inkTypes.value = await getInkTypes();
    warehouse.value = (await getInksByType()).map(el => ({
        ...el,
        ...inkTypes.value.filter(newEl => newEl.uuid === el.inkTypeUuid)[0]
    }))
    uiStore.loading = false;
});

const addAmount = (data: {
    color: string,
    inkType: string,
    inkTypeUuid: string,
    amount: number,
}) => {
    //loadingBatchStore.initBatchLoading(data);
}

</script>