<template>
    <div class="w-full flex justify-center items-center h-full">
        <inkTypeSelector v-for="inkType in inkTypes" :inkType="inkType" />
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import inkTypeSelector from '@/components/inkTypeSelector.vue';
import { getInkTypes } from '@/services/api.ink.service';
import { onMounted, ref } from 'vue';

const inkTypes : any = ref(null);
const uiStore = useUiStore();

onMounted(async () => {
    uiStore.title = "Carica Lotto";
    inkTypes.value = await getInkTypes();
})


</script>