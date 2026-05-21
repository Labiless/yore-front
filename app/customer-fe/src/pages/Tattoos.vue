<template>
    <div class="items-start">
        <router-link to="/createtattoo" @click="createTattooStore.resetTattoo">
            <Button class="w-full h-12 mb-4">
                <Plus />Nuovo tatuaggio
            </Button>
        </router-link>

        <div class="flex items-center gap-2 p-2 my-4 mx-auto rounded-md bg-slate-200">
            <Button @click="showTab = 0" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 0 ? 'bg-white!' : 'shadow-none'}`">Tutti</Button>
            <Button @click="showTab = 1" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 1 ? 'bg-white!' : 'shadow-none'}`">
                <p class="w-3 h-3 rounded-full bg-green-500"></p>
            </Button>
            <Button @click="showTab = 2" class="text-xs text-center w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 2 ? 'bg-white!' : 'shadow-none'}`">
                <p class="w-3 h-3 rounded-full bg-orange-500"></p>
            </Button>
            <Button @click="startDeletion" class="text-xs text-center w-fit h-8 bg-transparent text-black"
                :class="`${activeDelete ? 'bg-red-500! text-white' : 'shadow-none'}`">
                <Trash />
            </Button>
        </div>
        <div class="overflow-y-scroll hide-scrollbar h-[60vh]">
            <Transition>
                <div v-if="!activeTattoo">
                    <div v-show="showIfStatus(tattoo.status)" @click="onclickTattoo(tattoo)"
                        class="flex items-start gap-3 shadow-md p-2 pl-4 pr-3 bg-white mb-4 rounded-md w-full hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
                        :class="`${activeDelete && isDeletable(tattoo.status) ? 'active-delete' : ''}`"
                        v-for="tattoo in tattoosStore.tattoos"
                        :key="tattoo.uuid">
                        <div class="shrink-0 w-[30px] h-[30px] mt-0.5">
                            <img v-if="listTattooThumb(tattoo.photoUrl)" :src="listTattooThumb(tattoo.photoUrl)"
                                class="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full object-cover"
                                alt="" />
                            <div v-else class="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-gray-500"></div>
                        </div>
                        <div class="flex-1 min-w-0 flex gap-2 py-0.5">
                            <div class="flex flex-col items-center gap-1.5 shrink-0 w-7 pt-0.5">
                                <span class="text-xs font-medium text-gray-700">#{{ tattoo.id }}</span>
                                <Calendar class="size-3.5 shrink-0 opacity-60" />
                                <Droplet v-if="hasAssociatedInk(tattoo)" class="size-3.5 shrink-0 text-gray-600" />
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col gap-1">
                                <div class="flex items-start gap-2">
                                    <p class="flex-1 min-w-0 capitalize text-md font-bold leading-tight truncate">
                                        {{ tattoo.customerName }}
                                    </p>
                                    <div class="w-3 h-3 rounded-full shrink-0 mt-1" :class="getStatusColor(tattoo)"></div>
                                </div>
                                <p class="text-xs opacity-60">{{ tattoo.creationDate.split("T")[0] }}</p>
                                <p v-if="hasAssociatedInk(tattoo)"
                                    class="text-xs text-gray-600 truncate leading-snug"
                                    :title="associatedInkIds(tattoo)">
                                    {{ associatedInkIds(tattoo) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="overflow-y-scroll hide-scrollbar h-[60vh]">
                    <div class="flex items-center mb-4">
                        <ArrowLeft @click="goBackToTattoosList" class="hover:cursor-pointer mr-2" />
                    </div>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <a v-if="activeTattoo.certificateUrl" :href="activeTattoo.certificateUrl" target="_blank">
                            <Button class="text-xs">Scarica certificato</Button>
                        </a>
                        <a v-if="activeTattoo.releaseFormUrl" :href="activeTattoo.releaseFormUrl" target="_blank">
                            <Button class="text-xs">Scarica consenso informato</Button>
                        </a>
                    </div>
                    <div>
                        <div class="mb-4">
                            <p class="text-xl font-bold flex items-center mb-2 capitalize">
                                <User /> {{ activeTattoo.customerName }}
                            </p>
                            <p class="text-xs">{{ activeTattoo.creationDate.split('T')[0] }}</p>
                            <p class="text-xs opacity-60">{{ activeTattoo.uuid }}</p>
                        </div>
                        <div v-if="tattooPhotos.before || tattooPhotos.after" class="flex gap-2 mb-4 flex-wrap">
                            <div v-if="tattooPhotos.before" class="w-1/2 min-w-[140px]">
                                <p class="text-xs font-bold mb-1">Prima</p>
                                <img :src="tattooPhotos.before" class="w-full border-2 rounded-md object-cover"
                                    alt="Prima del tatuaggio" />
                            </div>
                            <div v-if="tattooPhotos.after" class="w-1/2 min-w-[140px]">
                                <p class="text-xs font-bold mb-1">Dopo</p>
                                <img :src="tattooPhotos.after" class="w-full border-2 rounded-md object-cover"
                                    alt="Dopo il tatuaggio" />
                            </div>
                        </div>
                        <div class="mb-4">
                            <p class="font-bold">Caratteristiche del tatuaggio</p>
                            <p>Colore: {{ inkColorLabel }}</p>
                            <p>Stile: {{ activeTattoo.tattooStyle ?? '—' }}</p>
                            <p>Tipo: {{ tattooTypeLabel }}</p>
                            <p>Posizione: {{ activeTattoo.position ?? '—' }}</p>
                            <p>Tipo pelle: {{ activeTattoo.skinType ?? '—' }}</p>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { Calendar, Plus, Trash, ArrowLeft, Droplet } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';
import { useTatoosStore } from '@/stores/tattoos.store';
import { deleteTattoo, getTattoosByUserUuid } from '@/services/api.tattoo.service';
import {
    syncTattooPhotos,
    INK_COLOR_LABELS,
    TATTOO_TYPE_LABELS,
} from '@/constants/tattoo.config';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import Button from '@shared/components/ui/button/Button.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { getCustomerByUuid } from '@/services/api.customer.service';
import { useUserStore } from '@/stores/user.store';

const showTab = ref(0)
const uiStore = useUiStore();
const tattoosStore = useTatoosStore();
const createTattooStore = useCreateTattoStore();
const userStore = useUserStore();
const activeTattoo = ref<any>(null);
const activeDelete = ref(false);
const route = useRoute();

const tattooPhotos = computed(() =>
    activeTattoo.value ? syncTattooPhotos(activeTattoo.value.photoUrl) : {},
);

const listTattooThumb = (photoUrl: string | string[] | null | undefined) => {
    const { after, before } = syncTattooPhotos(photoUrl);
    return after ?? before;
};
const inkColorLabel = computed(() => {
    const color = activeTattoo.value?.color;
    if (!color) return '—';
    return INK_COLOR_LABELS[color] ?? color;
});
const tattooTypeLabel = computed(() => {
    const type = activeTattoo.value?.tattooType;
    if (!type) return '—';
    return TATTOO_TYPE_LABELS[type]?.title ?? type;
});

watch(
    () => route.fullPath,
    (newPath, oldPath) => {
        if (newPath === '/tattoos') activeTattoo.value = null;
        if (getTattooUuidFromUrl() && activeTattoo.value === null) {
            showClosedTattoo(getTattooUuidFromUrl());
        }
    }
)

const getTattooUuidFromUrl = (): string => {
    console.log(route.params.tattooUuid);
    try {
        return route.params.tattooUuid as string;
    } catch (error) {
        return '';
    }
}

const showIfStatus = (status: string) => {
    if (showTab.value === 0) return true;
    if (showTab.value === 1) return status === 'CLOSE';
    if (showTab.value === 2) return status !== 'CLOSE';
    if (showTab.value === 3) return status !== 'CLOSE' && status !== 'PROGRESS';
}

const isDeletable = (status: string) => {
    return status !== 'CLOSE' && status !== 'PROGRESS';
}

const hasAssociatedInk = (tattoo: { inks?: string[] }) =>
    Array.isArray(tattoo.inks) && tattoo.inks.length > 0;

const associatedInkIds = (tattoo: { inks?: string[] }) =>
    (tattoo.inks ?? []).join(', ');

const getStatusColor = (tattoo: { status: string; inks?: string[] }) => {
    if (tattoo.status === 'CLOSE') return 'bg-green-500';
    if (hasAssociatedInk(tattoo)) return 'bg-yellow-500';
    return 'bg-orange-500';
};

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Tatuaggi";

    if (tattoosStore.tattoos.length === 0) {
        const res = await getTattoosByUserUuid(userStore.getUiid);
        tattoosStore.tattoos = res.sort((a: any, b: any) => b.id - a.id);
    }

    try {
        if (getTattooUuidFromUrl().length > 0) {
            await showClosedTattoo(getTattooUuidFromUrl());
        }
    } catch (error) {
        console.log('error in showing closed tattoo');
        console.log(error);
    }
    uiStore.loading = false;
});

