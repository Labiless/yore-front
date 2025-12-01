<template>
    <div class="mx-auto flex mt-48 px-4 mb-4 w-full">
        <h1 class="font-bold text-lg">Inchiostro disponibile</h1>
    </div>
    <div class="mx-auto w-full items-start overflow-y-auto h-1/2" v-if="inks.length">
        <div @click="activeInk = ink.uuid" :class="`${ink.uuid === activeInk ? 'h-80! items-start' : ''}`"
            class="flex justify-start items-center shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="ink in inks">
            <p class="font-bold text-2xl pr-4 w-16 text-center">{{ ink.id }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">{{ ink.uuid }}</p>
                <p>{{ new Date(ink.createdAt).toDateString() }}</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { apiLabelService } from '@/services/api.inks.service';
import { userUserStore } from '@/stores/user.store';

const uiStore = useUiStore();
const userStore = userUserStore();
const inks = ref([]);
const activeInk = ref('');

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Inchiostro";
    inks.value = await apiLabelService.getLabelsByUser(userStore.getUiid);
    uiStore.loading = false;
});

</script>
<style></style>