<template>
    <div class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2 shrink-0" />
        <span>Tatuaggio</span>
        <span
            class="rounded-full p-1 w-2 h-2 ml-2 shrink-0"
            :class="createTattoStore.tattooSectionConfirmed() ? 'bg-green-700' : 'bg-amber-500'"
        />
    </div>
    <hr class="mb-4" />

    <section class="shadow-md bg-white rounded-md p-3 mb-4">
        <p class="text-sm font-semibold mb-1">Nome tatuatore</p>
        <p class="text-xs text-gray-600 mb-3">
            Inserisci e salva il nome del tatuatore che ha eseguito il tatuaggio.
        </p>
        <form @submit.prevent="saveTattooArtist">
            <Input
                placeholder="Nome tatuatore"
                required
                v-model="createTattoStore.tattooArtist"
                class="mb-2"
            />
            <Button type="submit" class="w-full h-11" :disabled="!createTattoStore.tattooArtist?.trim()">
                Conferma nome tatuatore
            </Button>
        </form>
        <p v-if="createTattoStore.tattooArtist?.trim()" class="text-xs text-green-700 mt-2">
            Nome inserito{{ tattooArtistSaved ? ' e salvato' : '' }}.
        </p>
    </section>

    <section class="shadow-md bg-white rounded-md p-3 mb-4">
        <p class="text-sm font-semibold mb-1">Foto prima del tatuaggio</p>
        <div class="rounded-full w-2 h-2 mb-3 mx-auto"
            :class="createTattoStore.photoBeforeUrl ? 'bg-green-700' : 'bg-amber-500'"></div>
        <div class="flex justify-center gap-2">
            <button
                v-if="createTattoStore.photoBeforeUrl"
                type="button"
                class="hover:bg-white hover:border-2 hover:border-blue-400 w-30 h-30 rounded-xl overflow-hidden shadow-2xl border-1 bg-white hover:opacity-90 transition-opacity"
                @click="openPhotoPreview(createTattoStore.photoBeforeUrl, 'Prima del tatuaggio')"
            >
                <img
                    :src="createTattoStore.photoBeforeUrl"
                    alt="Prima del tatuaggio"
                    class="w-full h-full object-cover"
                />
            </button>
            <Button
                type="button"
                class="hover:bg-white hover:border-2 hover:border-blue-400 w-30 bg-white text-black shadow-2xl border-1 whitespace-normal flex flex-col h-30"
                @click="selectFile('before')"
            >
                {{ createTattoStore.photoBeforeUrl ? 'Sostituisci foto' : 'Aggiungi foto' }}
                <Plus class="border-1 rounded-full scale-150 mt-2" />
            </Button>
        </div>
    </section>

    <section class="shadow-md bg-white rounded-md p-3 mb-4">
        <p class="text-sm font-semibold mb-1">Foto dopo il tatuaggio</p>
        <div class="rounded-full w-2 h-2 mb-3 mx-auto"
            :class="createTattoStore.photoAfterUrl ? 'bg-green-700' : 'bg-amber-500'"></div>
        <div class="flex justify-center gap-2">
            <button
                v-if="createTattoStore.photoAfterUrl"
                type="button"
                class="w-30 h-30 rounded-xl overflow-hidden shadow-2xl border-1 bg-white hover:opacity-90 transition-opacity"
                @click="openPhotoPreview(createTattoStore.photoAfterUrl, 'Dopo il tatuaggio')"
            >
                <img
                    :src="createTattoStore.photoAfterUrl"
                    alt="Dopo il tatuaggio"
                    class="w-full h-full object-cover"
                />
            </button>
            <Button
                type="button"
                class="w-30 bg-white text-black shadow-2xl border-1 whitespace-normal flex flex-col h-30"
                :disabled="!createTattoStore.photoBeforeUrl"
                @click="selectFile('after')"
            >
                {{ createTattoStore.photoAfterUrl ? 'Sostituisci foto' : 'Aggiungi foto' }}
                <Plus class="border-1 rounded-full scale-150 mt-2" />
            </Button>
        </div>
        <p v-if="!createTattoStore.photoBeforeUrl" class="text-xs text-center text-gray-500 mt-2">
            Carica prima la foto pre-tatuaggio
        </p>
    </section>

    <div
        v-if="photoPreview"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
        @click.self="closePhotoPreview"
    >
        <p class="text-white text-sm font-semibold mb-3">{{ photoPreview.label }}</p>
        <img
            :src="photoPreview.url"
            :alt="photoPreview.label"
            class="max-w-full max-h-[75vh] rounded-lg object-contain shadow-2xl"
        />
        <button
            type="button"
            class="mt-4 text-white flex items-center gap-2 text-sm"
            @click="closePhotoPreview"
        >
            <CircleX :size="28" />
            Chiudi
        </button>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import Input from '@shared/components/ui/input/Input.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { CircleX, ClipboardList, Plus } from 'lucide-vue-next';
