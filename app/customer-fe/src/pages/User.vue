<template>
    <div class="flex justify-center items-center h-full">

    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { onMounted } from 'vue';

const uiStore = useUiStore();

onMounted(() => {
    uiStore.title = "Utente";
});

</script>
<style></style>