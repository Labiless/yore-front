<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Inchiostro
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.inksValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr />
    <Button class="w-full">Scansiona Inchiostro</Button>
    <Input placeholder="Id inchiostro"></Input>
    <div class="" v-if="createTattoStore.inks.length">
        <p>Inchostri scansionati</p>

    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/button.vue';
import Input from '@shared/components/ui/input/input.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';

const createTattoStore = useCreateTattoStore();

// TODO add scan tattoo logic

</script>