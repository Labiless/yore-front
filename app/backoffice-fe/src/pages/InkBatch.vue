<template>
    <div class="mx-auto flex pt-48 w-full mb-8">
        <ArrowLeft @click="router.push('/warehouse')" class="hover:cursor-pointer mt-1 mr-2" />
        <h1 class="font-bold text-xl">{{ batchUuid }}</h1>
    </div>
    <div class="mx-auto w-full items-start">
        <router-link :to="`${batchUuid}/${ink.uuid}`"
            class="flex mb-4 justify-start items-center shadow-2xl p-4 bg-white rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="ink in batchData">
            <p class="font-bold text-2xl pr-4">{{ ink.id }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">{{ ink.uuid }}</p>
                <p>{{ new Date(ink.creationDate).toDateString() }}</p>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { getBatchByUuid } from '@/services/api.ink.service';
import { ArrowLeft } from 'lucide-vue-next';
import router from '@/router';
import { useRoute } from 'vue-router';

const uiStore = useUiStore();
const route = useRoute();
const batchData = ref<any[]>([]);

const batchUuid = typeof route.params.batchUuid === 'string' ? route.params.batchUuid : '';

onMounted(async () => {
    uiStore.title = "Lotto caricato";
    uiStore.loading = true;
    // @ts-ignore
    batchData.value = await getBatchByUuid(batchUuid);
    uiStore.loading = false;
});

</script>