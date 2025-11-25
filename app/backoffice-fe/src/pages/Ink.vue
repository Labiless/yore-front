<template>
    <div class="grid grid-cols-3 gap-4 pt-48 mx-auto w-5/6 items-start">
        
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { getBatchById } from '@/services/api.ink.service';
import router from '@/router';

const uiStore = useUiStore();
const inkData = ref(null);

const inkId = router.resolve().params.inkId;

onMounted(async () => {
    uiStore.title = inkId;
    uiStore.loading = true;
    // @ts-ignore
    //batchData.value = await getBatchById(inkId);
    //console.log(batchData.value);
    uiStore.loading = false;
});

</script>