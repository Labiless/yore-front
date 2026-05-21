<template>
    <div class="h-min-full overflow-y-scroll hide-scrollbar">
        <form @submit.prevent="submit" class="user-form w-full pb-8">
            <div class="flex flex-col justify-center items-start gap-2 border-black">
                <div class="flex justify-between items-center w-full">
                    <p class="font-bold text-xl py-4">Credenziali</p>
                    <router-link to="users" class="hover:cursor-pointer mt-1">
                        <Trash2 color="red" />
                    </router-link>
                </div>
                <label class="user-form-label" for="user-email">Indirizzo Mail</label>
                <Input id="user-email" class="bg-white" v-model="createUSerStore.email" name="email" type="email"
                    required />

                <label class="user-form-label" for="user-password">Password</label>
                <Input id="user-password" class="bg-white" v-model="createUSerStore.password" name="password"
                    type="password" required />

                <p class="font-bold text-xl py-4">Informazioni</p>

                <label class="user-form-label" for="user-legal-form">Forma giuridica</label>
                <Input id="user-legal-form" class="bg-white" v-model="createUSerStore.legalForm" name="legalForm"
                    type="text" required />

                <label class="user-form-label" for="user-business-name">Ragione sociale</label>
                <Input id="user-business-name" class="bg-white" v-model="createUSerStore.businessName"
                    name="businessName" type="text" required />

                <label class="user-form-label" for="user-cf">Codice Fiscale</label>
                <Input id="user-cf" class="bg-white" v-model="createUSerStore.cf" name="cf" type="text" maxlength="16"
                    minlength="16" pattern="[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]" />

                <label class="user-form-label" for="user-piva">Partita Iva</label>
                <Input id="user-piva" class="bg-white" v-model="createUSerStore.piva" name="piva" type="text" required
                    maxlength="11" minlength="11" pattern="[0-9]{11}" />

                <label class="user-form-label" for="user-pec">Indirizzo PEC FE</label>
                <Input id="user-pec" class="bg-white" v-model="createUSerStore.pecMail" name="pecMail" type="email"
                    required />

                <label class="user-form-label" for="user-fe-pec">Codice destinatario FE</label>
                <Input id="user-fe-pec" class="bg-white" v-model="createUSerStore.fePecAddress" name="fePecAddress"
                    type="text" required />

                <label class="user-form-label" for="user-phone">Telefono</label>
                <Input id="user-phone" class="bg-white" v-model="createUSerStore.phone" name="phone" type="tel" required
                    pattern="^\+?[0-9]{8,15}$" inputmode="tel" />

                <p class="font-bold text-xl py-4">Sede Legale</p>

                <label class="user-form-label" for="user-city">Città</label>
                <Input id="user-city" class="bg-white" v-model="createUSerStore.city" name="city" type="text"
                    required />

                <label class="user-form-label" for="user-address">Indirizzo</label>
                <Input id="user-address" class="bg-white" v-model="createUSerStore.address" name="address" type="text"
                    required />

                <label class="user-form-label user-form-label--checkbox flex items-center gap-2 py-4">
                    <Checkbox required v-model="createUSerStore.consent" />
                    Do il consenso per la liberatoria
                </label>

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

<style scoped>
.user-form .user-form-label {
    font-size: 12px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}

.user-form .user-form-label:hover {
    text-decoration: none;
}

.user-form .user-form-label--checkbox {
    font-size: 14px;
}
</style>