import { buildPhotoUrlArray } from '@/constants/tattoo.config';
import { addImage, updateTattoo, getTattoByUuid } from '@/services/api.tattoo.service';
import { useUiStore } from '@/stores/ui';
import { useTatoosStore } from '@/stores/tattoos.store';
import { onMounted, ref } from 'vue';

type PhotoSlot = 'before' | 'after';

const createTattoStore = useCreateTattoStore();
const uiStore = useUiStore();
const tattoosStore = useTatoosStore();
const tattooArtistSaved = ref(false);
const photoPreview = ref<{ url: string; label: string } | null>(null);

const openPhotoPreview = (url: string | undefined, label: string) => {
    if (!url) return;
    photoPreview.value = { url, label };
};

const closePhotoPreview = () => {
    photoPreview.value = null;
};

const tryConfirmTattooSection = () => {
    if (createTattoStore.photoBeforeUrl && createTattoStore.photoAfterUrl) {
        createTattoStore.confirmSection('tattoo');
    }
};

onMounted(() => {
    if (createTattoStore.tattooArtist?.trim()) {
        tattooArtistSaved.value = true;
    }
    tryConfirmTattooSection();
});

const refreshTattooInList = async (tattooUuid: string) => {
    const updatedTattoo = await getTattoByUuid(tattooUuid);
    tattoosStore.tattoos = tattoosStore.tattoos
        .map((tattoo) => (tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo))
        .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
    return updatedTattoo;
};

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
        const photoUrl = buildPhotoUrlArray(before, after);

        await updateTattoo(tattooUuid, { photoUrl });
        const updatedTattoo = await refreshTattooInList(tattooUuid);
        createTattoStore.syncPhotosFromApi(updatedTattoo.photoUrl);
        tryConfirmTattooSection();

        uiStore.setToast(
            slot === 'before' ? 'Foto pre-tatuaggio aggiunta' : 'Foto post-tatuaggio aggiunta',
        );
    } catch {
        uiStore.setToast('Errore nel caricamento della foto', 'error');
    }
    uiStore.loading = false;
};

const saveTattooArtist = async () => {
    const name = createTattoStore.tattooArtist?.trim();
    if (!name) {
        uiStore.setToast('Inserisci il nome del tatuatore', 'error');
        return;
    }

    const tattooUuid = createTattoStore.uuid;
    if (!tattooUuid) {
        uiStore.setToast('Completa prima i dati cliente', 'error');
        return;
    }

    uiStore.loading = true;
    try {
        await updateTattoo(tattooUuid, { tattooArtist: name });
        createTattoStore.tattooArtist = name;
        tattooArtistSaved.value = true;
        await refreshTattooInList(tattooUuid);
        uiStore.setToast('Nome tatuatore salvato');
    } catch {
        uiStore.setToast('Errore nel salvataggio del tatuatore', 'error');
    }
    uiStore.loading = false;
};
</script>
