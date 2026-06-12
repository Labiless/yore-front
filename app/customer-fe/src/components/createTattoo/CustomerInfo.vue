<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2 shrink-0" />
        Informazioni personali
        <span
            class="rounded-full p-1 w-2 h-2 ml-2 shrink-0"
            :class="createTattoStore.infoSectionConfirmed() ? 'bg-green-700' : 'bg-amber-500'"
        />
    </p>
    <p class="text-xs text-gray-500 text-center mb-3">Queste informazioni vengono utilizzate per la gestione del consenso informato e della sessione</p>
    <hr class="mb-4" />
    <form @submit.prevent="onsubmit" class="customer-form grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
        <label>
            Nome
            <Input placeholder="Nome" required v-model="createTattoStore.info.name"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ'’]+(?:[ '’\-][A-Za-zÀ-ÖØ-öø-ÿ'’]+)*"
                title="Nome con lettere, spazi, apostrofi o trattini (es. Maria, D'Angelo)" />
        </label>
        <label>
            Cognome
            <Input placeholder="Cognome" required v-model="createTattoStore.info.surname"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ'’]+(?:[ '’\-][A-Za-zÀ-ÖØ-öø-ÿ'’]+)*"
                title="Cognome con lettere, spazi, apostrofi o trattini (es. De Luca, D'Amico)" />
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
            <div class="flex items-center gap-1.5" role="group" aria-label="Data di nascita">
                <input
                    ref="birthDayRef"
                    :value="birthDay"
                    type="text"
                    inputmode="numeric"
                    autocomplete="bday-day"
                    maxlength="2"
                    placeholder="GG"
                    required
                    class="birth-part-input w-14 text-center"
                    @input="onBirthPartInput('day', $event)"
                    @keydown="onBirthPartKeydown('day', $event)"
                />
                <span class="text-gray-500 shrink-0">/</span>
                <input
                    ref="birthMonthRef"
                    :value="birthMonth"
                    type="text"
                    inputmode="numeric"
                    autocomplete="bday-month"
                    maxlength="2"
                    placeholder="MM"
                    required
                    class="birth-part-input w-14 text-center"
                    @input="onBirthPartInput('month', $event)"
                    @keydown="onBirthPartKeydown('month', $event)"
                />
                <span class="text-gray-500 shrink-0">/</span>
                <input
                    ref="birthYearRef"
                    :value="birthYear"
                    type="text"
                    inputmode="numeric"
                    autocomplete="bday-year"
                    maxlength="4"
                    placeholder="AAAA"
                    required
                    class="birth-part-input w-[4.5rem] text-center"
                    @input="onBirthPartInput('year', $event)"
                    @keydown="onBirthPartKeydown('year', $event)"
                />
            </div>
            <input
                type="hidden"
                :value="createTattoStore.info.birthDate ?? ''"
                required
                tabindex="-1"
                aria-hidden="true"
            />
        </label>
        <label>
            Luogo di nascita
            <Input placeholder="Luogo di nascita" required v-model="createTattoStore.info.birthPlace"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ''\s]+"
                title="Luogo di nascita (es. Roma, L'Aquila)" />
        </label>
        <label>
            Paese di residenza
            <Input placeholder="Paese di residenza" required v-model="createTattoStore.info.country"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ''\s]+"
                title="Paese di residenza (es. Italia, Costa d'Avorio)" />
        </label>

        <label>
            Città di residenza
            <Input placeholder="Città di residenza" required v-model="createTattoStore.info.city"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ''\s]+"
                title="Città di residenza (es. Milano, L'Aquila)" />
        </label>

        <label class="sm:col-span-2">
            Indirizzo di residenza
            <Input placeholder="Indirizzo di residenza" required v-model="createTattoStore.info.address"
                pattern="[A-Za-zÀ-ÖØ-öø-ÿ''0-9\s,.\-\/]+"
                title="Indirizzo (es. Via L'Aquila, Via dei Mille)" />
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
        <Button type="submit" class="sm:col-span-2 mt-2 w-full h-12">Conferma</Button>
    </form>
</template>

<script setup lang="ts">
import { useCreateTattoStore } from '@/stores/createTatto.store';
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import { ClipboardList } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { createCustomer, updateCustomer } from '@/services/api.customer.service';
import { createTattoo, getAllTattoos, getTattoByUuid, updateTattoo } from '@/services/api.tattoo.service';
import { useUserStore } from '@/stores/user.store';
import { useTatoosStore } from '@/stores/tattoos.store';
import { useUiStore } from '@/stores/ui';

