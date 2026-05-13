<template>
    <div class="h-min-full overflow-y-scroll hide-scrollbar">
        <form @submit.prevent="submit" class="w-full pb-8">
            <div class="flex flex-col justify-center items-start gap-2 border-black">
                <div class="flex justify-between items-center w-full">
                    <p class="font-bold text-xl py-4">Credenziali</p>
                    <router-link to="users" class="hover:cursor-pointer mt-1">
                        <Trash2 color="red" />
                    </router-link>
                </div>
                <label for="expiration-date">Indirizzo Mail</label>
                <Input class="bg-white" v-model="createUSerStore.email" name="expiration-date" type="email" required />

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
                <Input class="bg-white" v-model="createUSerStore.cf" name="expiration-date" type="text"
                    maxlength="16" minlength="16" pattern="[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]" />

                <label for="expiration-date">Partita Iva</label>
                <Input class="bg-white" v-model="createUSerStore.piva" name="expiration-date" type="text" required
                    maxlength="11" minlength="11" pattern="[0-9]{11}" />

                <label for="expiration-date">Indirizzo PEC FE</label>
                <Input class="bg-white" v-model="createUSerStore.pecMail" name="expiration-date" type="email" required />

                <label for="expiration-date">Codice destinatario FE</label>
                <Input class="bg-white" v-model="createUSerStore.fePecAddress" name="expiration-date" type="text"
                    required />

                <label for="expiration-date">Telefono</label>
                <Input class="bg-white" v-model="createUSerStore.phone" name="expiration-date" type="tel" required pattern="^\+?[0-9]{8,15}$" inputmode="tel" />

                <p class="font-bold text-xl py-4">Sede Legale</p>

                <label for="expiration-date">Città</label>
                <Input class="bg-white" v-model="createUSerStore.city" name="expiration-date" type="text" required />

                <label for="expiration-date">Indirizzo</label>
                <Input class="bg-white" v-model="createUSerStore.address" name="expiration-date" type="text" required />

                <Label for="terms" class="py-4">
                    <Checkbox required v-model="createUSerStore.consent" />
                    Do il consenso per la liberatoria
                </Label>

                <Button type="submit" class="h-12 w-full">Crea utente</Button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import Checkbox from '@shared/components/ui/checkbox/Checkbox.vue';
import { createUser } from '@/services/api.user.service';
import { Trash2 } from 'lucide-vue-next';

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
