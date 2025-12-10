<template>
    <div class="grid grid-cols-3 gap-4 pt-48 mx-auto w-5/6 items-start">
        
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { getInkByUuid } from '@/services/api.ink.service';
import router from '@/router';

const uiStore = useUiStore();
const inkData = ref(null);

const inkUuid = (() => {
    try {
        return router.resolve().params.inkUuid as string;
    } catch {
        return '';
    }
})()

onMounted(async () => {
    uiStore.title = "Singolo inchiostro";
    uiStore.loading = true;
    // @ts-ignore
    inkData.value = await getInkByUuid(inkUuid);
    uiStore.loading = false;
});

</script>