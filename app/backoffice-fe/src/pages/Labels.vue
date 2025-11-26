<template>
    <div class="mx-auto pt-48 flex pt-8 w-full mb-8">
        <h1 class="font-bold text-lg">Storico caricamenti</h1>
    </div>
    <div class="mx-auto w-full overflow-y-auto items-start overflow-y-auto h-2/3">
        <router-link :to="`/labels/${batch.uuid}`"
            class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="batch in allBatches">
            <p class="font-bold text-2xl pr-4 w-16 text-center">x {{ batch.amount }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">N°{{ batch.id }}</p>
                <p>{{ new Date(batch.creationDate).toDateString() }}</p>
                <p class="text-xs">{{ batch.uuid }}</p>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { getAllBatches } from "@/services/api.label.service";
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
const allBatches = ref([])

onMounted(async () => {
    uiStore.title = "Etichette";
    uiStore.loading = true;
    allBatches.value = await getAllBatches();
    uiStore.loading = false;
});

</script>