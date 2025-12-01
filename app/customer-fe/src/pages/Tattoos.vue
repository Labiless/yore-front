<template>
    <div class="mx-auto flex mt-48 px-4 mb-4 w-full">
        <h1 class="font-bold text-lg">Storico tatuaggi</h1>
    </div>
    <div class="mx-auto w-full items-start overflow-y-auto h-1/2">
        <div @click="goToTatto(tattoo.uuid)" :class="`${tattoo.uuid === tattoo ? 'h-80! items-start' : ''}`"
            class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="tattoo in tattooStore.tattoos">
            <p class="font-bold text-2xl pr-4 w-16 text-center">{{ tattoo.id }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">{{ tattoo.uuid }}</p>
                <p>{{ new Date(tattoo.createdAt).toDateString() }}</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { onMounted } from 'vue';
import { useTatoosStore } from '@/stores/tattoos.store';
import { getAllTattoos } from '@/services/api.tattoo.service';
import router from '@/router';

const uiStore = useUiStore();
const tattooStore = useTatoosStore();


onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Tatuaggi";
    if(tattooStore.tattoos.length === 0){
        tattooStore.tattoos = await getAllTattoos();
    }
    uiStore.loading = false;
});

const goToTatto = (tattooUuid: string) => {
    console.log(tattooUuid);
    router.push('createtattoo');
}

</script>
<style></style>