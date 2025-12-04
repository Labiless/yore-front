<template>


    <div class="mx-auto mt-20 w-full items-start overflow-y-auto h-full" v-if="inks.length">
        <Button class="w-full h-12 mb-4">
            <Plus /> Carica Inchiostro
        </Button>
        <!--<div @click="activeInk = ink.uuid" :class="`${ink.uuid === activeInk ? 'h-80! items-start' : ''}`"
            class="flex justify-start items-center shadow-2xl p-2 bg-white mb-4 rounded-2xl w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
            v-for="ink in inks">
            <p class="font-bold text-2xl pr-4 w-16 text-center">{{ ink.id }}</p>
            <div class="border-l-1 border-black pl-4">
                <p class="font-bold">{{ ink.uuid }}</p>
                <p>{{ new Date(ink.createdAt).toDateString() }}</p>
            </div>
        </div>-->
        <p class="flex text-xl font-bold items-center mb-4">Magazzino
            <droplet class="" />
        </p>
        <div class="flex items-center gap-2 p-2 my-4 mx-auto rounded-md bg-slate-200">
            <Button @click="showTab = 0" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 0 ? 'bg-white!' : 'shadow-none'}`">Disponibili</Button>
            <Button @click="showTab = 1" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 1 ? 'bg-white!' : 'shadow-none'}`">Utlizizzati</Button>
        </div>
        <div v-if="showTab === 0"
            class="flex justify-start items-center shadow-md p-2 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103">
            <p class="text-2xl mx-2 font-bold">x{{ availableInks.length }}</p>
            <div class="flex items-center border-l-1 border-black ml-2">
                <droplet class="m-2" />
                <p class="font-bold">{{ inkTypes[0].name }} - {{ inkTypes[0].color }}</p>
            </div>
        </div>
        <div v-else>
            <div @click="selectedink = selectedink === ink.uuid ? '' : ink.uuid"
                class="flex justify-start items-center shadow-md p-2 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all hover:scale-103"
                v-for="ink in usedInks">
                <droplet class="m-2" />
                <div class="w-full">
                    <div class="flex justify-between w-full">
                        <div>
                            <p class="font-bold">{{ inkTypes[0].name }} - {{ inkTypes[0].color }}</p>
                            <p class="text-xs text-gray-500">{{ ink.uuid}}</p>
                            <p class="text-xs text-gray-500">utilizzatato il: {{ ink.burningDate.split("T")[0] }}</p>
                        </div>
                        <router-link to="tattoos">
                            <SquareArrowOutUpRight />
                        </router-link>
                    </div>
                    <div v-if="selectedink === ink.uuid">
                        <p class="text-xs">{{ ink.uuid }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/button.vue';
import { useUiStore } from '@/stores/ui';
import { onMounted, ref } from 'vue';
import { Droplet, Plus, SquareArrowOutUpRight } from 'lucide-vue-next';
import { apiLabelService, inkLabelService } from '@/services/api.inks.service';
import { userUserStore } from '@/stores/user.store';

const uiStore = useUiStore();
const userStore = userUserStore();
const inks = ref([]);
const usedInks = ref([]);
const availableInks = ref([]);
const inkTypes = ref([]);
const selectedink = ref('');

const showTab = ref(0)

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = "Inchiostri";
    inkTypes.value = await inkLabelService.getInkTypes();
    inks.value = await apiLabelService.getLabelsByUser(userStore.getUiid);
    availableInks.value = inks.value.filter(el => el.tattooUuid === null)
    usedInks.value = inks.value.filter(el => el.tattooUuid)
    uiStore.loading = false;
});

</script>
<style></style>