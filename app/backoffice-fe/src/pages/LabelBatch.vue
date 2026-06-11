<template>
    <div class="mx-auto flex pt-48 w-full mb-8">
        <ArrowLeft @click="router.push('/labels')" class="hover:cursor-pointer mt-1 mr-2" />
        <h1 class="font-bold text-xl">{{ batchUuid }}</h1>
    </div>
    <div class="mx-auto flex w-full mb-8">
        <Button @click="getPrintFileUrl">
            <Printer class="hover:cursor-pointer mt-1 mr-2" />
            Stampa etichette
        </Button>
    </div>
    <div class="mx-auto w-full items-start">
        <router-link :to="`${batchUuid}/${label.uuid}`"
            class="flex mb-4 justify-start items-center shadow-2xl p-4 bg-white rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="label in batchData">
            <p class="font-bold text-2xl pr-4">{{ label.id }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold flex justify-start items-center"><span class="font-normal text-xs w-24 block">uuid
                        etichetta:</span> {{ label.uuid }}</p>
                <p class="font-bold flex justify-start items-center"><span class="font-normal text-xs w-24 block">uuid
                        inchiostro:</span> {{ label.inkUuid }}</p>
                <p class="text-sm flex justify-start items-center"><span class="font-normal text-xs w-24 block">data
                        creazione:</span> {{ new Date(label.creationDate).toDateString() }}</p>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import Button from '@shared/components/ui/button/Button.vue';
import { onMounted, ref } from 'vue';
import { getBatchByUuid, getSignedLabelsPdfUrl } from '@/services/api.label.service';
import { Printer, ArrowLeft } from 'lucide-vue-next';
import router from '@/router';
import { useRoute } from 'vue-router';

const uiStore = useUiStore();
const route = useRoute();
const batchData = ref<any[]>([]);

const batchUuid = typeof route.params.labelsUuid === 'string' ? route.params.labelsUuid : '';

onMounted(async () => {
    uiStore.title = "Lotto etichette";
    uiStore.loading = true;
    console.log(batchUuid);
    // @ts-ignore
    batchData.value = await getBatchByUuid(batchUuid);
    if (batchData.value[0]) console.log(batchData.value[0].uuid);
    uiStore.loading = false;
});

const getPrintFileUrl = async () => {
    const url = await getSignedLabelsPdfUrl(batchUuid);
    window.open(url, "_blank");
}

</script>