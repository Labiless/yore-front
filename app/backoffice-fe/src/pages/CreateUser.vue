<template>
    <div class="mt-48 h-2/3 overflow-y-scroll">
        <router-link to="users" class="hover:cursor-pointer mt-1 absolute -translate-x-6">
            <ArrowLeft />
        </router-link>
        <form @submit.prevent="createUser" class="w-full">
            <div class="flex flex-col justify-center items-start gap-2 border-black pl-4">
                <p class="font-bold text-xl py-4">Credenziali</p>
                <label for="expiration-date">Indirizzo Mail</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Password</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />                
                <p class="font-bold text-xl py-4">Informazioni</p>
                <label for="expiration-date">Forma giuridica</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Ragione sociale</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Codice Fiscale</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Partita Iva</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Indirizzo PEC FE</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Codice destinatario FE</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Telefono</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <p class="font-bold text-xl py-4">Sede Lgale</p>
                <label for="expiration-date">Città</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <label for="expiration-date">Indirizzo</label>
                <Input class="bg-white" v-model="createUSerStore.legalForm" name="expiration-date" type="text"
                    required />
                <Label for="terms" class="py-4">
                    <Checkbox v-model="createUSerStore.legalForm" />
                    Do il consenso per la liberatoria
                </Label>
                <Button type="submit" class="mt-4">Crea utente</Button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import Input from '@shared/components/ui/input/input.vue';
import Button from '@shared/components/ui/button/button.vue';
import Checkbox from '@shared/components/ui/checkbox/Checkbox.vue';
import { ArrowLeft } from 'lucide-vue-next';

import { useUiStore } from '@/stores/ui';
import { useCreateUserStore } from '@/stores/createUser.store';
import { onMounted } from 'vue';

const uiStore = useUiStore();
const createUSerStore = useCreateUserStore();

onMounted(async () => {
    uiStore.title = "Crea nuovo utente";
    uiStore.loading = true;
    uiStore.loading = false;
});

const createUser = () => {

}


</script>
