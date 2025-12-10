<template>
    <form @submit.prevent="addAmount" class="bg-white flex mx-4 gap-4 flex-col p-4 rounded-2xl shadow-2xl w-1/3 max-w-xs">
        <h2 class="font-bold capitalize text-xl">{{ labelType.name }}</h2>
        <hr></hr>
        <p :style="`color: ${ labelType.color };`">{{ labelType.color }}</p>
        <hr></hr>
        <label for="amount">Seleziona la quantità (max. {{ labelType.amount }})</label>
        <Input name="amount" required="true" v-model="amount" placeholder="Quantità da caricare" type="number" min="1" :max="labelType.amount"/>
        <Button type="submit">Aggiungi</Button>
    </form>
</template>

<script setup lang="ts">
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import { ref } from 'vue';

const props = defineProps<{
    labelType: {
        color: string
        name: string,
        amount: number
    },
}>();

const emit = defineEmits(['addAmount'])

const amount = ref(0)

const addAmount = () => {
    // @ts-ignore
    emit('addAmount', { inkType: props.inkType.name, inkTypeUuid: props.inkType.uuid, color: selectedColor.value, amount: amount.value });
}

</script>