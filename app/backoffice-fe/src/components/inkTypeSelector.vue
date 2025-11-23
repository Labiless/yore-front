<template>
    <div class="flex gap-4 flex-col p-4 rounded-2xl shadow-2xl">
        <h2 class="font-bold capitalize text-xl">{{ inkType.name }}</h2>
        <p class="text-xs">{{ inkType.creationDate }}</p>
        <p>Seleziona il colore</p>
        <Button v-for="color in inkType.colors" :class="`bg-[${color}]`" class="w-8 h-8 rounded-2xl"></Button>
        <Input placeholder="Quantità da caricare" type="number"/>
        <Button>Aggiungi</Button>
    </div>
</template>

<script setup lang="ts">
import Input from '@shared/components/ui/input/input.vue';
import Button from '@shared/components/ui/button/button.vue';
defineProps <{
    inkType: {
        colors: string[] 
        creationDate: Date,
        id: string,
        name: string,
        uuid: string,
    },
}>();

</script>