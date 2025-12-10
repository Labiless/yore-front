<template>
    <div class="mt-48 h-2/3 overflow-y-scroll hide-scrollbar">
        <router-link to="users" class="hover:cursor-pointer mt-1 absolute -translate-x-6">
            <ArrowLeft />
        </router-link>
        <form @submit.prevent="submit" class="w-full">
            <div class="flex flex-col justify-center items-start gap-2 border-black pl-4">
                <p class="font-bold text-xl py-4">Credenziali</p>
                <label for="expiration-date">Indirizzo Mail</label>
                <Input class="bg-white" v-model="createUSerStore.email" name="expiration-date" type="text" required />
                <label for="expiration-date">Password</label>
                <Input class="bg-white" v-model="createUSerStore.password" name="expiration-date" type="text"
                    required />
                <p class="font-bold text-xl py-4">Informazioni</p>
                <label for="expiration-date">Forma giuridica</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Ragione sociale</label>
                <Input class="bg-white" v-model="createUSerStore.businessName" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Codice Fiscale</label>
                <Input class="bg-white" v-model="createUSerStore.cf" name="expiration-date" type="text" required />
                <label for="expiration-date">Partita Iva</label>
                <Input class="bg-white" v-model="createUSerStore.piva" name="expiration-date" type="text" required />
                <label for="expiration-date">Indirizzo PEC FE</label>
                <Input class="bg-white" v-model="createUSerStore.pecMail" name="expiration-date" type="text" required />
                <label for="expiration-date">Codice destinatario FE</label>
                <Input class="bg-white" v-model="createUSerStore.fePecAddress" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Telefono</label>
                <Input class="bg-white" v-model="createUSerStore.phone" name="expiration-date" type="text" required />
                <p class="font-bold text-xl py-4">Sede Lgale</p>
                <label for="expiration-date">Città</label>
                <Input class="bg-white" v-model="createUSerStore.city" name="expiration-date" type="text" required />
                <label for="expiration-date">Indirizzo</label>
                <Input class="bg-white" v-model="createUSerStore.address" name="expiration-date" type="text" required />
                <Label for="terms" class="py-4">
                    <Checkbox required v-model="createUSerStore.consent" />
                    Do il consenso per la liberatoria
                </Label>
                <Button type="submit" class="mt-4">Crea utente</Button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import Checkbox from '@shared/components/ui/checkbox/Checkbox.vue';
import { createUser } from '@/services/api.user.service';
import { ArrowLeft } from 'lucide-vue-next';

import { useUiStore } from '@/stores/ui';
import { useCreateUserStore } from '@/stores/createUser.store.ts';
import { useUsersStore } from '@/stores/users.store';
import { onMounted } from 'vue';
import router from '@/router';

const uiStore = useUiStore();
const createUSerStore = useCreateUserStore();
const usersStore = useUsersStore();

onMounted(async () => {
    uiStore.title = "Crea nuovo utente";
    uiStore.loading = true;
    createUSerStore.resetCreateUser();
    uiStore.loading = false;
});

const submit = async () => {
    uiStore.loading = true;
    try {
        const newUser = await createUser(createUSerStore.getAllData());
        usersStore.resetUsersStore();
        router.push(`users/${newUser.uuid}`);
        uiStore.loading = false;
        uiStore.setToast('Utente creato',);
    } catch (error) {
        uiStore.loading = false;
        uiStore.setToast('Errore nella creazione utente', 'error');
    }
}


</script>
