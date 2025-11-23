<template>
    <div class="flex flex-col gap-4 max-w-sm mx-auto mt-20">
        YORE
        <Input placeholder="Username" v-model="username" />
        <Input placeholder="Password" v-model="password" type="password" />
        <Button @click="onsubmit">Login</Button>
    </div>
</template>

<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from './ui/button/Button.vue';
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['submit'])
const username = ref('');
const password = ref('');

const onsubmit = () => {
    emit('submit', { username: username.value, password: password.value });
};

</script>

<style>

</style>