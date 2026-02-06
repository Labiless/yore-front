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
            <Input placeholder="Nome" required v-model="createTattoStore.info.name" pattern="[A-Za-zÀ-ÖØ-öø-ÿ]+" />
        </label>
        <label>
            Cognome
            <Input placeholder="Cognome" required v-model="createTattoStore.info.surname"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ]+" />
        </label>

        <label>
            Codice Fiscale
            <Input placeholder="Codice Fiscale" required v-model="createTattoStore.info.cf" maxlength="16"
                minlength="16" pattern="[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]"
                style="text-transform: uppercase" />
        </label>
        <label>
            Email
            <Input placeholder="Email" required v-model="createTattoStore.info.email" type="email" maxlength="254" />
        </label>
        <label>
            Data di nascita
            <Input required v-model="createTattoStore.info.birthDate" type="date" />
        </label>
        <label>
            Luogo di nascita
            <Input placeholder="Luogo di nascita" required v-model="createTattoStore.info.birthPlace"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+" />
        </label>
        <label>
            Paese di residenza
            <Input placeholder="Paese di residenza" required v-model="createTattoStore.info.country"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+" />
        </label>

        <label>
            Città di residenza
            <Input placeholder="Città di residenza" required v-model="createTattoStore.info.city"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+" />
        </label>

        <label>
            Indirizzo di residenza
            <Input placeholder="Indirizzo di residenza" required v-model="createTattoStore.info.address"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+" />
        </label>

        <label>
            Numero civico
            <Input placeholder="Numero civico" required v-model="createTattoStore.info.streetNumber" pattern="[0-9]+" />
        </label>

        <label>
            Cap
            <Input placeholder="cap" required v-model="createTattoStore.info.cap" pattern="[0-9]{5}" maxlength="5"
                minlength="5" />
        </label>
        <label>
            Provincia di residenza
            <Input placeholder="Provincia di residenza" required v-model="createTattoStore.info.province"
                pattern="[A-Za-z]{2}" maxlength="2" minlength="2" style="text-transform: uppercase" />
        </label>
        <div class="flex flex-col justify-around mt-2">
            <Label class="text-xs mb-4">
                <input type="checkbox" required v-model="createTattoStore.info.consent1" />
                Do il consenso per il trattamento dati
            </Label>
            <Label class="text-xs">
                <input type="checkbox" required v-model="createTattoStore.info.consent2" />
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
import { createTattoo, getAllTattoos, getTattoByUuid, updateTattoo } from '@/services/api.tattoo.service';
import { useUserStore } from '@/stores/user.store';
import { useTatoosStore } from '@/stores/tattoos.store';
import { useUiStore } from '@/stores/ui';

const createTattoStore = useCreateTattoStore();
const userStore = useUserStore();
const tattoosStore = useTatoosStore();
const uiStore = useUiStore();

const onsubmit = async () => {
    uiStore.loading = true;
    if (createTattoStore.infoValidation()) {
        if (createTattoStore.customerUuid && createTattoStore.uuid) {
            await updateCustomer(createTattoStore.customerUuid, {
                ...createTattoStore.info,
            })
            await updateTattoo(createTattoStore.uuid, {
                customerName: `${createTattoStore.info.name} ${createTattoStore.info.surname}`
            })
            const res = await getTattoByUuid(createTattoStore.uuid);
            tattoosStore.tattoos = tattoosStore.tattoos.map(tattoo => tattoo.uuid === res.uuid ? res : tattoo).sort((a: any, b: any) => b.id - a.id)
        } else {
            const newCustomer = await createCustomer({
                ...createTattoStore.info,
            });
            const newTattoo = await createTattoo({
                status: "READY",
                customerName: `${createTattoStore.info.name} ${createTattoStore.info.surname}`,
                customerUuid: newCustomer.uuid,
                userUuid: userStore.uuid
            });
            createTattoStore.customerUuid = newCustomer.uuid;
            createTattoStore.uuid = newTattoo.uuid;
            createTattoStore.id = newTattoo.id;
        }
        // @ts-ignore
        const res = await getTattoByUuid(createTattoStore.uuid);
        tattoosStore.tattoos.push(res)
        tattoosStore.tattoos = tattoosStore.tattoos.sort((a: any, b: any) => b.id - a.id)
        uiStore.loading = false;
        uiStore.setToast('Dati cliente aggiunti correttamente');
    }
    else {
        console.log(createTattoStore);
        uiStore.setToast('Qualcosa è andato storto', 'error');
        uiStore.loading = false;
    }
}
</script>