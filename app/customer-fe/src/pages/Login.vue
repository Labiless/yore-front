<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <div class="w-full max-w-sm">
            <LoginForm :error="error" @submit="onsubmit">Click me</LoginForm>
        </div>
    </div>
</template>

<script setup lang="ts">
import LoginForm from '@shared/components/LoginForm.vue';
import api from '@/services/api.service';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import router from '@/router';
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user.store';
import { getLoginErrorMessage } from '@shared/lib/apiError';

const error = ref('');
const authStore = useAuthStore();
const uiStore = useUiStore();
const userStore = useUserStore();

const onsubmit = async (data: { username: string; password: string }) => {
    uiStore.loading = true;
    error.value = '';
    try {
        const [username, password] = [data.username, data.password];
        if (!username || !password) {
            error.value = 'Inserisci username e password';
            return;
        }
        const res = await api.post('/auth/signin', {
            email: username,
            password,
        });
        if (res.data.accessToken) {
            userStore.init(res.data);
            onLogin(res.data.accessToken);
        }
    } catch (e) {
        error.value = getLoginErrorMessage(e);
    } finally {
        uiStore.loading = false;
    }
};

const onLogin = (accessToken : string) => {
    authStore.loginSuccess(accessToken);
    router.push('/');
}

</script>

<style></style>