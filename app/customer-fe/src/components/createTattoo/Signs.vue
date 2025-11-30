<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Firma
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.signValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr>
    </hr>
    <div class="w-full h-36 rounded-2xl shadow-md border-1 flex items-center justify-center">Firma 1</div>
    <div class="w-full h-36 rounded-2xl shadow-md border-1 flex items-center justify-center">Firma 2</div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/button.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { Plus } from 'lucide-vue-next';

const createTattoStore = useCreateTattoStore();
</script>