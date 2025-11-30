<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Informazioni Tatuato
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.infoValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr>
    </hr>
    <label>
        Nome
        <Input v-model="createTattoStore.info.name" />
    </label>
    <label>
        Cognome
        <Input v-model="createTattoStore.info.surname" />
    </label>

    <label>
        Codice Fiscale
        <Input v-model="createTattoStore.info.cf" />
    </label>

    <label>
        Paese di residenza
        <Input v-model="createTattoStore.info.country" />
    </label>

    <label>
        Città di residenza
        <Input v-model="createTattoStore.info.city" />
    </label>

    <label>
        Indirizzo di residenza
        <Input v-model="createTattoStore.info.street" />
    </label>
    <div class="flex flex-col justify-around mt-2">
        <Label for="terms" class="text-xs mb-4">
            <Checkbox v-model="createTattoStore.info.dataConsent" />
            Do il consenso per il trattamento dati
        </Label>
        <Label for="terms" class="text-xs">
            <Checkbox v-model="createTattoStore.info.contractConsent" />
            Do il consenso per la liberatoria
        </Label>
    </div>

</template>
<script setup lang="ts">
import { useCreateTattoStore } from '@/stores/createTatto.store';
import Input from '@shared/components/ui/input/input.vue';
import Checkbox from '@shared/components/ui/checkbox/Checkbox.vue';
const createTattoStore = useCreateTattoStore();
</script>