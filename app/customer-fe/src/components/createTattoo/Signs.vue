<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Firme
        <span class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
            :class="`${createTattooStore.signSectionConfirmed() ? '' : 'bg-amber-500!'}`"></span>
    </p>
    <p class="text-xs text-center text-gray-600 mb-4 px-2">
        Apponi la firma del tatuato e quella del tatuatore nei riquadri sottostanti.
    </p>
    <hr />
    <div v-if="!createTattooStore.customerSign && !createTattooStore.userSign">
        <section class="mb-4">
            <p class="text-sm font-bold mb-2">Firma del tatuato</p>
            <p class="text-xs text-gray-600 mb-2">Persona che riceve il tatuaggio</p>
            <Sign ref="customerSign" :width="400" :height="200" />
        </section>
        <hr />
        <section class="mb-4">
            <p class="text-sm font-bold mb-2">Firma del tatuatore</p>
            <p class="text-xs text-gray-600 mb-2">Operatore che esegue il tatuaggio</p>
            <Sign ref="userSign" :width="400" :height="200" />
        </section>
        <Button class="w-full h-12" @click="saveSignature">Conferma</Button>
    </div>
    <div v-else>
        <section class="mb-4">
            <p class="text-sm font-bold mb-2 text-center">Firma del tatuato</p>
            <img class="bg-white mx-auto rounded-md shadow-md" :src="createTattooStore.customerSign"
                alt="Firma del tatuato" />
        </section>
        <hr />
        <section>
            <p class="text-sm font-bold mb-2 text-center">Firma del tatuatore</p>
            <img class="bg-white mx-auto rounded-md shadow-md" :src="createTattooStore.userSign"
                alt="Firma del tatuatore" />
        </section>
    </div>
</template>
<script setup lang="ts">
import { useCreateTattoStore } from '@/stores/createTatto.store';
import Button from '@shared/components/ui/button/Button.vue';
import Sign from './Sign.vue';
import { onMounted, ref } from 'vue';
import { saveSigns, getTattoByUuid } from '@/services/api.tattoo.service';
import { useUiStore } from '@/stores/ui';
import { useTatoosStore } from '@/stores/tattoos.store';

const customerSign = ref<{ saveSignature: () => string } | null>(null);
const userSign = ref<{ saveSignature: () => string } | null>(null);
const createTattooStore = useCreateTattoStore();
const uiStore = useUiStore();
const tattoosStore = useTatoosStore();

onMounted(() => {
    console.log(createTattooStore.customerSign);
})

const saveSignature = async () => {
    uiStore.loading = true;
    const tattooUuid = createTattooStore.uuid;
    if (!tattooUuid || !customerSign.value || !userSign.value) {
        uiStore.loading = false;
        uiStore.setToast('Dati mancanti per salvare le firme', 'error');
        return;
    }

    const sign1 = customerSign.value.saveSignature();
    const sign2 = userSign.value.saveSignature();
    if (!sign1 || !sign2) {
        uiStore.loading = false;
        uiStore.setToast('Firma mancante', 'error');
        return;
    }
    const res = await saveSigns(tattooUuid, sign1, sign2);
    createTattooStore.customerSign = res.customerUrl;
    createTattooStore.userSign = res.userUrl;

    const updatedTattoo = await getTattoByUuid(tattooUuid);
    tattoosStore.tattoos = tattoosStore.tattoos.map(tattoo => tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo)
    tattoosStore.tattoos = tattoosStore.tattoos.sort((a: any, b: any) => b.id - a.id)

    createTattooStore.confirmSection('sign');
    uiStore.loading = false;
    uiStore.setToast('Firme aggiunte correttamente');
};
</script>