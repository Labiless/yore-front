<template>
    <div class="flex justify-center items-center h-full">
        <HomeButton icon="Plus" link="/createtattoo" @click="createTattoStore.resetTattoo">Nuovo tatuaggio</HomeButton>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { onMounted } from 'vue';
import HomeButton from '@shared/components/ui/HomeButton.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';

const uiStore = useUiStore();
const createTattoStore = useCreateTattoStore();

onMounted(() => {
    uiStore.title = "Home";
});

</script>
<style></style>