const onclickTattoo = async (tattoo: any) => {
    if (activeDelete.value) {
        if (!isDeletable(tattoo.status)) {
            uiStore.setToast('Non è possibile eliminare tatuaggi con inchiostri associati', 'error');
            return;
        }
        await tattoDeletion(tattoo);
        return;
    }
    if (tattoo.status !== 'CLOSE') {
        goToTatto(tattoo.uuid);
        return
    } else {
        router.push('tattoos/' + tattoo.uuid);
        await showClosedTattoo(tattoo.uuid);
    }
}

const tattoDeletion = async (tattoo: any) => {
    uiStore.setPopoup('Confermi di voler eliminare il tatuaggio?', async () => {
        uiStore.loading = true;
        await deleteTattoo(tattoo.uuid);
        tattoosStore.tattoos = tattoosStore.tattoos.filter(el => el.uuid !== tattoo.uuid);
        activeDelete.value = false;
        showTab.value = 0;
        uiStore.loading = false;
        uiStore.setToast('Tatuaggio eliminato');
    });
}

const goToTatto = (tattooUuid: string) => {
    createTattooStore.uuid = tattooUuid;
    router.push('/createtattoo');
}

const showClosedTattoo = async (tattooUuid: string) => {
    uiStore.loading = true;
    try {
        activeTattoo.value = tattoosStore.tattoos.filter(el => el.uuid === tattooUuid)[0];
        if (activeTattoo.value.status !== 'CLOSE') {
            goToTatto(activeTattoo.value.uuid);
        } else {
            const customer = await getCustomerByUuid(activeTattoo.value.customerUuid);
            activeTattoo.value.customer = customer;
        }
    } catch (error) {
        router.push('/tattoos');
    }
    uiStore.loading = false;
}

const goBackToTattoosList = () => {
    activeTattoo.value = null;
    router.push('/tattoos');
}

const startDeletion = () => {
    activeDelete.value = !activeDelete.value;
    if (activeDelete.value) {
        showTab.value = 3;
    }
    else {
        showTab.value = 0;
    }
}

</script>
<style scoped>
.green {
    background-color: rgb(148, 255, 148);
}

.active-delete {
    animation: shake-loop 0.3s ease-in-out infinite;
    border: 1px solid red;
}

@keyframes shake-loop {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-1px);
    }

    50% {
        transform: translateX(1px);
    }

    75% {
        transform: translateX(-1px);
    }

    100% {
        transform: translateX(0);
    }
}
</style>