<template>
    <div v-if="user" class="mx-auto w-full items-start">
        <div class="mb-4">
            <p class="text-xl font-bold flex items-center mb-2">
                <User /> {{ user.businessName }}
            </p>
        </div>
        <div class="mb-4">
            <p class="font-bold">Contatti</p>
            <p>{{ user.email }}</p>
            <p>{{ user.phone }}</p>
        </div>
        <div class="mb-4">
            <p class="font-bold">Indirizzo</p>
            <p>{{ user.country }}</p>
            <p>{{ user.city }}</p>
            <p>{{ user.cap }}</p>
            <p>{{ user.province }}</p>
            <p>{{ user.address }}</p>
        </div>
        <div class="mb-4">
            <p class="font-bold">Dati azienda</p>
            <p>{{ user.legalForm }}</p>
            <p>{{ user.piva }}</p>
            <p>{{ user.cf }}</p>
            <p>{{ user.fePecAddress }}</p>
            <p>{{ user.pecMail }}</p>
            <p>{{ user.taxCode }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user.store';
import { userService } from '@/services/api.user.service';
import { User } from 'lucide-vue-next';

const uiStore = useUiStore();
const userStore = useUserStore();
const user = ref(null);

onMounted(async () => {
    uiStore.title = "Utente";
    user.value = await userService.getUserByUuid(userStore.getUiid);
});

</script>
<style></style>