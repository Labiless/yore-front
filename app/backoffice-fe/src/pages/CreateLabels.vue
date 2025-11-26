<template>
    <div class="w-full flex justify-center items-center h-full">
        <inkTypeSelector @submit="create" v-for="inkType in warehouse" :ink-type="inkType">Crea etichette
        </inkTypeSelector>
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { getInkTypes, getInksByType } from "@/services/api.ink.service";
import { createLabels } from '@/services/api.label.service';
import { useUiStore } from '@/stores/ui';
import inkTypeSelector from '@/components/inkTypeSelector.vue';
import router from '@/router';

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