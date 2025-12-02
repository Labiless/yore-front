<template>
    <div class="mx-auto flex mt-48 px-4 mb-4 w-full">
        <h1 class="font-bold text-lg">Storico tatuaggi</h1>
    </div>
    <div class="mx-auto w-full items-start overflow-y-auto h-1/2">
        <div @click="showTattoo(tattoo)" :class="`${tattoo.uuid === tattoo ? 'h-80! items-start' : ''} ${tattoo.status === 'CLOSE' ? 'green' : ''} ${tattoo.uuid === activeTattoo ? 'h-80! items-start' : ''}`"
            class="flex justify-start items-center shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="tattoo in tattoosStore.tattoos">
            <p class="font-bold text-2xl pr-4 w-16 text-center">{{ tattoo.id }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">{{ tattoo.uuid }}</p>
                <p>{{ new Date(tattoo.createdAt).toDateString() }}</p>
                <p>{{ tattoo.status }}</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { useTatoosStore } from '@/stores/tattoos.store';
import { getAllTattoos } from '@/services/api.tattoo.service';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import router from '@/router';

const uiStore = useUiStore();
const tattoosStore = useTatoosStore();
const createTattooStore = useCreateTattoStore();
const activeTattoo = ref('');

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Tatuaggi";
    if(tattoosStore.tattoos.length === 0){
        const res = await getAllTattoos(); 
        tattoosStore.tattoos = res.sort((a: any, b: any) => b.id - a.id);
    }
    uiStore.loading = false;
});

const showTattoo = (tattoo: any) =>{
    if(tattoo.status !== 'CLOSE'){
        goToTatto(tattoo.uuid);
        return
    };
    activeTattoo.value = tattoo.uuid;
}

const goToTatto = (tattooUuid: string) => {
    createTattooStore.uuid = tattooUuid
    router.push('createtattoo');
}

</script>
<style scoped>
.green{
    background-color: rgb(148, 255, 148);
}
</style>