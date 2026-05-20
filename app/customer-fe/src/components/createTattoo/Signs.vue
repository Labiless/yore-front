<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Firma
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattooStore.signValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr>
    </hr>
    <div v-if="!createTattooStore.customerSign && !createTattooStore.userSign">
        <Sign class="mb-4" ref="customerSign" :width="400" :height="200" />
        <hr>
        </hr>
        <Sign class="mb-4" ref="userSign" :width="400" :height="200" />
        <Button class="w-full h-12" @click="saveSignature">Conferma</Button>
    </div>
    <div v-else>
        <img class="bg-white mb-4 mx-auto" :src="createTattooStore.customerSign"></img>
        <hr>
        </hr>
        <img class="bg-white mx-auto" :src="createTattooStore.userSign"></img>
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

    uiStore.loading = false;
    uiStore.setToast('Firme aggiunte correttamente')
}
</script>