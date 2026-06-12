<template>
    <div class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2 shrink-0" />
        <span>Consenso informato</span>
        <span
            class="rounded-full p-1 w-2 h-2 ml-2 shrink-0"
            :class="createTattoStore.declarationsSectionConfirmed() ? 'bg-green-700' : 'bg-amber-500'"
        />
    </div>
    <p class="text-xs text-center text-gray-600 mb-4 px-2">
        Attiva l’interruttore per indicare “sì”; lascialo spento per indicare “no”
    </p>
    <hr class="mb-4" />
    <div class="flex flex-col gap-4">
        <div
            v-for="question in DECLARATION_QUESTIONS"
            :key="question.key"
            class="shadow-md bg-white rounded-md p-3"
        >
            <div class="flex items-start justify-between gap-3">
                <p class="text-sm flex-1 min-w-0">{{ question.label }}</p>
                <button
                    type="button"
                    role="switch"
                    :aria-checked="createTattoStore.declarations[question.key] === true"
                    :aria-label="`${question.label}: ${createTattoStore.declarations[question.key] === true ? 'Sì' : 'No'}`"
                    class="relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    :class="createTattoStore.declarations[question.key] === true ? 'bg-blue-500' : 'bg-gray-400'"
                    @click="toggleAnswer(question.key)"
                >
                    <span
                        class="pointer-events-none absolute inset-1 flex items-center text-[9px] font-bold uppercase text-white"
                        :class="createTattoStore.declarations[question.key] === true ? 'justify-start pl-1' : 'justify-end pr-1'"
                    >
                        {{ createTattoStore.declarations[question.key] === true ? 'Sì' : 'No' }}
                    </span>
                    <span
                        class="pointer-events-none absolute top-1/2 left-1 size-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-200 ease-in-out"
                        :class="createTattoStore.declarations[question.key] === true ? 'translate-x-5' : 'translate-x-0'"
                    />
                </button>
            </div>
            <Input
                v-if="question.detailKey && createTattoStore.declarations[question.key] === true"
                class="mt-2"
                :placeholder="question.detailPlaceholder"
                v-model="createTattoStore.declarations[question.detailKey]"
            />
        </div>
        <div class="shadow-md bg-white rounded-md p-3">
            <p class="text-sm mb-2">{{ DECLARATION_MEDICAL_NOTES_LABEL }}</p>
            <p class="text-xs text-gray-500 mb-2">(facoltativo)</p>
            <textarea
                v-model="createTattoStore.declarations.declMedicalConditionsNotes"
                class="w-full min-h-24 p-3 text-sm border border-gray-200 rounded-md resize-y"
                placeholder="Eventuali patologie o condizioni mediche..."
            />
        </div>
        <div class="shadow-md bg-white rounded-md p-3">
            <div class="flex items-start justify-between gap-3">
                <p class="text-sm flex-1 min-w-0">Do il consenso per il trattamento dati</p>
                <button
                    type="button"
                    role="switch"
                    aria-checked="true"
                    aria-label="Consenso per il trattamento dati: Sì"
                    class="relative h-7 w-12 shrink-0 rounded-full p-1 bg-blue-500 cursor-default"
                >
                    <span class="pointer-events-none absolute inset-1 flex items-center text-[9px] font-bold uppercase text-white justify-start pl-1">Sì</span>
                    <span class="pointer-events-none absolute top-1/2 left-1 size-5 -translate-y-1/2 rounded-full bg-white shadow translate-x-5" />
                </button>
            </div>
        </div>
        <div class="shadow-md bg-white rounded-md p-3">
            <div class="flex items-start justify-between gap-3">
                <p class="text-sm flex-1 min-w-0">Do il consenso per la liberatoria</p>
                <button
                    type="button"
                    role="switch"
                    aria-checked="true"
                    aria-label="Consenso per la liberatoria: Sì"
                    class="relative h-7 w-12 shrink-0 rounded-full p-1 bg-blue-500 cursor-default"
                >
                    <span class="pointer-events-none absolute inset-1 flex items-center text-[9px] font-bold uppercase text-white justify-start pl-1">Sì</span>
                    <span class="pointer-events-none absolute top-1/2 left-1 size-5 -translate-y-1/2 rounded-full bg-white shadow translate-x-5" />
                </button>
            </div>
        </div>
    </div>
    <Button @click="submit" class="w-full h-12 mt-2">Conferma dichiarazioni</Button>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import Input from '@shared/components/ui/input/Input.vue';
import { ClipboardList } from 'lucide-vue-next';
import { watch } from 'vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { useUiStore } from '@/stores/ui';
import { useTatoosStore } from '@/stores/tattoos.store';
import { updateTattoo, getTattoByUuid } from '@/services/api.tattoo.service';
import {
    DECLARATION_QUESTIONS,
    DECLARATION_MEDICAL_NOTES_LABEL,
    type DeclarationAnswerKey,
} from '@/constants/tattoo-declarations.config';

const createTattoStore = useCreateTattoStore();
const uiStore = useUiStore();
const tattoosStore = useTatoosStore();

watch(
    () => ({ ...createTattoStore.declarations }),
    () => {
        if (createTattoStore.declarationsSectionConfirmed()) {
            createTattoStore.invalidateSection('declarations');
        }
    },
    { deep: true },
);

const toggleAnswer = (key: DeclarationAnswerKey) => {
    const current = createTattoStore.declarations[key];
    createTattoStore.setDeclarationAnswer(key, current !== true);
};

const submit = async () => {
    uiStore.loading = true;
    if (!createTattoStore.declarationsValidation()) {
        uiStore.setToast('Rispondi sì o no a tutte le voci. Se hai risposto sì, compila i dettagli richiesti.', 'error');
        uiStore.loading = false;
        return;
    }
    const tattooUuid = createTattoStore.uuid;
    if (!tattooUuid) {
        uiStore.setToast('Completa prima i dati cliente', 'error');
        uiStore.loading = false;
        return;
    }
    try {
        await updateTattoo(tattooUuid, createTattoStore.buildDeclarationsPayload());
        const updatedTattoo = await getTattoByUuid(tattooUuid);
        createTattoStore.updateDeclarationsFromApi(updatedTattoo);
        tattoosStore.tattoos = tattoosStore.tattoos
            .map((tattoo) => (tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo))
            .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
        createTattoStore.confirmSection('declarations');
        uiStore.setToast('Dichiarazioni salvate');
    } catch {
        uiStore.setToast('Errore nel salvataggio delle dichiarazioni', 'error');
    }
    uiStore.loading = false;
};
</script>
