<template>
    <form ref="form" @submit.prevent="addAmount" class="bg-white flex gap-4 flex-col p-4 rounded-2xl shadow-2xl w-1/3 max-w-xs">
        <h2 class="font-bold capitalize text-xl">{{ inkType.name }}</h2>
        <p class="text-xs">{{ inkType.creationDate }}</p>
        <hr></hr>
        <p>Seleziona il colore</p>
        <label v-for="color, i in inkType.colors">
            <input name="color" type="radio" :value="color" :required="i === 0"  />
            {{ color }}
        </label>
        <hr></hr>
        <label for="amount">Seleziona la quantità</label>
        <Input name="amount" required="true" v-model="amount" placeholder="Quantità da caricare" type="number" min="1" max="1000"/>
        <Button type="submit">Aggiungi</Button>
    </form>
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

const form = ref(null)

const colorIndex = ref(0);
const amount = ref(0)
const selectedColor = ref(props.inkType.colors[colorIndex.value]);

const addAmount = () => {
    // @ts-ignore
    emit('addAmount', { inkType: props.inkType.name, color: selectedColor.value, amount: amount.value });
}

</script>