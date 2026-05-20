<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Tatuaggio
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.tattooPhotoValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr>
    </hr>
    <form @submit.prevent="addTattooArtist" class="">
        <label>
            <Input placeholder="Nome tatuatore" required v-model="createTattoStore.tattooArtist" />
        </label>
        <Button type="submit" class="mt-2 w-full h-9">Conferma</Button>
    </form>
    <hr>
    </hr>
    <div class="flex justify-center gap-2">
        <img :src="createTattoStore.photoUrl" v-if="createTattoStore.photoUrl"
            class="w-30 bg-white text-lack shadow-2xl border-1 whitespace-normal flex flex-col h-30 rounded-xl" />
        <Button class="w-30 bg-white text-lack shadow-2xl border-1 whitespace-normal flex flex-col h-30"
            @click="selectFile">
            Aggiungi foto del tatuaggio
            <Plus class="border-1 rounded-full scale-150 mt-2" />
        </Button>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import Input from '@shared/components/ui/input/Input.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { Plus } from 'lucide-vue-next';
import { onMounted, ref, nextTick } from 'vue';
import { addImage, updateTattoo, getTattoByUuid } from '@/services/api.tattoo.service';
import { useUiStore } from '@/stores/ui';
import { useTatoosStore } from '@/stores/tattoos.store';

const createTattoStore = useCreateTattoStore();
const uiStore = useUiStore();
const tattoosStore = useTatoosStore();

const selectFile = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.onchange = async (e: any) => {
        await uploadImage(e.target.files[0]);
    }
    input.click();
}

const uploadImage = async (img: any) => {
    const tattooUuid = createTattoStore.uuid;
    if (!tattooUuid) {
        uiStore.setToast('Completa prima i dati cliente', 'error');
        return;
    }
    uiStore.loading = true;
    const updatedTattoo = await addImage(tattooUuid, img);
    createTattoStore.photoUrl = updatedTattoo.url;
    uiStore.loading = false;
    uiStore.setToast('Immagine aggiunta')
}

const addTattooArtist = async () => {
    uiStore.loading = true;
    if (!createTattoStore.tattooArtist) {
        uiStore.setToast('Inserisci il nome del tatuatore', 'error');
        uiStore.loading = false;
        return;
    }
    if (createTattoStore.uuid && createTattoStore.tattooArtist) {
        await updateTattoo(createTattoStore.uuid, {
            tattooArtist: createTattoStore.tattooArtist
        })
        const updatedTattoo = await getTattoByUuid(createTattoStore.uuid);
        tattoosStore.tattoos = tattoosStore.tattoos.map(tattoo => tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo)
        tattoosStore.tattoos = tattoosStore.tattoos.sort((a: any, b: any) => b.id - a.id)
        uiStore.setToast('Tatuatore aggiunto');
    }
    else {
        uiStore.setToast('Errore nell\'aggiunta del tatuatore', 'error');
    }
    uiStore.loading = false;
}

onMounted(async () => {

});

</script>