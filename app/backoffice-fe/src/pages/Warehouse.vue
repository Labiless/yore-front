<template>
    <div class="grid grid-cols-3 gap-4 pt-48 mx-auto w-5/6 items-start">
        <router-link :to="`/warehosue/${batch.uuid}`" class="flex justify-start items-center shadow-2xl p-4 bg-white rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="batch in allBatches">
            <p class="font-bold text-2xl pr-4">x {{ batch.amount }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">N°{{ batch.id }}</p>
                <p>{{ new Date(batch.creationDate).toDateString() }}</p>
                <p class="text-xs">{{ batch.uuid }}</p>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue';
import { getAllBatches } from "@/services/api.ink.service";
import { useUiStore } from '@/stores/ui';
import { ref } from 'vue';

const uiStore = useUiStore();
const allBatches = ref([]);

onMounted(async () => {
    uiStore.title = "Magazzino Inchiostri";
    uiStore.loading = true;
    allBatches.value = await getAllBatches();
    console.log(allBatches);
    uiStore.loading = false;
});

</script>