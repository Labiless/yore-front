<template>
    <form @submit.prevent="onSubmit" class="bg-white flex gap-4 mx-4 flex-col p-4 rounded-2xl shadow-2xl w-80 max-w-xs">
        <h2 class="font-bold capitalize text-xl">{{ inkType.name }}</h2>
        <p class="text-xs">{{ inkType.creationDate }}</p>
        <hr></hr>
        <p :style="`color: ${inkType.color}`">{{ inkType.color }}</p>            
        <hr></hr>
        <label for="amount">Seleziona la quantità <span v-if="inkType.amount">max({{ inkType.amount }})</span></label>
        <Input name="amount" required="true" v-model="amount" placeholder="Quantità da caricare" type="number" min="1" :max="inkType.amount || 1000"/>
        <Button type="submit">
            <slot/>
        </Button>
    </form>
</template>

<script setup lang="ts">
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/button.vue';
import { ref } from 'vue';

const props = defineProps<{
    inkType: {
        color: string,
        creationDate: Date,
        id: string,
        name: string,
        uuid: string,
        amount? :number
    },
}>();

const emit = defineEmits(['submit'])
const amount = ref(0)

console.log(props);

const onSubmit = () => {
    // @ts-ignore
    emit('submit', { inkType: props.inkType.name, inkTypeUuid: props.inkType.uuid, color: props.inkType.color, amount: amount.value });
}

</script>