<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Tatuaggio
        <div class="rounded-full p-1 w-2 h-2 ml-2"
            :class="createTattoStore.tattooPhotoValidation() ? 'bg-green-700' : 'bg-amber-500'"></div>
    </p>
    <hr />
    <form @submit.prevent="addTattooArtist" class="">
        <label>
            Nome tatuatore
            <Input placeholder="Nome tatuatore" required v-model="createTattoStore.tattooArtist" />
        </label>
        <Button type="submit" class="mt-2 w-full h-9">Conferma tatuatore</Button>
    </form>
    <hr class="my-4" />
    <p class="text-center font-bold mb-2 text-sm">Foto prima del tatuaggio</p>
    <div class="rounded-full w-2 h-2 mb-2 mx-auto"
        :class="createTattoStore.photoBeforeUrl ? 'bg-green-700' : 'bg-amber-500'"></div>
    <div class="flex justify-center gap-2 mb-6">
        <img v-if="createTattoStore.photoBeforeUrl" :src="createTattoStore.photoBeforeUrl"
            alt="Prima del tatuaggio"
            class="w-30 bg-white shadow-2xl border-1 h-30 rounded-xl object-cover" />
        <Button type="button"
            class="w-30 bg-white text-black shadow-2xl border-1 whitespace-normal flex flex-col h-30"
            @click="selectFile('before')">
            {{ createTattoStore.photoBeforeUrl ? 'Sostituisci foto' : 'Aggiungi foto' }}
            <Plus class="border-1 rounded-full scale-150 mt-2" />
        </Button>
    </div>
    <hr class="my-4" />
    <p class="text-center font-bold mb-2 text-sm">Foto dopo il tatuaggio</p>
    <div class="rounded-full w-2 h-2 mb-2 mx-auto"
        :class="createTattoStore.photoAfterUrl ? 'bg-green-700' : 'bg-amber-500'"></div>
    <div class="flex justify-center gap-2">
        <img v-if="createTattoStore.photoAfterUrl" :src="createTattoStore.photoAfterUrl"
            alt="Dopo il tatuaggio"
            class="w-30 bg-white shadow-2xl border-1 h-30 rounded-xl object-cover" />
        <Button type="button"
            class="w-30 bg-white text-black shadow-2xl border-1 whitespace-normal flex flex-col h-30"
            :disabled="!createTattoStore.photoBeforeUrl"
            @click="selectFile('after')">
            {{ createTattoStore.photoAfterUrl ? 'Sostituisci foto' : 'Aggiungi foto' }}
            <Plus class="border-1 rounded-full scale-150 mt-2" />
        </Button>
    </div>
    <p v-if="!createTattoStore.photoBeforeUrl" class="text-xs text-center text-gray-500 mt-2">
        Carica prima la foto pre-tatuaggio
    </p>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import Input from '@shared/components/ui/input/Input.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { ClipboardList, Plus } from 'lucide-vue-next';
import { addImage, updateTattoo, getTattoByUuid } from '@/services/api.tattoo.service';
import { useUiStore } from '@/stores/ui';
import { useTatoosStore } from '@/stores/tattoos.store';

type PhotoSlot = 'before' | 'after';

const createTattoStore = useCreateTattoStore();
const uiStore = useUiStore();
const tattoosStore = useTatoosStore();

const selectFile = (slot: PhotoSlot) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) await uploadImage(slot, file);
    };
    input.click();
};

const uploadImage = async (slot: PhotoSlot, img: File) => {
    const tattooUuid = createTattoStore.uuid;
    if (!tattooUuid) {
        uiStore.setToast('Completa prima i dati cliente', 'error');
        return;
    }
    if (slot === 'after' && !createTattoStore.photoBeforeUrl) {
        uiStore.setToast('Carica prima la foto pre-tatuaggio', 'error');
        return;
    }

    uiStore.loading = true;
    try {
        const { url } = await addImage(tattooUuid, img);
        const before = slot === 'before' ? url : createTattoStore.photoBeforeUrl;
        const after = slot === 'after' ? url : createTattoStore.photoAfterUrl;
        const photoUrl = [before, after].filter((u): u is string => !!u);

        await updateTattoo(tattooUuid, { photoUrl });
        const updatedTattoo = await getTattoByUuid(tattooUuid);
        createTattoStore.syncPhotosFromApi(updatedTattoo.photoUrl);

        tattoosStore.tattoos = tattoosStore.tattoos
            .map((tattoo) => (tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo))
            .sort((a: { id: number }, b: { id: number }) => b.id - a.id);

        uiStore.setToast(
            slot === 'before' ? 'Foto pre-tatuaggio aggiunta' : 'Foto post-tatuaggio aggiunta',
        );
    } catch {
        uiStore.setToast('Errore nel caricamento della foto', 'error');
    }
    uiStore.loading = false;
};

const addTattooArtist = async () => {
    uiStore.loading = true;
    if (!createTattoStore.tattooArtist) {
        uiStore.setToast('Inserisci il nome del tatuatore', 'error');
        uiStore.loading = false;
        return;
    }
    if (!createTattoStore.photoBeforeUrl || !createTattoStore.photoAfterUrl) {
        uiStore.setToast('Carica entrambe le foto prima di confermare', 'error');
        uiStore.loading = false;
        return;
    }
    const tattooUuid = createTattoStore.uuid;
    if (tattooUuid && createTattoStore.tattooArtist) {
        await updateTattoo(tattooUuid, {
            tattooArtist: createTattoStore.tattooArtist,
            photoUrl: createTattoStore.buildPhotoUrlPayload(),
        });
        const updatedTattoo = await getTattoByUuid(tattooUuid);
        tattoosStore.tattoos = tattoosStore.tattoos
            .map((tattoo) => (tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo))
            .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
        uiStore.setToast('Dati tatuaggio salvati');
    } else {
        uiStore.setToast('Errore nel salvataggio', 'error');
    }
    uiStore.loading = false;
};
</script>
