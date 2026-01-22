<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Informazioni Tatuato
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.infoValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr>
    </hr>
    <form @submit.prevent="onsubmit" class="">
        <label>
            Nome
            <Input required v-model="createTattoStore.info.name" />
        </label>
        <label>
            Cognome
            <Input required v-model="createTattoStore.info.surname" />
        </label>

        <label>
            Codice Fiscale
            <Input required v-model="createTattoStore.info.cf" />
        </label>
        <label>
            Email
            <Input required v-model="createTattoStore.info.email" />
        </label>
        <label>
            Paese di residenza
            <Input required v-model="createTattoStore.info.country" />
        </label>

        <label>
            Città di residenza
            <Input required v-model="createTattoStore.info.city" />
        </label>

        <label>
            Indirizzo di residenza
            <Input required v-model="createTattoStore.info.address" />
        </label>
        <div class="flex flex-col justify-around mt-2">
            <Label for="terms" class="text-xs mb-4">
                <Checkbox required v-model="createTattoStore.info.dataConsent" />
                Do il consenso per il trattamento dati
            </Label>
            <Label for="terms" class="text-xs">
                <Checkbox required v-model="createTattoStore.info.contractConsent" />
                Do il consenso per la liberatoria
            </Label>
        </div>
        <Button type="submit" class="mt-8 w-full h-12">Conferma</Button>
    </form>
</template>

<script setup lang="ts">
import { useCreateTattoStore } from '@/stores/createTatto.store';
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import Checkbox from '@shared/components/ui/checkbox/Checkbox.vue';
import { createCustomer, updateCustomer } from '@/services/api.customer.service';
import { createTattoo, getAllTattoos } from '@/services/api.tattoo.service';
import { userUserStore } from '@/stores/user.store';
import { useTatoosStore } from '@/stores/tattoos.store';
import { useUiStore } from '@/stores/ui';

const createTattoStore = useCreateTattoStore();
const userStore = userUserStore();
const tattoosStore = useTatoosStore();
const uiStore = useUiStore();

const onsubmit = async () => {
    uiStore.loading = true;
    if (createTattoStore.infoValidation()) {
        if (createTattoStore.customerUuid) {
            await updateCustomer(createTattoStore.customerUuid, {
                ...createTattoStore.info,
                consent: true
            })
        } else {
            const newCustomer = await createCustomer({
                ...createTattoStore.info,
                consent: true
            });
            const newTattoo = await createTattoo({
                status: "READY",
                customerUuid: newCustomer.uuid,
                userUuid: userStore.uuid
            });
            createTattoStore.customerUuid = newCustomer.uuid;
            createTattoStore.uuid = newTattoo.uuid;
        }
    }
    // @ts-ignore
    const res = await getAllTattoos();
    tattoosStore.tattoos = res.sort((a: any, b: any) => b.id - a.id);
    uiStore.loading = false;
    uiStore.setToast('Dati cliente aggiunti correttamente');
}
</script>