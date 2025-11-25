<template>
    <div class="grid grid-cols-3 gap-4 pt-48 mx-auto w-5/6 items-start">
        <router-link :to="`${batchId}/${ink.uuid}`"
            class="flex justify-start items-center shadow-2xl p-4 bg-white rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
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
import { getBatchById } from '@/services/api.ink.service';
import router from '@/router';

const uiStore = useUiStore();
const batchData = ref(null);

const batchId = router.resolve().params.batchId;

onMounted(async () => {
    uiStore.title = batchId;
    uiStore.loading = true;
    // @ts-ignore
    batchData.value = await getBatchById(batchId);
    console.log(batchData.value);
    uiStore.loading = false;
});

</script>