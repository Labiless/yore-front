<template>
    <div class="users-page mx-auto w-full items-start overflow-y-auto h-full px-4">
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
                        <div class="pl-4 flex-1 min-w-0">
                            <p v-if="user.businessName" class="flex items-start gap-2 text-md font-bold">
                                <Building2 class="size-4 shrink-0 mt-0.5" />
                                <span class="user-field break-words min-w-0">{{ user.businessName }}</span>
                            </p>
                            <p v-if="user.piva" class="flex items-start gap-2 text-xs mt-1">
                                <BookMarked class="size-4 shrink-0 mt-0.5 opacity-70" />
                                <span class="user-field break-words min-w-0">{{ user.piva }}</span>
                            </p>
                            <p v-if="user.email" class="flex items-start gap-2 text-xs mt-1">
                                <Mail class="size-4 shrink-0 mt-0.5 opacity-70" />
                                <span class="user-field break-words min-w-0" x-apple-data-detectors="false">{{ user.email }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="items-center mb-4 gap-2">
                        <ArrowLeft @click="usersStore.userUuid = '';" class="hover:cursor-pointer mr-2" />
                    </div>
                    <div class="flex flex-col overflow-y-scroll h-[60vh] hide-scrollbar pb-24">
                        <div class="mb-4 bg-white rounded-xl w-full p-4 flex flex-col gap-3 min-w-0">
                            <div v-if="selectedUser.businessName" class="user-info-row">
                                <Building2 class="user-info-icon" />
                                <span class="user-field text-xl font-bold">{{ selectedUser.businessName }}</span>
                            </div>
                            <div v-if="selectedUser.uuid" class="user-info-row">
                                <Hash class="user-info-icon opacity-60" />
                                <span class="user-field text-xs opacity-60">{{ selectedUser.uuid }}</span>
                            </div>
                            <div v-if="selectedUser.createdAt" class="user-info-row">
                                <Calendar class="user-info-icon opacity-60" />
                                <span class="user-field text-xs opacity-60">{{ selectedUser.createdAt.split('T')[0] }}</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap w-full gap-2 h-fit min-w-0">
                            <div class="mb-4 bg-white rounded-xl w-full p-4 min-w-0">
                                <p class="font-bold mb-2">Contatti</p>
                                <div v-if="selectedUser.email" class="user-info-row">
                                    <Mail class="user-info-icon" />
                                    <span class="user-field" x-apple-data-detectors="false">{{ selectedUser.email }}</span>
                                </div>
                                <div v-if="selectedUser.phone" class="user-info-row">
                                    <Phone class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.phone }}</span>
                                </div>
                            </div>
                            <div class="mb-4 bg-white rounded-xl w-full p-4 min-w-0">
                                <p class="font-bold mb-2">Indirizzo</p>
                                <div v-if="selectedUser.country" class="user-info-row">
                                    <Globe class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.country }}</span>
                                </div>
                                <div v-if="selectedUser.city" class="user-info-row">
                                    <MapPin class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.city }}</span>
                                </div>
                                <div v-if="selectedUser.cap" class="user-info-row">
                                    <Mailbox class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.cap }}</span>
                                </div>
                                <div v-if="selectedUser.province" class="user-info-row">
                                    <MapPinned class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.province }}</span>
                                </div>
                                <div v-if="selectedUser.address" class="user-info-row">
                                    <Home class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.address }}</span>
                                </div>
                            </div>
                            <div class="mb-4 bg-white rounded-xl w-full p-4 min-w-0">
                                <p class="font-bold mb-2">Dati azienda</p>
                                <div v-if="selectedUser.legalForm" class="user-info-row">
                                    <Scale class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.legalForm }}</span>
                                </div>
                                <div v-if="selectedUser.piva" class="user-info-row">
                                    <BookMarked class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.piva }}</span>
                                </div>
                                <div v-if="selectedUser.cf" class="user-info-row">
                                    <IdCard class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.cf }}</span>
                                </div>
                                <div v-if="selectedUser.fePecAddress" class="user-info-row">
                                    <Inbox class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.fePecAddress }}</span>
                                </div>
                                <div v-if="selectedUser.pecMail" class="user-info-row">
                                    <AtSign class="user-info-icon" />
                                    <span class="user-field" x-apple-data-detectors="false">{{ selectedUser.pecMail }}</span>
                                </div>
                                <div v-if="selectedUser.taxCode" class="user-info-row">
                                    <FileText class="user-info-icon" />
                                    <span class="user-field">{{ selectedUser.taxCode }}</span>
                                </div>
                            </div>
                        </div>
                        <Accordion type="single" collapsible class="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger class="no-underline hover:no-underline">
                                    <p class="font-bold text-xl">Etichette associate</p>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div class="mb-4 rounded-xl w-full">
                                        <p v-if="!selectedUser.inks.length">Nessuna etichetta associata</p>
                                        <template v-else>
                                            <div class="flex flex-wrap items-center gap-2 p-2 mb-4 rounded-md bg-slate-200">
                                                <Button @click="labelsFilter = 'all'" type="button"
                                                    class="text-xs w-fit h-8 bg-transparent text-black"
                                                    :class="labelsFilter === 'all' ? 'bg-white!' : ''">
                                                    Tutte
                                                </Button>
                                                <Button @click="labelsFilter = 'available'" type="button"
                                                    class="text-xs w-fit h-8 bg-transparent text-black"
                                                    :class="labelsFilter === 'available' ? 'bg-white!' : ''">
                                                    Disponibili
                                                </Button>
                                                <Button @click="labelsFilter = 'burned'" type="button"
                                                    class="text-xs w-fit h-8 bg-transparent text-black"
                                                    :class="labelsFilter === 'burned' ? 'bg-white!' : ''">
                                                    Bruciate
                                                </Button>
                                            </div>
                                            <p v-if="filteredLabels.length === 0" class="text-sm text-gray-600">
                                                {{ labelsFilterEmptyMessage }}
                                            </p>
                                            <div v-else @click="copyUuidToClipboard(ink.uuid)"
                                                class="flex justify-between items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                                                v-for="ink in filteredLabels"
                                                :key="ink.uuid">
                                                <div class="flex items-center justify-start gap-2">
                                                    <Copy :size="20" />
                                                    <p class="text-sm">{{ ink.uuid }}</p>
                                                </div>
                                                <div>
                                                    <div class="w-3 h-3 rounded-full mb-2 mr-4 bg-green-500"
                                                        :class="`${ink.burningDate ? 'bg-red-500!' : ''}`"></div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger class="no-underline hover:no-underline">
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

