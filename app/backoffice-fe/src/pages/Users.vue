<template>

</template>

<script setup lang="ts">

import { onMounted } from 'vue';
import { getAllBatches } from "@/services/api.ink.service";
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

onMounted(async () => {
    uiStore.title = "Utenti";
    uiStore.loading = true;
    uiStore.loading = false;
});

</script>