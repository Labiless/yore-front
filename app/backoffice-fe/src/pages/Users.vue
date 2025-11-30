<template>
    <div class="mx-auto pt-48  mb-4 flex px-4 w-full">
        <router-link to="createUser">
            <Button>
                <Plus /> Crea Nuovo utente
            </Button>
        </router-link>
    </div>
    <div class="mx-auto flex pt-8 px-4 w-full">
        <h1 class="font-bold text-lg">Utenti</h1>
    </div>
    <div class="p-4 flex justify-start items-center">
        <Input v-model="searchUuid" class="w-1/3 shadow-xl" type="text" />
        <Search class="ml-2" />
    </div>
    <div class="mx-auto w-full items-start overflow-y-auto h-1/2" v-if="usersStore.allUsers.length">
        <div @click="showUser(user.uuid)" :class="`${usersStore.userUuid === user.uuid ? 'h-80! items-start' : ''}`"
            class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="user in usersStore.allUsers">
            <p class="font-bold text-2xl pr-4 w-16 text-center">{{ user.id }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">{{ user.email }}</p>
                <p>{{ new Date(user.createdAt).toDateString() }}</p>
            </div>
        </div>
    </div>
    <div v-else>
        <h1>Nessun lotto creato</h1>
    </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue';
import { getAllUsers, getUserByUuid } from "@/services/api.user.service";
import { Search, Plus } from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { useUsersStore } from '@/stores/users.store';
import Input from '@shared/components/ui/input/input.vue';
import Button from '@shared/components/ui/button/button.vue';

const uiStore = useUiStore();
const usersStore = useUsersStore();
const transitionDirection = ref('next');

const searchUuid = ref('');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUuid = (uuid: string) => {
    return uuidRegex.test(uuid);
}

watch(searchUuid, async (newSearchUuid, oldSearchUuid) => {

})

onMounted(async () => {
    uiStore.title = "Utenti";
    uiStore.loading = true;
    if (!usersStore.allUsers.length) {
        const allUsers = await getAllUsers();
        usersStore.allUsers = allUsers.sort((a: any, b: any) => b.id - a.id);
    }
    uiStore.loading = false;
});

const showUser = async (uuid: string) => {
    transitionDirection.value = 'next';
    usersStore.userUuid = uuid;
}

</script>

<style scoped></style>