import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { getAllUsers, getUserByUuid } from "@/services/api.user.service";
import {
    Search,
    Plus,
    BookMarked,
    Mail,
    ArrowLeft,
    Copy,
    Building2,
    Hash,
    Calendar,
    Phone,
    Globe,
    MapPin,
    Mailbox,
    MapPinned,
    Home,
    Scale,
    IdCard,
    Inbox,
    AtSign,
    FileText,
} from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { useUsersStore } from '@/stores/users.store';
import Input from '@shared/components/ui/input/Input.vue';
import Button from '@shared/components/ui/button/Button.vue';
import { getLabelsByUser } from '@/services/api.label.service';
import { tattooService } from '@/services/api.tattoo.service'
import router from '@/router';
import { useRoute } from 'vue-router';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@shared/components/ui/accordion'

const uiStore = useUiStore();
const usersStore = useUsersStore();
const route = useRoute();
const transitionDirection = ref('next');

const showTab = ref(0)

const searchUuid = ref('');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const selectedUser = ref<any>(null);
const labelsFilter = ref<'all' | 'available' | 'burned'>('all');

const filteredLabels = computed(() => {
    const labels = selectedUser.value?.inks ?? [];
    if (labelsFilter.value === 'available') {
        return labels.filter((label: { burningDate?: string | null }) => !label.burningDate);
    }
    if (labelsFilter.value === 'burned') {
        return labels.filter((label: { burningDate?: string | null }) => !!label.burningDate);
    }
    return labels;
});

const labelsFilterEmptyMessage = computed(() => {
    if (labelsFilter.value === 'available') return 'Nessuna etichetta disponibile';
    if (labelsFilter.value === 'burned') return 'Nessuna etichetta bruciata';
    return 'Nessuna etichetta associata';
});

const userUuid = typeof route.params.userUuid === 'string' ? route.params.userUuid : '';

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
    allUsers = allUsers.filter((el: { role?: string }) => el.role !== 'admin');
    usersStore.allUsers = allUsers.sort((a: any, b: any) => b.id - a.id);
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
    transitionDirection.value = 'next';
    usersStore.userUuid = uuid;
    const user = usersStore.allUsers.find((el: { uuid: string }) => el.uuid === uuid);
    if (!user) return;
    selectedUser.value = user;
    labelsFilter.value = 'all';
    const inks = await getLabelsByUser(user.uuid);
    const tattoos = await tattooService.getTattoosByUserUuid(user.uuid);
    selectedUser.value.tattoos = tattoos.filter((el: string) => el !== '');
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

<style scoped>
.users-page .user-field {
    text-decoration: none;
    color: inherit;
    cursor: default;
}

.users-page :deep([data-slot="accordion-trigger"]) {
    text-decoration: none !important;
}

.users-page :deep([data-slot="accordion-trigger"]:hover) {
    text-decoration: none !important;
}

/* Evita che email/PEC vengano stilizzate come link dal browser */
.users-page .user-field {
    -webkit-text-decoration: none;
    text-decoration-skip-ink: none;
    flex: 1;
    min-width: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
}

.users-page .user-info-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.25rem 0;
    min-width: 0;
}

.users-page .user-info-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: rgb(75 85 99);
}
</style>