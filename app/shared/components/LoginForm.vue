<template>
    <form @submit.prevent="onsubmit" class="flex flex-col gap-4 w-full">
        <img :src="yoreLogo" alt="Yore" class="w-1/8 mx-auto" />
        <Input autocomplete="username" placeholder="Username" v-model="username" required />
        <PasswordInput autocomplete="current-password" placeholder="Password" v-model="password" required />
        <Button type="submit">Login</Button>
        <p class="text-red-500 text-sm">{{ error }}</p>
    </form>
</template>

<script setup lang="ts">
import Input from './ui/input/Input.vue';
import PasswordInput from './PasswordInput.vue';
import Button from './ui/button/Button.vue';
import { ref, defineEmits } from 'vue';
import yoreLogo from '../images/yore_logo.png';

defineProps<{
    error?: string
}>()

const emit = defineEmits(['submit'])
const username = ref('');
const password = ref('');

const onsubmit = () => {
    emit('submit', {
        username: username.value.trim().toLowerCase(),
        password: password.value,
    });
};

</script>

<style></style>