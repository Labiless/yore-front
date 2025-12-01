<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Inchiostro
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.inksValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr />
    <Button @click="addInk" class="w-full">Scansiona Inchiostro</Button>
    <Input placeholder="Id inchiostro" v-model="inkUuid"></Input>
    <div class="" v-if="createTattoStore.inks.length">
        <p>Inchostri scansionati</p>
    </div>
    <div
        class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
        v-for="ink in createTattoStore.inks">
        <p class="font-bold text-2xl pr-4 w-16 text-center">{{ ink.id }}</p>
        <div class="border-l-1 border-black pl-4">
            <p class="font-bold">{{ ink.uuid }}</p>
            <p>{{ new Date(ink.createdAt).toDateString() }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/button.vue';
import Input from '@shared/components/ui/input/input.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { ref } from 'vue';
import { apiLabelService } from '@/services/api.inks.service';

// 2c7a1f6a-975a-4a38-9cf2-8b02ff72c271

const createTattoStore = useCreateTattoStore();
const inkUuid = ref('');
// TODO add scan tattoo logic
const addInk = async () => {
    const ink = await apiLabelService.getLabelByUuid(inkUuid.value);
    console.log(ink)
    if (ink){
        createTattoStore.inks.push(ink);
        inkUuid.value = '';
    }
}

</script>