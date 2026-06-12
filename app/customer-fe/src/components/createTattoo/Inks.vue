<template>
    <div class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2 shrink-0" />
        <span>Inchiostro</span>
        <span
            class="rounded-full p-1 w-2 h-2 ml-2 shrink-0"
            :class="createTattoStore.inksSectionConfirmed() ? 'bg-green-700' : 'bg-amber-500'"
        />
    </div>
    <hr class="mb-4" />

    <section v-if="isMobileOrTablet" class="shadow-md bg-white rounded-md p-3 mb-4">
        <p class="text-sm font-semibold mb-1">Scansiona QR code</p>
        <p class="text-xs text-gray-600 mb-3">
            Usa la fotocamera del dispositivo per leggere il codice sull'etichetta.
        </p>
        <Button type="button" class="w-full h-11 flex items-center justify-center gap-2" @click="openCamera">
            <Camera class="size-4 shrink-0" />
            Apri fotocamera
        </Button>
    </section>
    <p v-else class="text-xs text-gray-600 mb-4 px-1 text-center">
        La scansione con fotocamera è disponibile solo da smartphone o tablet. Inserisci l'UUID manualmente qui sotto.
    </p>

    <section class="shadow-md bg-white rounded-md p-3 mb-4">
        <p class="text-sm font-semibold mb-1">Inserimento manuale</p>
        <p class="text-xs text-gray-600 mb-3">
            Digita o incolla l'UUID dell'etichetta inchiostro.
        </p>
        <Input
            placeholder="UUID etichetta inchiostro"
            v-model="inkUuid"
            class="mb-2"
        />
        <Button
            type="button"
            class="w-full h-11"
            :disabled="!inkUuid.trim()"
            @click="submitManualInk"
        >
            Conferma inchiostro
        </Button>
    </section>

    <div v-if="createTattoStore.inks.length" class="mb-4">
        <p class="text-sm font-semibold mb-2">Inchiostri associati</p>
        <div
            class="w-full flex justify-start items-center shadow-md p-4 pl-4 bg-white rounded-md h-fit transition-all mb-2"
            v-for="ink in createTattoStore.inks"
            :key="ink"
        >
            <p class="text-xs break-all">{{ ink }}</p>
        </div>
    </div>

    <div
        class="video-container flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full bg-black z-40"
        v-show="isCameraOpen"
    >
        <p class="text-white mb-2 px-4 text-center">Inquadra il QR code dell'etichetta inchiostro</p>
        <div class="flex flex-wrap gap-2 mb-2 px-2 justify-center">
            <Button
                v-for="device in devices"
                :key="device.deviceId"
                type="button"
                @click="startScanner(device.deviceId)"
                class="text-xs"
            >
                {{ device.label }}
            </Button>
        </div>
        <video ref="videoEl" class="video w-full max-w-200" autoplay playsinline muted />
        <CircleX @click="stopScanner" color="red" class="mt-4" :size="30" />
    </div>

</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import Input from '@shared/components/ui/input/Input.vue';
import { Camera, CircleX, ClipboardList } from 'lucide-vue-next';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { apiLabelService } from '@/services/api.inks.service';
import { updateTattoo } from '@/services/api.tattoo.service';
import { useUserStore } from '@/stores/user.store';
import { useUiStore } from '@/stores/ui';
import { BrowserQRCodeReader } from '@zxing/browser';
import { useTatoosStore } from '@/stores/tattoos.store';

const createTattoStore = useCreateTattoStore();
const tattoosStore = useTatoosStore();
const inkUuid = ref('');
const userStore = useUserStore();
const uiStore = useUiStore();
const isCameraOpen = ref(false);
const videoEl = ref<HTMLVideoElement | null>(null);
const devices = ref<MediaDeviceInfo[]>([]);
const codeReader = ref<BrowserQRCodeReader | null>(null);
const controls = ref<{ stop: () => void } | null>(null);
const isMobileOrTablet = ref(false);

const detectMobileOrTablet = () => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    if (/Android|iPhone|iPod|iPad|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        return true;
    }
    // iPadOS può presentarsi come Macintosh con touch
    return navigator.maxTouchPoints > 1 && /Macintosh|Mac OS X/i.test(ua);
};

