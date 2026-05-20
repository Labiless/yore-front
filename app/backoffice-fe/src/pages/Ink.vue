<template>
    <div class="grid grid-cols-3 gap-4 pt-48 mx-auto w-5/6 items-start">
        
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { getInkByUuid } from '@/services/api.ink.service';
import { useRoute } from 'vue-router';

const uiStore = useUiStore();
const route = useRoute();
const inkData = ref<any>(null);

const inkUuid = typeof route.params.inkUuid === 'string' ? route.params.inkUuid : '';

onMounted(async () => {
    uiStore.title = "Singolo inchiostro";
    uiStore.loading = true;
    // @ts-ignore
    inkData.value = await getInkByUuid(inkUuid);
    uiStore.loading = false;
});

</script>