<template>
    <div class="w-full flex md:flex-row flex-col justify-center items-center h-full">
        <HomeButton icon="Upload" link="/loadbatch">Carica Inchiostro</HomeButton>
        <HomeButton icon="Barcode" link="/createlabels">Genera etichette</HomeButton>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { onMounted } from 'vue';
import HomeButton from '@shared/components/ui/HomeButton.vue';

const uiStore = useUiStore();

onMounted(() => {
    uiStore.title = "Home";
});

</script>
<style></style>