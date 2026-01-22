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
                        class="flex justify-start items-center shadow-md p-2 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
                        :class="`${activeDelete && isDeletable(tattoo.status) ? 'active-delete' : ''}`"
                        v-for="tattoo in tattoosStore.tattoos">
                        <img v-if="tattoo.photoUrl" :src="tattoo.photoUrl"
                            class="w-[30px] h-[30px] rounded-full "></img>
                        <div v-else :src="tattoo.photoUrl" class="w-[30px] h-[30px] rounded-full bg-gray-500"></div>
                        <div class="pl-4 flex justify-between items-center w-11/12">
                            <div>
                                <p class="capitalize -mb-1 text-md font-bold"><span class="font-medium text-xs">#{{
                                    tattoo.id }}</span> {{ tattoo.customer.name }} {{ tattoo.customer.surname }}</p>
                                <p class="flex items-center text-xs -translate-x-1 opacity-60">
                                    <Calendar class="scale-50" />{{ tattoo.creationDate.split("T")[0] }}
                                </p>
                            </div>
                            <div class="w-3 h-3 rounded-full mb-2 mr-4" :class="`${getStatusColor(tattoo.status)}`">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="overflow-y-scroll hide-scrollbar h-[60vh]">
                    <div class="flex items-center mb-4">
                        <ArrowLeft @click="goBackToTattoosList" class="hover:cursor-pointer mr-2" />
                    </div>
                    <div class="flex gap-2 mb-4">
                        <a :href="activeTattoo.contractUrl" target="_blank">
                            <Button class="text-xs">Scarica contratto</Button>
                        </a>
                        <a :href="activeTattoo.releaseFormUrl" target="_blank">
                            <Button class="text-xs">Scarica release form</Button>
                        </a>
                    </div>
                    <div>
                        <div class="mb-4">
                            <p class="text-xl font-bold flex items-center mb-2 capitalize">
                                <User /> {{ activeTattoo.customer.name }} {{ activeTattoo.customer.surname }}
                            </p>
                            <p class="text-xs">{{ activeTattoo.creationDate.split('T')[0] }}</p>
                            <p class="text-xs opacity-60">{{ activeTattoo.uuid }}</p>
                        </div>
                        <img :src="activeTattoo.photoUrl" class="w-1/2 border-2 mb-4" />
                        <div class="mb-4">
                            <p class="font-bold">Caratteristiche del tatuaggio</p>
                            <p class="">color: {{ activeTattoo.color }}</p>
                            <p class="">inkAmount: {{ activeTattoo.inkAmount }}</p>
                            <p class="">inkLayers: {{ activeTattoo.inkLayers }}</p>
                            <p class="">position: {{ activeTattoo.position }}</p>
                            <p class="">scars: {{ activeTattoo.scars }}</p>
                            <p class="">skinType: {{ activeTattoo.skinType }}</p>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import { Calendar, Plus, Trash, ArrowLeft } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { useTatoosStore } from '@/stores/tattoos.store';
import { deleteTattoo, getTattoosByUserUuid } from '@/services/api.tattoo.service';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import Button from '@shared/components/ui/button/Button.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { getCustomerByUuid } from '@/services/api.customer.service';
import { userUserStore } from '@/stores/user.store';

const showTab = ref(0)
const uiStore = useUiStore();
const tattoosStore = useTatoosStore();
const createTattooStore = useCreateTattoStore();
const userStore = userUserStore();
const activeTattoo = ref(null) as null | undefined | any;
const activeDelete = ref(false);
const route = useRoute();

const tattoUrlRegex = /^\/tattoos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

watch(
    () => route.fullPath,
    (newPath, oldPath) => {
        if(newPath === '/tattoos') activeTattoo.value = null;
        if(getTattooUuidFromUrl() && activeTattoo.value === null){
            showClosedTattoo(getTattooUuidFromUrl());
        } 
    }
)

const getTattooUuidFromUrl = () : string => router.resolve().params.tattooUuid;

const showIfStatus = (status: string) => {
    if (showTab.value === 0) return true;
    if (showTab.value === 1) return status === 'CLOSE';
    if (showTab.value === 2) return status !== 'CLOSE';
    if (showTab.value === 3) return status !== 'CLOSE' && status !== 'PROGRESS';
}

const isDeletable = (status: string) => {
    return status !== 'CLOSE' && status !== 'PROGRESS';
}

const getStatusColor = (status: string) => {
    if (status === 'CLOSE') return "bg-green-500";
    return "bg-orange-500"
}

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Tatuaggi";
    if (tattoosStore.tattoos.length === 0) {
        const res = await getTattoosByUserUuid(userStore.getUiid);
        tattoosStore.tattoos = res.sort((a: any, b: any) => b.id - a.id);
    }
    if (getTattooUuidFromUrl()) {
        await showClosedTattoo(getTattooUuidFromUrl());
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
        //activeDelete.value = false;
        //showTab.value = 0;
        uiStore.loading = false;
        uiStore.setToast('Tatuaggio eliminato');
    });
}

const goToTatto = (tattooUuid: string) => {
    createTattooStore.uuid = tattooUuid;
    router.push('createtattoo');
}

const showClosedTattoo = async (tattooUuid: string) => {
    uiStore.loading = true;
    activeTattoo.value = tattoosStore.tattoos.filter(el => el.uuid === tattooUuid)[0];
    const customer = await getCustomerByUuid(activeTattoo.value.customerUuid);
    activeTattoo.value.customer = customer;
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