const createTattoStore = useCreateTattoStore();
const userStore = useUserStore();
const tattoosStore = useTatoosStore();
const uiStore = useUiStore();
const route = useRoute();

const birthDay = ref('');
const birthMonth = ref('');
const birthYear = ref('');
const birthDayRef = ref<HTMLInputElement | null>(null);
const birthMonthRef = ref<HTMLInputElement | null>(null);
const birthYearRef = ref<HTMLInputElement | null>(null);

let syncingBirthDateFromStore = false;

const buildBirthDateFromParts = (): string | undefined => {
    const day = birthDay.value;
    const month = birthMonth.value;
    const year = birthYear.value;
    if (!day || month.length < 2 || year.length !== 4) return undefined;

    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);
    if (
        !Number.isInteger(dayNum) ||
        !Number.isInteger(monthNum) ||
        !Number.isInteger(yearNum) ||
        monthNum < 1 ||
        monthNum > 12 ||
        dayNum < 1 ||
        dayNum > 31 ||
        yearNum < 1900 ||
        yearNum > new Date().getFullYear()
    ) {
        return undefined;
    }

    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (
        date.getFullYear() !== yearNum ||
        date.getMonth() !== monthNum - 1 ||
        date.getDate() !== dayNum
    ) {
        return undefined;
    }

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const syncBirthDateToStore = () => {
    syncingBirthDateFromStore = true;
    createTattoStore.info.birthDate = buildBirthDateFromParts();
    syncingBirthDateFromStore = false;
};

const parseBirthDateFromStore = (value?: string) => {
    if (!value) {
        birthDay.value = '';
        birthMonth.value = '';
        birthYear.value = '';
        return;
    }
    const datePart = String(value).split('T')[0] ?? '';
    const [year, month, day] = datePart.split('-');
    birthYear.value = year ?? '';
    birthMonth.value = month ?? '';
    birthDay.value = day ?? '';
};

const onBirthPartInput = (part: 'day' | 'month' | 'year', event: Event) => {
    const input = event.target as HTMLInputElement;
    const maxLen = part === 'year' ? 4 : 2;
    let value = input.value.replace(/\D/g, '').slice(0, maxLen);

    if (part === 'day' && value.length === 1 && Number(value) > 3) {
        value = `0${value}`;
    }
    if (part === 'month' && value.length === 1 && Number(value) > 1) {
        value = `0${value}`;
    }

    input.value = value;

    if (part === 'day') birthDay.value = value;
    else if (part === 'month') birthMonth.value = value;
    else birthYear.value = value;

    syncBirthDateToStore();

    if (part === 'day' && value.length === 2) {
        birthMonthRef.value?.focus();
        birthMonthRef.value?.select();
    } else if (part === 'month' && value.length === 2) {
        birthYearRef.value?.focus();
        birthYearRef.value?.select();
    }
};

const onBirthPartKeydown = (part: 'day' | 'month' | 'year', event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;
    if (event.key !== 'Backspace' || input.value !== '' || input.selectionStart !== 0) {
        return;
    }

    if (part === 'month') {
        event.preventDefault();
        birthDayRef.value?.focus();
    } else if (part === 'year') {
        event.preventDefault();
        birthMonthRef.value?.focus();
    }
};

watch(
    () => createTattoStore.info.birthDate,
    (value) => {
        if (syncingBirthDateFromStore) return;
        if (buildBirthDateFromParts() === value) return;
        parseBirthDateFromStore(value);
    },
    { immediate: true },
);

watch(
    () => ({ ...createTattoStore.info }),
    () => createTattoStore.touchInfoSection(),
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
        if (!route.params.tattooUuid) {
            await router.replace(`/createtattoo/${tattooUuid}`);
        }
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

<style scoped>
.birth-part-input {
    height: 2.25rem;
    min-width: 0;
    border-radius: 0.375rem;
    border: 1px solid var(--color-input, #e5e7eb);
    background: transparent;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
    outline: none;
}

.birth-part-input:focus-visible {
    border-color: var(--color-ring, #3b82f6);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.5);
}
</style>
