<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Tatuaggio
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.tattooPhotoValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr>
    </hr>
    <div class="pt-4">
        <Button class="w-1/3 bg-white text-lack shadow-2xl border-1 whitespace-normal flex flex-col h-30">
            Aggiungi foto del tatuaggio
            <Plus class="border-1 rounded-full scale-150 mt-2" />
        </Button>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/button.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { Plus } from 'lucide-vue-next';

const createTattoStore = useCreateTattoStore();
</script>