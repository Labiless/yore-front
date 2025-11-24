<template>
    <div class="flex gap-4 flex-col p-4 rounded-2xl shadow-2xl">
        <h2 class="font-bold capitalize text-xl">{{ inkType.name }}</h2>
        <p class="text-xs">{{ inkType.creationDate }}</p>
        <p>Seleziona il colore</p>
        <Button @click="selectedColor = color" v-for="color, i in inkType.colors" :class="`bg-[${color}] ${i === colorIndex ? 'shadow-2xl shadow-amber-600' : ''}`"
            class="border-2 w-8 h-8 rounded-2xl">
        </Button>
        <Input v-model="amount" placeholder="Quantità da caricare" type="number" />
        <Button @click="addAmount">Aggiungi</Button>
    </div>
</template>

<script setup lang="ts">
import Input from '@shared/components/ui/input/input.vue';
import Button from '@shared/components/ui/button/button.vue';
import { ref } from 'vue';

const props = defineProps<{
    inkType: {
        colors: string[]
        creationDate: Date,
        id: string,
        name: string,
        uuid: string,
    },
}>();

const emit = defineEmits(['addAmount'])

const colorIndex = ref(0);
const amount = ref(0)
const selectedColor = ref(props.inkType.colors[colorIndex.value]);

const addAmount = () => {
    emit('addAmount', { inkType: props.inkType.name, color: selectedColor.value, amount: amount.value });
}

</script>