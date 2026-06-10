<template>
    <div v-if="!creatingLabelsStore.inkTypeUuid" class="w-full flex flex-col md:flex-row justify-center h-full">
        <div class="w-full flex justify-center items-center h-full" v-if="warehouseStore.warehouse.length">
            <inkTypeSelector @submit="addAmount" v-for="inkType in warehouseStore.warehouse" :key="inkType.uuid"
                :ink-type="inkType">Crea etichette
            </inkTypeSelector>
        </div>
        <div v-else class="w-full flex justify-center items-center min-h-full">
            <h1>Nessun inchiostro disponibile per creazione etichette</h1>
        </div>
    </div>
    <div v-else class="w-full h-full">
        <div class="flex justify-between items-center mb-4 gap-2">
            <ArrowLeft @click="creatingLabelsStore.resetCreatingLabels()" class="shrink-0 cursor-pointer" />
            <p class="text-xl font-bold text-left flex-1">Associa le etichette a uno studio (opzionale)</p>
        </div>
        <Button type="button" class="w-full h-12 mb-4" @click="createWithoutUser">
            Crea senza associare
        </Button>
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

import { onMounted } from 'vue';
import { getAllUsers } from '@/services/api.user.service';
import { createLabels } from '@/services/api.label.service';
import { useUiStore } from '@/stores/ui';
import { useCreatingLabelsStore } from '@/stores/creatingLabels';
import { useUsersStore } from '@/stores/users.store';
import { useWharehouseStore } from '@/stores/warehouse.store';
import { User, Mail, BookMarked, ArrowLeft } from 'lucide-vue-next';
import inkTypeSelector from '@/components/inkTypeSelector.vue';
import Button from '@shared/components/ui/button/Button.vue';
import router from '@/router';

const uiStore = useUiStore();
const creatingLabelsStore = useCreatingLabelsStore();
const usersStore = useUsersStore();
const warehouseStore = useWharehouseStore();

onMounted(async () => {
    uiStore.title = "Crea etichette";
    uiStore.loading = true;
    creatingLabelsStore.resetCreatingLabels();
    await warehouseStore.refreshWarehouse();
    uiStore.loading = false;
});

const addAmount = async (data: {
    inkTypeUuid: string,
    amount: number,
}) => {
    creatingLabelsStore.initLabelsCreation(data);
    if (!usersStore.allUsers.length) {
        const allUsers = await getAllUsers();
        usersStore.allUsers = allUsers.filter((el: { role?: string }) => el.role !== 'admin').sort((a: any, b: any) => b.id - a.id);
    }
}

const addUser = async (userUuid: string) => {
    creatingLabelsStore.userUuid = userUuid;
    uiStore.setPopoup(
        'Sei sicuro di voler creare le etichette per questo studio?',
        async () => {
            await create(userUuid);
        }
    );
}

const createWithoutUser = () => {
    uiStore.setPopoup(
        'Creare le etichette senza associarle a uno studio?',
        async () => {
            await create();
        }
    );
}

const create = async (userUuid?: string) => {
    uiStore.loading = true;
    try {
        const payload: {
            inkTypeUuid: string;
            amount: number;
            userUuid?: string;
        } = {
            inkTypeUuid: creatingLabelsStore.inkTypeUuid,
            amount: creatingLabelsStore.amount,
        };
        if (userUuid) {
            payload.userUuid = userUuid;
        }
        const batchId = await createLabels(payload);
        creatingLabelsStore.resetCreatingLabels();
        await warehouseStore.refreshWarehouse();
        router.push(`/labels/${batchId}`);
        uiStore.setToast("Etichette create correttamente");
        uiStore.loading = false;
    } catch (error) {
        creatingLabelsStore.resetCreatingLabels();
        uiStore.setToast('Errore nella creazione etichette', 'error');
        uiStore.loading = false;
    }
}

</script>