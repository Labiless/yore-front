<template>
    <div class="mx-auto w-full items-start overflow-y-auto h-full px-4">
        <router-link to="/createuser">
            <Button class="w-full h-12 mb-4">
                <Plus /> Crea nuovo utente
            </Button>
        </router-link>
        <div class="flex justify-start items-center">
            <Input v-model="searchUuid" class="w-1/3 shadow-xl" type="text" />
            <Search class="ml-2" />
        </div>
        <div class="flex items-center gap-2 p-2 my-4 mx-auto rounded-md bg-slate-200">
            <Button @click="showTab = 0" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 0 ? 'bg-white!' : 'shadow-none'}`">Tutti gli utenti</Button>
        </div>

        <div v-show="showTab === 0">
            <Transition>
                <div v-if="!usersStore.userUuid">
                    <div class="w-full flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
                        @click="showUser(user.uuid)" :class="`${''}`" v-for="user in usersStore.allUsers">
                        <p class="font-bold text-md">{{ user.id }}</p>
                        <div class="pl-4 items-center w-11/12">
                            <p class="flex items-center text-md font-bold" v-if="user.businessName">
                                <User class="scale-50" />{{ user.businessName }}
                            </p>
                            <div class="flex">
                                <p class="flex items-center text-xs" v-if="user.email">
                                    <BookMarked class="scale-50" />{{ user.piva }}
                                </p>
                                <p class="flex items-center text-xs" v-if="user.email">
                                    <Mail class="scale-50" />{{ user.email }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="items-center mb-4 gap-2">
                        <ArrowLeft @click="usersStore.userUuid = '';" class="hover:cursor-pointer mr-2" />
                    </div>
                    <div class="flex flex-col overflow-y-scroll h-[60vh] hide-scrollbar pb-24">
                        <div class="mb-4 bg-white rounded-xl w-full p-4 flex gap-2 h-fit">
                            <p class="text-xl font-bold flex items-center mb-2">
                                <User /> {{ selectedUser.businessName }}
                            </p>
                            <div class="border-l-1 border-black pl-2">
                                <p class="text-xs opacity-60">{{ selectedUser.uuid }}</p>
                                <p class="text-xs opacity-60">{{ selectedUser.createdAt.split('T')[0] }}</p>
                            </div>
                        </div>
                        <div class="flex flex-wrap w-full gap-2 h-fit">
                            <div class="mb-4 bg-white rounded-xl w-full p-4">
                                <p class="font-bold">Contatti</p>
                                <p>{{ selectedUser.email }}</p>
                                <p>{{ selectedUser.phone }}</p>
                            </div>
                            <div class="mb-4 bg-white rounded-xl w-full p-4">
                                <p class="font-bold">Indirizzo</p>
                                <p>{{ selectedUser.country }}</p>
                                <p>{{ selectedUser.city }}</p>
                                <p>{{ selectedUser.cap }}</p>
                                <p>{{ selectedUser.province }}</p>
                                <p>{{ selectedUser.address }}</p>
                            </div>
                            <div class="mb-4 bg-white rounded-xl w-full p-4">
                                <p class="font-bold">Dati azienda</p>
                                <p>{{ selectedUser.legalForm }}</p>
                                <p>{{ selectedUser.piva }}</p>
                                <p>{{ selectedUser.cf }}</p>
                                <p>{{ selectedUser.fePecAddress }}</p>
                                <p>{{ selectedUser.pecMail }}</p>
                                <p>{{ selectedUser.taxCode }}</p>
                            </div>
                        </div>
                        <Accordion type="single" collapsible class="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    <p class="font-bold text-xl">Etichette associate</p>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div class="mb-4 rounded-xl w-full">
                                        <p v-if="selectedUser.inks.length === 0">Nessun inchiostro associato</p>
                                        <div v-else>
                                            <div @click="copyUuidToClipboard(ink.uuid)"
                                                class="flex justify-between items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                                                :class="`${''}`" v-for="ink in selectedUser.inks">
                                                <div class="flex items-center justify-start gap-2">
                                                    <Copy :size="20" />
                                                    <p class="text-sm">{{ ink.uuid }}</p>
                                                </div>
                                                <div>
                                                    <div class="w-3 h-3 rounded-full mb-2 mr-4 bg-green-500"
                                                        :class="`${ink.burningDate ? 'bg-red-500!' : ''}`"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    <p class="font-bold text-xl">Tatuaggi</p>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div class="mb-4 rounded-xl w-full">
                                        <p v-if="selectedUser.tattoos.length === 0">Nessun tatuaggio effettuato</p>
                                        <div v-else>
                                            <div class="flex justify-between items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                                                :class="`${''}`" v-for="tattoo in selectedUser.tattoos">
                                                <p class="text-sm">{{ tattoo.uuid }}</p>
                                                <div>
                                                    <div class="w-3 h-3 rounded-full mb-2 mr-4 bg-orange-500"
                                                        :class="`${tattoo.customerSign ? 'bg-green-500!' : ''}`"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { getAllUsers, getUserByUuid } from "@/services/api.user.service";
import { Search, Plus, BookMarked, User, Mail, ArrowLeft, MapPinHouse, Copy } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { useUsersStore } from '@/stores/users.store';
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import { getLabelsByUser } from '@/services/api.label.service';
import { tattooService } from '@/services/api.tattoo.service'
import router from '@/router';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@shared/components/ui/accordion'

const uiStore = useUiStore();
const usersStore = useUsersStore();
const transitionDirection = ref('next');

const showTab = ref(0)

const searchUuid = ref('');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const selectedUser = ref(null);

const userUuid = (() => {
    try {
        return router.resolve().params.userUuid as string;
    } catch {
        return '';
    }
})()

const isValidUuid = (uuid: string) => {
    return uuidRegex.test(uuid);
}

watch(searchUuid, async (newSearchUuid, oldSearchUuid) => {
    newSearchUuid = newSearchUuid.replace(/\s+/g, '');
    if (isValidUuid(newSearchUuid)) {
        const user = usersStore.allUsers.filter(el => el.uuid === newSearchUuid)[0];
        if (user) {
            showUser(user.uuid)
        }
    }
})

onMounted(async () => {
    uiStore.title = "Utenti";
    uiStore.loading = true;
    //if (!usersStore.allUsers.length) {
    let allUsers = await getAllUsers();
    allUsers = allUsers.filter(el => el.role !== 'admin');
    usersStore.allUsers = allUsers.sort((a: any, b: any) => b.id - a.id);
    console.log(usersStore.allUsers);
    //}
    if (userUuid) {
        await showUser(userUuid);
    }
    uiStore.loading = false;
});

onBeforeUnmount(() => {
    usersStore.userUuid = "";
});

const showUser = async (uuid: string) => {
    console.log(uuid);
    transitionDirection.value = 'next';
    usersStore.userUuid = uuid;
    selectedUser.value = usersStore.allUsers.filter(el => el.uuid === uuid)[0];
    const inks = await getLabelsByUser(selectedUser.value.uuid);
    const tattoos = await tattooService.getTattoosByUserUuid(selectedUser.value.uuid);
    selectedUser.value.tattoos = tattoos.filter(el => el !== '');
    selectedUser.value.inks = inks;
}

const copyUuidToClipboard = async (uuid: string) => {
    try {
        await navigator.clipboard.writeText(uuid);
        uiStore.setToast('UUID copiato negli appunti');
    } catch (error) {
        uiStore.setToast('Errore durante la copia dell\'UUID', 'error');
    }
}

</script>

<style scoped></style>