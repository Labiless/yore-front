<template>
    <div>
        <LoginForm @submit="onsubmit">Click me</LoginForm>
    </div>
</template>

<script setup lang="ts">
import LoginForm from '@shared/components/LoginForm.vue';
import api from '@/services/api.service';

const onsubmit = async (data: { username: string; password: string }) => {
    const [username, password] = [data.username, data.password];
    const res = await api.post('/api/auth/signin', {
        email: username,
        password
    })
    console.log(res.data);
};

</script>

<style>

</style>