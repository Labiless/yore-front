<template>
    <div class="flex flex-col gap-4 max-w-full mx-auto">
        YORE
        <Input autocomplete="username" placeholder="Username" v-model="username" />
        <Input autocomplete="current-password" placeholder="Password" v-model="password" type="password" />
        <Button @click="onsubmit">Login</Button>
        <p class="text-red-500 text-sm">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from './ui/button/Button.vue';
import { ref, defineEmits, defineProps } from 'vue';

defineProps<{
    error?: string
}>()

const emit = defineEmits(['submit'])
const username = ref('');
const password = ref('');

const onsubmit = () => {
    emit('submit', { username: username.value, password: password.value });
};

</script>

<style></style>