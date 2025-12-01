<template>
    <div v-if="!creatingLabelsStore.inkTypeUuid" class="w-full flex justify-center items-center h-full">
        <div class="w-full flex justify-center items-center h-full" v-if="warehouse.length">
            <inkTypeSelector @submit="addAmount" v-for="inkType in warehouse" :ink-type="inkType">Crea etichette
            </inkTypeSelector>
        </div>
        <div v-else class="w-full flex justify-center items-center h-full">
            <h1>Nessun inchiostro disponibile per creazione etichette</h1>
        </div>
    </div>
    <div v-else class="flex flex-col justify-center items-center w-full h-full">
        <p class="text-xl font-bold text-left mb-4">Associa le etichette a uno studio</p>
        <div class="mx-auto w-full items-start overflow-y-auto h-1/2" v-if="usersStore.allUsers.length">
            <div @click="addUser(user.uuid)" :class="`${usersStore.userUuid === user.uuid ? 'h-80! items-start' : ''}`"
                class="flex justify-start items-center mx-4 shadow-2xl p-4 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
                v-for="user in usersStore.allUsers">
                <p class="font-bold text-2xl pr-4 w-16 text-center">{{ user.id }}</p>
                <div class="border-l-1 border-black pl-4">
                    <p class="font-bold">{{ user.email }}</p>
                    <p>{{ new Date(user.createdAt).toDateString() }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { getInkTypes, getInksByType, getAvailableInksByType } from "@/services/api.ink.service";
import { getAllUsers } from '@/services/api.user.service';
import { createLabels } from '@/services/api.label.service';
import { useUiStore } from '@/stores/ui';
import { useCreatingLabelsStore } from '@/stores/creatingLabels';
import { useUsersStore } from '@/stores/users.store';
import inkTypeSelector from '@/components/inkTypeSelector.vue';
import router from '@/router';

const uiStore = useUiStore();
const creatingLabelsStore = useCreatingLabelsStore();
const usersStore = useUsersStore();
const warehouse = ref([]);

onMounted(async () => {
    uiStore.title = "Crea etichette";
    uiStore.loading = true;
    creatingLabelsStore.resetCreatingLabels();
    const inkTypes = await getInkTypes();
    for (let i = 0; i < inkTypes.length; i++) {
        const availableAmount = await getAvailableInksByType(inkTypes[i].uuid);
        if (availableAmount.length) warehouse.value[i] = {
            ...inkTypes[i],
            amount: availableAmount.length
        }
    }
    uiStore.loading = false;
});

const addAmount = async (data: {
    inkTypeUuid: string,
    amount: number,
}) => {
    creatingLabelsStore.initLabelsCreation(data);
    if (!usersStore.allUsers.length) {
        const allUsers = await getAllUsers();
        usersStore.allUsers = allUsers.sort((a: any, b: any) => b.id - a.id);
    }
}

const addUser = async (userUuid: string) => {
    creatingLabelsStore.userUuid = userUuid;
    const labels = await create();
}

const create = async () => {
    try {
        uiStore.loading = true;
        const res = await createLabels({
            userUuid: creatingLabelsStore.userUuid,
            inkTypeUuid: creatingLabelsStore.inkTypeUuid,
            amount: creatingLabelsStore.amount,
        });
        router.push(`labels/${res}`);
    } catch (error) {
        alert(error.message);
        uiStore.loading = false;
    }
}

</script>