const INK_CONFIRM_MESSAGE =
    'Sei sicuro di voler utilizzare questo inchiostro? L\'operazione non è reversibile.';

onMounted(async () => {
    isMobileOrTablet.value = detectMobileOrTablet();
    if (isMobileOrTablet.value) {
        try {
            // Request permission once so subsequent getUserMedia calls don't prompt again.
            // Also pre-populate the device list: listVideoInputDevices() calls getUserMedia
            // internally, so doing it here avoids a second prompt when the scanner opens.
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop());
            devices.value = await BrowserQRCodeReader.listVideoInputDevices();
        } catch {
            // permesso negato o fotocamera non disponibile — gestito al momento della scansione
        }
    }
});

onBeforeUnmount(() => {
    stopScanner();
});

const addInkByUuid = async (rawUuid: string) => {
    const uuid = rawUuid.trim();
    uiStore.loading = true;
    const tattooUuid = createTattoStore.uuid;
    if (!tattooUuid) {
        uiStore.loading = false;
        uiStore.setToast('Completa prima i dati cliente', 'error');
        return;
    }
    if (!uuid) {
        uiStore.loading = false;
        uiStore.setToast('Nessun id inchiostro', 'error');
        return;
    }
    try {
        const ink = await apiLabelService.getLabelByUuid(uuid);
        if (ink && ink.burningDate === null && ink.userUuid === userStore.getUiid) {
            await apiLabelService.updateLabelByUuid(ink.uuid, {
                burningDate: new Date().toISOString(),
                tattooUuid,
            });
            inkUuid.value = '';
            const inks = [...createTattoStore.inks, ink.uuid];
            const updatedTattoo = await updateTattoo(tattooUuid, {
                inks,
                status: 'PROGRESS',
            });
            createTattoStore.inks = inks;
            createTattoStore.confirmSection('inks');
            tattoosStore.tattoos = tattoosStore.tattoos
                .map((tattoo) => (tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo))
                .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
            uiStore.setToast('Inchiostro bruciato');
        } else {
            throw new Error('Inchiostro già bruciato o inesistente');
        }
    } catch {
        uiStore.setToast('Inchiostro già bruciato o inesistente', 'error');
    }
    uiStore.loading = false;
};

const confirmAddInk = (uuid: string) => {
    uiStore.setPopoup(INK_CONFIRM_MESSAGE, () => addInkByUuid(uuid));
};

const submitManualInk = () => {
    const id = inkUuid.value.trim();
    if (!id) {
        uiStore.setToast('Inserisci l\'UUID dell\'etichetta', 'error');
        return;
    }
    confirmAddInk(id);
};

const openCamera = async () => {
    if (!isMobileOrTablet.value) {
        uiStore.setToast('La fotocamera è disponibile solo su smartphone o tablet', 'error');
        return;
    }
    try {
        await startScanner();
    } catch (e) {
        console.error(e);
        stopScanner();
    }
};

const startScanner = async (deviceId?: string) => {
    isCameraOpen.value = true;
    if (!videoEl.value) return;
    try {
        try {
            controls.value?.stop();
        } catch {
            /* nessuna sessione attiva */
        }
        controls.value = null;
        codeReader.value = null;
        codeReader.value = new BrowserQRCodeReader();
        if (!devices.value.length) {
            devices.value = await BrowserQRCodeReader.listVideoInputDevices();
        }
        controls.value = await codeReader.value.decodeFromVideoDevice(
            deviceId ?? devices.value[0]?.deviceId,
            videoEl.value,
            (result: { getText: () => string } | undefined) => {
                if (result) {
                    const scannedUuid = result.getText().trim();
                    stopScanner();
                    confirmAddInk(scannedUuid);
                }
            },
        );
    } catch {
        uiStore.setToast('Camera non disponibile', 'error');
        stopScanner();
    }
};

const stopScanner = () => {
    try {
        controls.value?.stop();
    } catch {
        /* scanner già fermato */
    }
    controls.value = null;
    codeReader.value = null;
    isCameraOpen.value = false;
};
</script>

<style scoped></style>
