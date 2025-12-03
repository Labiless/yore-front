<template>
    <div class="mx-auto mt-30 w-full items-start overflow-y-auto h-full">
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
                    <div class="flex items-center mb-4">
                        <ArrowLeft @click="usersStore.userUuid = '';" class="hover:cursor-pointer mr-2" />
                    </div>
                    <div>
                        <div class="mb-4">
                            <p class="text-xl font-bold flex items-center mb-2">
                                <User /> {{ selectedUser.businessName }}
                            </p>
                            <p class="text-xs opacity-60">{{ selectedUser.uuid }}</p>
                            <p class="text-xs opacity-60">{{ selectedUser.createdAt.split('T')[0] }}</p>
                        </div>
                        <div class="mb-4">
                            <p class="font-bold">Contatti</p>
                            <p>{{ selectedUser.email }}</p>
                            <p>{{ selectedUser.phone }}</p>
                        </div>
                        <div class="mb-4">
                            <p class="font-bold">Indirizzo</p>
                            <p>{{ selectedUser.country }}</p>
                            <p>{{ selectedUser.city }}</p>
                            <p>{{ selectedUser.cap }}</p>
                            <p>{{ selectedUser.province }}</p>
                            <p>{{ selectedUser.address }}</p>
                        </div>
                        <div class="mb-4">
                            <p class="font-bold">Dati azienda</p>
                            <p>{{ selectedUser.legalForm }}</p>
                            <p>{{ selectedUser.piva }}</p>
                            <p>{{ selectedUser.cf }}</p>
                            <p>{{ selectedUser.fePecAddress }}</p>
                            <p>{{ selectedUser.pecMail }}</p>
                            <p>{{ selectedUser.taxCode }}</p>
                        </div>
                        <div class="mb-4">
                            <p class="font-bold">Etichette associate</p>
                            <p v-if="selectedUser.inks.length === 0">Nessun inchiostro associato</p>
                            <p v-for="ink in selectedUser.inks">{{ ink }}</p>
                        </div>
                        <div class="mb-4">
                            <p class="font-bold">Tatuaggi</p>
                            <p v-if="selectedUser.tattoos.length === 0">Nessun tatuaggio effettuato</p>
                            <p v-for="tattoo in selectedUser.tattoos">{{ tattoo }}</p>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue';
import { getAllUsers, getUserByUuid } from "@/services/api.user.service";
import { Search, Plus, BookMarked, User, Mail, ArrowLeft, MapPinHouse } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { useUsersStore } from '@/stores/users.store';
import Input from '@shared/components/ui/input/input.vue';
import Button from '@shared/components/ui/button/button.vue';
import { all } from 'axios';

const uiStore = useUiStore();
const usersStore = useUsersStore();
const transitionDirection = ref('next');

const showTab = ref(0)

const searchUuid = ref('');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const selectedUser = ref(null);


const isValidUuid = (uuid: string) => {
    return uuidRegex.test(uuid);
}

watch(searchUuid, async (newSearchUuid, oldSearchUuid) => {
    newSearchUuid = newSearchUuid.replace(/\s+/g, '');
    if (isValidUuid(newSearchUuid)) {
        const user = usersStore.allUsers.filter(el => el.uuid === newSearchUuid)[0];
        if(user){
            showUser(user.uuid)
        }
    }
})

onMounted(async () => {
    uiStore.title = "Utenti";
    uiStore.loading = true;
    if (!usersStore.allUsers.length) {
        let allUsers = await getAllUsers();
        allUsers = allUsers.filter(el => el.role !== 'admin');
        usersStore.allUsers = allUsers.sort((a: any, b: any) => b.id - a.id);
        console.log(usersStore.allUsers);
    }
    uiStore.loading = false;
});

const showUser = async (uuid: string) => {
    transitionDirection.value = 'next';
    usersStore.userUuid = uuid;
    selectedUser.value = usersStore.allUsers.filter(el => el.uuid === uuid)[0]
    console.log(selectedUser.value);
}

</script>

<style scoped></style>