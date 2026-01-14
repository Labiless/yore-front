<template>
    <div class="flex items-center h-[100vh] mx-auto">
        <LoginForm :error="error" @submit="onsubmit">Click me</LoginForm>
    </div>
</template>

<script setup lang="ts">
import LoginForm from '@shared/components/LoginForm.vue';
import api from '@/services/api.service';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import router from '@/router';
import { useUiStore } from '@/stores/ui';

const error = ref("");
const authStore = useAuthStore();
const uiStore = useUiStore();

const onsubmit = async (data: { username: string; password: string }) => {
    uiStore.loading = true;
    try {
        const [username, password] = [data.username, data.password];
        if (!username || !password) throw new Error("No username or passowrd")
        const res = await api.post('/auth/signin', {
            email: username,
            password
        })
        if (res.data.accessToken) {
            onLogin(res.data.accessToken);
        }
    } catch (e : any) {
        error.value = e.message;
    }
    uiStore.loading = false;
};

const onLogin = (accessToken : string) => {
    authStore.loginSuccess(accessToken);
    router.push('/');
}

</script>

<style></style>