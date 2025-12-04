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
    <div v-else class="flex flex-col justify-center items-start w-full h-full">
        <p class="text-xl font-bold text-left mb-4">Associa le etichette a uno studio</p>
        <div class="w-full flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:p-6"
            @click="addUser(user.uuid)" :class="`${''}`" v-for="user in usersStore.allUsers">
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
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { getInkTypes, getInksByType, getAvailableInksByType } from "@/services/api.ink.service";
import { getAllUsers } from '@/services/api.user.service';
import { createLabels } from '@/services/api.label.service';
import { useUiStore } from '@/stores/ui';
import { useCreatingLabelsStore } from '@/stores/creatingLabels';
import { useUsersStore } from '@/stores/users.store';
import { User, Mail, BookMarked } from 'lucide-vue-next';
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
        usersStore.allUsers = allUsers.filter(el => el.role !== 'admin').sort((a: any, b: any) => b.id - a.id);
    }
}

const addUser = async (userUuid: string) => {
    creatingLabelsStore.userUuid = userUuid;
    const labels = await create();
}

const create = async () => {
    uiStore.loading = true;
    try {
        const res = await createLabels({
            userUuid: creatingLabelsStore.userUuid,
            inkTypeUuid: creatingLabelsStore.inkTypeUuid,
            amount: creatingLabelsStore.amount,
        });
        router.push(`labels/${res}`);
        uiStore.setToast("Etichette cerate correttamente");
    } catch (error) {
        uiStore.setToast('Errore nella creazione etichette', 'error')
        uiStore.loading = false;
    }
}

</script>