<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2 shrink-0" />
        Informazioni Tatuato
        <span
            class="rounded-full p-1 w-2 h-2 ml-2 shrink-0"
            :class="createTattoStore.infoSectionConfirmed() ? 'bg-green-700' : 'bg-amber-500'"
        />
    </p>
    <hr class="mb-4" />
    <form @submit.prevent="onsubmit" class="customer-form grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
        <label>
            Nome
            <Input placeholder="Nome" required v-model="createTattoStore.info.name" pattern="[A-Za-zÀ-ÖØ-öø-ÿ]+" />
        </label>
        <label>
            Cognome
            <Input placeholder="Cognome" required v-model="createTattoStore.info.surname"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ']+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ']+)*"
                title="Cognome con lettere, spazi, apostrofi o trattini (es. De Luca, D'Angelo)" />
        </label>

        <label class="sm:col-span-2">
            Codice Fiscale
            <Input placeholder="Codice Fiscale" required v-model="createTattoStore.info.cf" maxlength="16"
                minlength="16" pattern="[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]"
                style="text-transform: uppercase" />
        </label>
        <label class="sm:col-span-2">
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

        <label class="sm:col-span-2">
            Indirizzo di residenza
            <Input placeholder="Indirizzo di residenza" required v-model="createTattoStore.info.address"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+" />
        </label>

        <label>
            Numero civico
            <Input placeholder="Numero civico" required v-model="createTattoStore.info.streetNumber"
                pattern="[0-9A-Za-z\/\-]+"
                title="Numero civico: cifre, lettere, / o - (es. 12A, 5/B)" />
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
        <div class="sm:col-span-2 flex flex-col gap-3 mt-1">
            <label class="consent-label">
                <input type="checkbox" required v-model="createTattoStore.info.consent1" class="mt-0.5 shrink-0" />
                <span>Do il consenso per il trattamento dati</span>
            </label>
            <label class="consent-label">
                <input type="checkbox" required v-model="createTattoStore.info.consent2" class="mt-0.5 shrink-0" />
                <span>Do il consenso per la liberatoria</span>
            </label>
        </div>
        <Button type="submit" class="sm:col-span-2 mt-2 w-full h-12">Conferma</Button>
    </form>
</template>

<script setup lang="ts">
import { useCreateTattoStore } from '@/stores/createTatto.store';
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import { ClipboardList } from 'lucide-vue-next';
import { watch } from 'vue';
import { createCustomer, updateCustomer } from '@/services/api.customer.service';
import { createTattoo, getAllTattoos, getTattoByUuid, updateTattoo } from '@/services/api.tattoo.service';
import { useUserStore } from '@/stores/user.store';
import { useTatoosStore } from '@/stores/tattoos.store';
import { useUiStore } from '@/stores/ui';

const createTattoStore = useCreateTattoStore();
const userStore = useUserStore();
const tattoosStore = useTatoosStore();
const uiStore = useUiStore();

watch(
    () => ({ ...createTattoStore.info }),
    () => {
        if (createTattoStore.infoSectionConfirmed()) {
            createTattoStore.invalidateSection('info');
        }
    },
    { deep: true },
);

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
        const tattooUuid = createTattoStore.uuid;
        if (!tattooUuid) {
            uiStore.setToast('Qualcosa è andato storto', 'error');
            uiStore.loading = false;
            return;
        }
        const res = await getTattoByUuid(tattooUuid);
        tattoosStore.tattoos.push(res);
        tattoosStore.tattoos = tattoosStore.tattoos.sort((a: any, b: any) => b.id - a.id)
        createTattoStore.confirmSection('info');
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
