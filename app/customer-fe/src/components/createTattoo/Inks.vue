<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Inchiostro
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.inksValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr />
    <Button @click="scanInk" class="w-full h-12">Scansiona Inchiostro</Button>
    <Input placeholder="Id inchiostro" v-model="inkUuid"></Input>
    <div class="" v-if="createTattoStore.inks.length">
        <p>Inchostri scansionati</p>
    </div>
    <div class="w-full flex justify-start items-center shadow-md p-4 pl-4 bg-white rounded-md h-fit transition-all"
        v-for="ink in createTattoStore.inks">
        <div class="">
            <p class="text-xs font-bold">#000000</p>
            <p class="text-xs">{{ ink }}</p>
        </div>
    </div>
    <div class="video-container flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full bg-black z-50"
        v-if="isCameraOpen">
        <p class="text-white mb-2">Inquadra il qrcode dell'inchiostro</p>
        <video ref="videoEl" class="video w-full max-w-200" autoplay playsinline muted></video>
        <CircleX @click="stopScanner" color="red" class="mt-4" :size="30"></CircleX>
    </div>

</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import Input from '@shared/components/ui/input/Input.vue';
import { CircleX } from 'lucide-vue-next';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { apiLabelService } from '@/services/api.inks.service';
import { createTattoo, getTattoByUuid, updateTattoo } from '@/services/api.tattoo.service';
import { userUserStore } from '@/stores/user.store';
import { useUiStore } from '@/stores/ui';
import { BrowserQRCodeReader } from '@zxing/browser';
import { useTatoosStore } from '@/stores/tattoos.store';

const createTattoStore = useCreateTattoStore();
const tattoosStore = useTatoosStore();
const inkUuid = ref('');
const userStore = userUserStore();
const uiStore = useUiStore();
const isCameraOpen = ref(false);
const videoEl = ref<HTMLVideoElement | null>(null);
let codeReader = null;
let controls = null;

onBeforeUnmount(() => {
    stopScanner();
});

const addInk = async () => {
    uiStore.loading = true;
    if (inkUuid.value) {
        try {
            const ink = await apiLabelService.getLabelByUuid(inkUuid.value);
            if (ink && ink.burningDate === null && ink.userUuid === userStore.getUiid) {
                await apiLabelService.updateLabelByUuid(ink.uuid, {
                    burningDate: new Date(),
                    tattooUuid: createTattoStore.uuid,
                });
                inkUuid.value = '';
                const inks = [...createTattoStore.inks, ink.uuid]
                const updatedTattoo = await updateTattoo(
                    createTattoStore.uuid,
                    {
                        inks,
                        status: 'PROGRESS',
                    }
                )
                createTattoStore.inks = inks;
                tattoosStore.tattoos = tattoosStore.tattoos.map(tattoo => tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo)
                tattoosStore.tattoos = tattoosStore.tattoos.sort((a: any, b: any) => b.id - a.id)
                uiStore.loading = false;
                uiStore.setToast('Inchiostro bruciato');
            }
            else {
                throw new Error('Inchiostro già bruciato o inesistente');
            }
        } catch (error: Error | any) {
            uiStore.loading = false;
            uiStore.setToast('Inchiostro già bruciato o inesistente', 'error');
        }
    }
    else {
        uiStore.loading = false;
        uiStore.setToast('Nessun id inchiostro', 'error');
    }
}

const scanInk = async () => {
    if (inkUuid.value) {
        uiStore.setPopoup('Sei sicuro di voler utilizzare questo l\'inchiostro? L\'operazione non è reversibile', () => {
            addInk();
        });
        return;
    }
    try {
        isCameraOpen.value = !isCameraOpen.value;
        codeReader = new BrowserQRCodeReader();
        controls = await codeReader.decodeFromVideoDevice(
            undefined,
            videoEl.value,
            (result, err) => {
                if (result) {
                    stopScanner(); // chiudi dopo il primo match (comportamento tipico)
                    inkUuid.value = result.getText();
                    uiStore.setPopoup('Sei sicuro di voler utilizzare questo l\'inchiostro? L\'operazione non è reversibile', () => {
                        addInk();
                    });
                }
            }
        );
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoEl.value.srcObject = stream;
    } catch (e) {
        console.error(e);
        stopScanner();
    }
}

const stopScanner = () => {
    try {
        controls?.stop?.();
    } catch { }
    controls = null;

    try {
        codeReader?.reset?.();
    } catch { }
    codeReader = null;
    isCameraOpen.value = false;
}

</script>

<style scoped></style>