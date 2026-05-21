<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Dichiarazioni del soggetto
        <div class="rounded-full p-1 w-2 h-2 ml-2"
            :class="createTattoStore.declarationsValidation() ? 'bg-green-700' : 'bg-amber-500'"></div>
    </p>
    <p class="text-xs text-center text-gray-600 mb-4 px-2">Il soggetto dichiara (rispondere sì o no a ogni voce):</p>
    <hr />
    <div class="flex flex-col gap-4 max-h-[50vh] overflow-y-auto hide-scrollbar pb-4">
        <div v-for="question in DECLARATION_QUESTIONS" :key="question.key"
            class="shadow-md bg-white rounded-md p-3">
            <p class="text-sm mb-2">{{ question.label }}</p>
            <div class="grid grid-cols-2 gap-2">
                <Button type="button" class="h-10"
                    :class="createTattoStore.declarations[question.key] === true ? 'border-2 border-blue-400' : ''"
                    @click="setAnswer(question.key, true)">
                    Sì
                </Button>
                <Button type="button" class="h-10"
                    :class="createTattoStore.declarations[question.key] === false ? 'border-2 border-blue-400' : ''"
                    @click="setAnswer(question.key, false)">
                    No
                </Button>
            </div>
            <Input v-if="question.detailKey && createTattoStore.declarations[question.key] === true"
                class="mt-2"
                :placeholder="question.detailPlaceholder"
                v-model="createTattoStore.declarations[question.detailKey]" />
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
    </div>
    <Button @click="submit" class="w-full h-12 mt-2">Conferma dichiarazioni</Button>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import Input from '@shared/components/ui/input/Input.vue';
import { ClipboardList } from 'lucide-vue-next';
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

const setAnswer = (key: DeclarationAnswerKey, value: boolean) => {
    createTattoStore.setDeclarationAnswer(key, value);
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
        uiStore.setToast('Dichiarazioni salvate');
    } catch {
        uiStore.setToast('Errore nel salvataggio delle dichiarazioni', 'error');
    }
    uiStore.loading = false;
};
</script>
