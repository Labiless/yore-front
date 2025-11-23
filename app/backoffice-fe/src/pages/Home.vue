<template>
    <div class="flex justify-center items-center">
        <HomeButton icon="Upload" link="/home">Carica Lotto</HomeButton>
        <HomeButton icon="Barcode" link="/">Genera etichette</HomeButton>
    </div>
</template>
<script setup>

import { useUiStore } from '@/stores/ui';
import { onMounted } from 'vue';
import HomeButton from '@shared/components/ui/HomeButton.vue';

const uiStore = useUiStore();

onMounted(() => {
    uiStore.title = "Home";
});

</script>
<style></style>