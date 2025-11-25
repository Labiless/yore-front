<template>

</template>

<script setup lang="ts">

import { onMounted } from 'vue';
import { getAllBatches } from "@/services/api.ink.service";
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

onMounted(async () => {
    uiStore.title = "Magazzino Inchiostri";
    uiStore.loading = true;
    const allBatches = await getAllBatches();
    console.log(allBatches);
    uiStore.loading = false;
});

</script>