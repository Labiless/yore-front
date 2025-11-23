<template>

</template>
<script setup>

import { useUiStore } from '@/stores/ui';
import { onMounted } from 'vue';

const uiStore = useUiStore();

onMounted(() => {
    uiStore.title = "HOME";
});

</script>
<style>
    
</style>