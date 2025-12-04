<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Tatuaggio
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.tattooPhotoValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr>
    </hr>
    <div class="grid grid-cols-3 gap-2">
        <img :src="createTattoStore.photoUrl" v-if="createTattoStore.photoUrl" class="w-30 bg-white text-lack shadow-2xl border-1 whitespace-normal flex flex-col h-30 rounded-xl" />
        <Button class="w-30 bg-white text-lack shadow-2xl border-1 whitespace-normal flex flex-col h-30" @click="selectFile">
            Aggiungi foto del tatuaggio
            <Plus class="border-1 rounded-full scale-150 mt-2" />
        </Button>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/button.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { Plus } from 'lucide-vue-next';
import { onMounted, ref, nextTick } from 'vue';
import { addImage } from '@/services/api.tattoo.service';
import { useUiStore } from '@/stores/ui';

const createTattoStore = useCreateTattoStore();
const uiStore = useUiStore();

const selectFile = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.onchange = async (e: any) => {
        await uploadImage(e.target.files[0]);
    }
    input.click();
}

const uploadImage = async (img :any) => {
    uiStore.loading = true;
    const res = await addImage(createTattoStore.uuid, img);
    createTattoStore.photoUrl = `${res.url}?v=${Date.now()}`;
    uiStore.loading = false;
    uiStore.setToast('Imaggine aggiunta')
}

onMounted(async () => {

});

</script>