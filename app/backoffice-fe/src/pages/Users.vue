<template>
    <div class="users-page mx-auto w-full items-start overflow-y-auto hide-scrollbar">
        <router-link to="/createuser">
            <Button class="w-full h-12 mb-4">
                <Plus /> Crea nuovo utente
            </Button>
        </router-link>
        <SearchBar v-model="searchUuid" @search="performSearch" />
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
                            <span v-if="user.role === 'admin'" class="inline-block text-xs font-semibold bg-blue-100 text-blue-700 rounded px-1.5 py-0.5 mb-1">Admin</span>
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
                        <ArrowLeft @click="goBackToUsersList" class="hover:cursor-pointer mr-2" />
                    </div>
                    <div class="flex flex-col pb-6">
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
                            <form
                                class="mb-4 bg-white rounded-xl w-full p-4 min-w-0 flex flex-col gap-3"
                                @submit.prevent="saveContacts"
                            >
                                <p class="font-bold mb-1">Contatti</p>
                                <label class="user-edit-label" for="edit-user-email">Email</label>
                                <Input
                                    id="edit-user-email"
                                    v-model="editContacts.email"
                                    class="bg-white"
                                    type="email"
                                    required
                                />
                                <label class="user-edit-label" for="edit-user-phone">Telefono</label>
                                <Input
                                    id="edit-user-phone"
                                    v-model="editContacts.phone"
                                    class="bg-white"
                                    type="tel"
                                    inputmode="tel"
                                />
                                <Button type="submit" class="h-10 w-full" :disabled="savingContacts">
                                    {{ savingContacts ? 'Salvataggio...' : 'Salva contatti' }}
                                </Button>
                            </form>
                            <form
                                v-if="selectedUser.role !== 'admin'"
                                class="mb-4 bg-white rounded-xl w-full p-4 min-w-0 flex flex-col gap-3"
                                @submit.prevent="saveAddress"
                            >
                                <p class="font-bold mb-1">Indirizzo</p>
                                <label class="user-edit-label" for="edit-user-country">Paese</label>
                                <Input
                                    id="edit-user-country"
                                    v-model="editAddress.country"
                                    class="bg-white"
                                    type="text"
                                />
                                <label class="user-edit-label" for="edit-user-city">Città</label>
                                <Input
                                    id="edit-user-city"
                                    v-model="editAddress.city"
                                    class="bg-white"
                                    type="text"
                                    pattern="[A-Za-zÀ-ÖØ-öø-ÿ''\s]+"
                                    title="Città (es. Milano, L'Aquila)"
                                />
                                <label class="user-edit-label" for="edit-user-cap">CAP</label>
                                <Input
                                    id="edit-user-cap"
                                    v-model="editAddress.cap"
                                    class="bg-white"
                                    type="text"
                                />
                                <label class="user-edit-label" for="edit-user-province">Provincia</label>
                                <Input
                                    id="edit-user-province"
                                    v-model="editAddress.province"
                                    class="bg-white"
                                    type="text"
                                />
                                <label class="user-edit-label" for="edit-user-address">Indirizzo</label>
                                <Input
                                    id="edit-user-address"
                                    v-model="editAddress.address"
                                    class="bg-white"
                                    type="text"
                                    pattern="[A-Za-zÀ-ÖØ-öø-ÿ''0-9\s,.\-\/]+"
                                    title="Indirizzo (es. Via Roma 5, Via L'Aquila)"
                                />
                                <Button type="submit" class="h-10 w-full" :disabled="savingAddress">
                                    {{ savingAddress ? 'Salvataggio...' : 'Salva indirizzo' }}
                                </Button>
                            </form>
                            <form
                                v-if="selectedUser.role !== 'admin'"
                                class="mb-4 bg-white rounded-xl w-full p-4 min-w-0 flex flex-col gap-3"
                                @submit.prevent="saveCompany"
                            >
                                <p class="font-bold mb-1">Dati azienda</p>
                                <label class="user-edit-label" for="edit-user-legal-form">Forma giuridica</label>
                                <Input
                                    id="edit-user-legal-form"
                                    v-model="editCompany.legalForm"
                                    class="bg-white"
                                    type="text"
                                />
                                <label class="user-edit-label" for="edit-user-business-name">Ragione sociale</label>
                                <Input
                                    id="edit-user-business-name"
                                    v-model="editCompany.businessName"
                                    class="bg-white"
                                    type="text"
                                />
                                <label class="user-edit-label" for="edit-user-piva">Partita IVA</label>
                                <Input
                                    id="edit-user-piva"
                                    v-model="editCompany.piva"
                                    class="bg-white"
                                    type="text"
                                    maxlength="11"
                                />
                                <label class="user-edit-label" for="edit-user-cf">Codice fiscale</label>
                                <Input
                                    id="edit-user-cf"
                                    v-model="editCompany.cf"
                                    class="bg-white"
                                    type="text"
                                    maxlength="16"
                                />
                                <label class="user-edit-label" for="edit-user-fe-pec">Codice destinatario FE</label>
                                <Input
                                    id="edit-user-fe-pec"
                                    v-model="editCompany.fePecAddress"
                                    class="bg-white"
                                    type="text"
                                />
                                <label class="user-edit-label" for="edit-user-pec-mail">Indirizzo PEC FE</label>
                                <Input
                                    id="edit-user-pec-mail"
                                    v-model="editCompany.pecMail"
                                    class="bg-white"
                                    type="email"
                                />
                                <label class="user-edit-label" for="edit-user-tax-code">Codice tributo</label>
                                <Input
                                    id="edit-user-tax-code"
                                    v-model="editCompany.taxCode"
                                    class="bg-white"
                                    type="text"
                                />
                                <Button type="submit" class="h-10 w-full" :disabled="savingCompany">
                                    {{ savingCompany ? 'Salvataggio...' : 'Salva dati azienda' }}
                                </Button>
                            </form>
                            <form
                                class="mb-4 bg-white rounded-xl w-full p-4 min-w-0 flex flex-col gap-3"
                                @submit.prevent="savePassword"
                            >
                                <p class="font-bold mb-1">Credenziali</p>
                                <label class="user-edit-label" for="edit-user-password">Nuova password</label>
                                <PasswordInput
                                    id="edit-user-password"
                                    v-model="editPassword.password"
                                    class="bg-white"
                                    autocomplete="new-password"
                                    minlength="8"
                                    required
                                />
                                <label class="user-edit-label" for="edit-user-password-confirm">Conferma password</label>
                                <PasswordInput
                                    id="edit-user-password-confirm"
                                    v-model="editPassword.confirm"
                                    class="bg-white"
                                    autocomplete="new-password"
                                    minlength="8"
                                    required
                                />
                                <Button type="submit" class="h-10 w-full" :disabled="savingPassword">
                                    {{ savingPassword ? 'Salvataggio...' : 'Aggiorna password' }}
                                </Button>
                            </form>
                            <div v-if="selectedUser.role !== 'admin'" class="mb-4 bg-white rounded-xl w-full p-4 min-w-0 flex flex-col gap-3 border border-red-200">
                                <p class="font-bold text-red-600">Elimina utente</p>
                                <p class="text-sm text-gray-600">
                                    L'operazione è irreversibile. Le etichette associate verranno scollegate;
                                    non è possibile eliminare utenti con tatuaggi registrati.
                                </p>
                                <template v-if="!showDeleteConfirm">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        class="h-10 w-full"
                                        :disabled="deletingUser"
                                        @click="showDeleteConfirm = true"
                                    >
                                        <Trash2 />
                                        Elimina utente
                                    </Button>
                                </template>
                                <template v-else>
                                    <p class="text-sm font-medium">
                                        Confermi l'eliminazione di
                                        <span class="font-bold">{{ selectedUser.businessName || selectedUser.email }}</span>?
                                    </p>
                                    <div class="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            class="h-10 flex-1"
                                            :disabled="deletingUser"
                                            @click="showDeleteConfirm = false"
                                        >
                                            Annulla
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            class="h-10 flex-1"
                                            :disabled="deletingUser"
                                            @click="confirmDeleteUser"
                                        >
                                            {{ deletingUser ? 'Eliminazione...' : 'Conferma eliminazione' }}
                                        </Button>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <section v-if="selectedUser.role !== 'admin'" class="mb-4 bg-white rounded-xl w-full p-4 min-w-0">
                            <p class="font-bold text-xl mb-4">
                                Etichette associate
                                <span v-if="labelsTotal > 0" class="text-sm font-normal text-gray-500">
                                    ({{ labelsTotal }})
                                </span>
                            </p>
                            <div class="flex flex-wrap items-center gap-2 p-2 mb-4 rounded-md bg-slate-200">
                                <Button @click="setLabelsFilter('all')" type="button"
                                    class="text-xs w-fit h-8 bg-transparent text-black"
                                    :class="labelsFilter === 'all' ? 'bg-white!' : ''">
                                    Tutte
                                </Button>
                                <Button @click="setLabelsFilter('available')" type="button"
                                    class="text-xs w-fit h-8 bg-transparent text-black"
                                    :class="labelsFilter === 'available' ? 'bg-white!' : ''">
                                    Disponibili
                                </Button>
                                <Button @click="setLabelsFilter('burned')" type="button"
                                    class="text-xs w-fit h-8 bg-transparent text-black"
                                    :class="labelsFilter === 'burned' ? 'bg-white!' : ''">
                                    Bruciate
                                </Button>
                            </div>
                            <p
                                v-if="!labelsLoading && userLabels.length === 0"
                                class="text-sm text-gray-600"
                            >
                                {{ labelsFilterEmptyMessage }}
                            </p>
                            <template v-else>
                                <div
                                    v-for="ink in userLabels"
                                    :key="ink.uuid"
                                    class="flex justify-between items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md w-auto h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                                    @click="onLabelClick(ink)"
                                >
                                    <div class="flex items-center justify-start gap-2 min-w-0">
                                        <Eye
                                            v-if="isCompletedTattooLabel(ink)"
                                            :size="20"
                                            class="shrink-0"
                                        />
                                        <Copy
                                            v-else
                                            :size="20"
                                            class="shrink-0"
                                        />
                                        <div class="min-w-0">
                                            <p class="text-sm break-all">{{ ink.uuid }}</p>
                                            <p class="text-xs text-gray-400 mt-0.5">
                                                Lotto: {{ ink.batchId }}
                                            </p>
                                            <p
                                                v-if="ink.burningDate"
                                                class="text-xs text-gray-500 mt-1"
                                            >
                                                Bruciata il {{ formatLabelDate(ink.burningDate) }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="shrink-0 ml-2">
                                        <div
                                            class="w-3 h-3 rounded-full mb-2 mr-4"
                                            :class="labelStatusDotClass(ink)"
                                        />
                                    </div>
                                </div>
                                <div ref="labelsLoadMoreSentinel" class="h-1 shrink-0" aria-hidden="true" />
                                <p
                                    v-if="labelsLoading && userLabels.length"
                                    class="text-center text-sm text-gray-500 py-3"
                                >
                                    Caricamento...
                                </p>
                                <p
                                    v-else-if="!labelsHasMore && userLabels.length"
                                    class="text-center text-xs text-gray-400 py-3"
                                >
                                    Fine elenco ({{ labelsTotal }} etichette)
                                </p>
                            </template>
                            <p
                                v-if="labelsLoading && !userLabels.length"
                                class="text-center text-sm text-gray-500 py-6"
                            >
                                Caricamento...
                            </p>
                        </section>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import {
    getAllUsers,
    getUserByUuid,
    updateUser,
    updateUserPassword,
    deleteUser,
} from '@/services/api.user.service';
import {
    Plus,
    BookMarked,
    Mail,
    ArrowLeft,
    Copy,
    Eye,
    Building2,
    Hash,
    Calendar,
    Trash2,
} from 'lucide-vue-next';
import { useUiStore } from '@/stores/ui';
import { useUsersStore } from '@/stores/users.store';
import Input from '@shared/components/ui/input/Input.vue';
import PasswordInput from '@shared/components/PasswordInput.vue';
import Button from '@shared/components/ui/button/Button.vue';
import SearchBar from '@/components/SearchBar.vue';
import { getLabelsByUserPage } from '@/services/api.label.service';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useUniversalSearch, getUuidPrefix, UUID_REGEX } from '@/composables/useUniversalSearch';

const uiStore = useUiStore();
const usersStore = useUsersStore();
const route = useRoute();
const transitionDirection = ref('next');
const { navigateByUuid } = useUniversalSearch();

const showTab = ref(0)

const searchUuid = ref('');
const selectedUser = ref<any>(null);
const selectedUserUuid = ref('');
const labelsFilter = ref<'all' | 'available' | 'burned'>('all');
const userLabels = ref<any[]>([]);
const labelsPage = ref(0);
const labelsHasMore = ref(true);
const labelsLoading = ref(false);
const labelsTotal = ref(0);
const labelsLoadMoreSentinel = ref<HTMLElement | null>(null);
let labelsLoadMoreObserver: IntersectionObserver | null = null;

const LABELS_PAGE_SIZE = 20;

const labelsFilterToApi = (): 'all' | 'available' | 'used' => {
    if (labelsFilter.value === 'available') return 'available';
    if (labelsFilter.value === 'burned') return 'used';
    return 'all';
};

const labelsFilterEmptyMessage = computed(() => {
    if (labelsFilter.value === 'available') return 'Nessuna etichetta disponibile';
    if (labelsFilter.value === 'burned') return 'Nessuna etichetta bruciata';
    return 'Nessuna etichetta associata';
});

const skipRouteWatch = ref(true);

const editContacts = ref({ email: '', phone: '' });
const editAddress = ref({
    country: '',
    city: '',
    cap: '',
    province: '',
    address: '',
});
const editCompany = ref({
    legalForm: '',
    businessName: '',
    piva: '',
    cf: '',
    fePecAddress: '',
    pecMail: '',
    taxCode: '',
});
const editPassword = ref({ password: '', confirm: '' });
const savingContacts = ref(false);
const savingAddress = ref(false);
const savingCompany = ref(false);
const savingPassword = ref(false);
const showDeleteConfirm = ref(false);
const deletingUser = ref(false);

const getRouteUserUuid = (): string => {
    const userUuid = route.params.userUuid;
    return typeof userUuid === 'string' ? userUuid : '';
};

const performSearch = (uuid: string) => {
    uuid = uuid.replace(/\s+/g, '');
    if (!UUID_REGEX.test(uuid)) return;

    const prefix = getUuidPrefix(uuid);

    // cross-page navigation for non-user UUIDs
    if (prefix && prefix !== 'usr') {
        navigateByUuid(uuid);
        return;
    }

    const user = usersStore.allUsers.find(el => el.uuid === uuid);
    if (user) showUser(user.uuid);
};

watch(searchUuid, (newVal) => {
    performSearch(newVal);
});

onMounted(async () => {
    uiStore.title = "Utenti";
    uiStore.loading = true;
    let allUsers = await getAllUsers();
    usersStore.allUsers = allUsers.sort((a: any, b: any) => b.id - a.id);
    await syncFromRoute();
    skipRouteWatch.value = false;
    uiStore.loading = false;
});

onBeforeUnmount(() => {
    labelsLoadMoreObserver?.disconnect();
    usersStore.userUuid = "";
});

const setupLabelsLoadMoreObserver = () => {
    labelsLoadMoreObserver?.disconnect();
    if (!labelsLoadMoreSentinel.value) return;

    labelsLoadMoreObserver = new IntersectionObserver(
        (entries) => {
            if (
                entries[0]?.isIntersecting &&
                selectedUserUuid.value &&
                labelsHasMore.value &&
                !labelsLoading.value
            ) {
                loadUserLabels(false);
            }
        },
        { root: null, rootMargin: '120px', threshold: 0 },
    );
    labelsLoadMoreObserver.observe(labelsLoadMoreSentinel.value);
};

const loadUserLabels = async (reset = false) => {
    if (!selectedUserUuid.value || labelsLoading.value) return;
    if (!reset && !labelsHasMore.value) return;

    if (reset) {
        userLabels.value = [];
        labelsPage.value = 0;
        labelsHasMore.value = true;
        labelsTotal.value = 0;
    }

    const nextPage = reset ? 1 : labelsPage.value + 1;
    labelsLoading.value = true;
    try {
        const res = await getLabelsByUserPage(selectedUserUuid.value, {
            page: nextPage,
            limit: LABELS_PAGE_SIZE,
            filter: labelsFilterToApi(),
        });
        if (reset) {
            userLabels.value = res.items;
        } else {
            const existing = new Set(userLabels.value.map((label) => label.uuid));
            for (const item of res.items) {
                if (!existing.has(item.uuid)) {
                    userLabels.value.push(item);
                }
            }
        }
        labelsPage.value = res.page;
        labelsTotal.value = res.total;
        labelsHasMore.value = res.hasMore;
    } finally {
        labelsLoading.value = false;
        await nextTick();
        setupLabelsLoadMoreObserver();
    }
};

const setLabelsFilter = async (filter: 'all' | 'available' | 'burned') => {
    if (labelsFilter.value === filter) return;
    labelsFilter.value = filter;
    await loadUserLabels(true);
};

watch(labelsLoadMoreSentinel, () => {
    if (selectedUserUuid.value) {
        setupLabelsLoadMoreObserver();
    }
});

watch(
    () => route.params.userUuid as string | undefined,
    async (userUuid, previousUuid) => {
        if (skipRouteWatch.value || userUuid === previousUuid) return;
        if (userUuid && selectedUserUuid.value === userUuid) return;
        await syncFromRoute();
    },
);

const clearUserDetail = () => {
    usersStore.userUuid = '';
    selectedUser.value = null;
    selectedUserUuid.value = '';
    userLabels.value = [];
    labelsTotal.value = 0;
    labelsLoadMoreObserver?.disconnect();
    resetEditForms();
};

const resetEditForms = () => {
    editContacts.value = { email: '', phone: '' };
    editAddress.value = {
        country: '',
        city: '',
        cap: '',
        province: '',
        address: '',
    };
    editCompany.value = {
        legalForm: '',
        businessName: '',
        piva: '',
        cf: '',
        fePecAddress: '',
        pecMail: '',
        taxCode: '',
    };
    editPassword.value = { password: '', confirm: '' };
    showDeleteConfirm.value = false;
};

const syncEditFormsFromUser = (user: Record<string, string | null | undefined>) => {
    editContacts.value = {
        email: user.email ?? '',
        phone: user.phone ?? '',
    };
    editAddress.value = {
        country: user.country ?? '',
        city: user.city ?? '',
        cap: user.cap ?? '',
        province: user.province ?? '',
        address: user.address ?? '',
    };
    editCompany.value = {
        legalForm: user.legalForm ?? '',
        businessName: user.businessName ?? '',
        piva: user.piva ?? '',
        cf: user.cf ?? '',
        fePecAddress: user.fePecAddress ?? '',
        pecMail: user.pecMail ?? '',
        taxCode: user.taxCode ?? '',
    };
    editPassword.value = { password: '', confirm: '' };
    showDeleteConfirm.value = false;
};

const applyUserUpdate = (updatedUser: any) => {
    selectedUser.value = updatedUser;
    usersStore.allUsers = usersStore.allUsers.map((user: { uuid: string }) =>
        user.uuid === updatedUser.uuid ? updatedUser : user,
    );
    syncEditFormsFromUser(updatedUser);
};

const openUserDetail = async (uuid: string) => {
    transitionDirection.value = 'next';
    usersStore.userUuid = uuid;

    let user = usersStore.allUsers.find((el: { uuid: string }) => el.uuid === uuid);
    if (!user) {
        try {
            user = await getUserByUuid(uuid);
            if (user.role === 'admin') {
                throw new Error('admin user');
            }
            usersStore.allUsers = [user, ...usersStore.allUsers].sort(
                (a: { id: number }, b: { id: number }) => b.id - a.id,
            );
        } catch {
            uiStore.setToast('Utente non trovato', 'error');
            await router.replace('/users');
            clearUserDetail();
            return;
        }
    }

    selectedUser.value = user;
    selectedUserUuid.value = user.uuid;
    syncEditFormsFromUser(user);
    labelsFilter.value = 'all';
    await loadUserLabels(true);
};

const saveContacts = async () => {
    if (!selectedUserUuid.value || savingContacts.value) return;
    savingContacts.value = true;
    try {
        const updatedUser = await updateUser(selectedUserUuid.value, {
            email: editContacts.value.email,
            phone: editContacts.value.phone,
        });
        applyUserUpdate(updatedUser);
        uiStore.setToast('Contatti aggiornati');
    } catch {
        uiStore.setToast('Errore durante il salvataggio dei contatti', 'error');
    } finally {
        savingContacts.value = false;
    }
};

const saveAddress = async () => {
    if (!selectedUserUuid.value || savingAddress.value) return;
    savingAddress.value = true;
    try {
        const updatedUser = await updateUser(selectedUserUuid.value, { ...editAddress.value });
        applyUserUpdate(updatedUser);
        uiStore.setToast('Indirizzo aggiornato');
    } catch {
        uiStore.setToast('Errore durante il salvataggio dell\'indirizzo', 'error');
    } finally {
        savingAddress.value = false;
    }
};

const saveCompany = async () => {
    if (!selectedUserUuid.value || savingCompany.value) return;
    savingCompany.value = true;
    try {
        const updatedUser = await updateUser(selectedUserUuid.value, { ...editCompany.value });
        applyUserUpdate(updatedUser);
        uiStore.setToast('Dati azienda aggiornati');
    } catch {
        uiStore.setToast('Errore durante il salvataggio dei dati azienda', 'error');
    } finally {
        savingCompany.value = false;
    }
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
    const message = (error as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
    if (Array.isArray(message)) return message[0] ?? fallback;
    if (typeof message === 'string' && message.length) return message;
    return fallback;
};

const confirmDeleteUser = async () => {
    if (!selectedUserUuid.value || deletingUser.value) return;
    deletingUser.value = true;
    try {
        await deleteUser(selectedUserUuid.value);
        usersStore.allUsers = usersStore.allUsers.filter(
            (user: { uuid: string }) => user.uuid !== selectedUserUuid.value,
        );
        uiStore.setToast('Utente eliminato');
        await router.push('/users');
        clearUserDetail();
    } catch (error) {
        uiStore.setToast(
            getApiErrorMessage(error, 'Errore durante l\'eliminazione dell\'utente'),
            'error',
        );
    } finally {
        deletingUser.value = false;
        showDeleteConfirm.value = false;
    }
};

const savePassword = async () => {
    if (!selectedUserUuid.value || savingPassword.value) return;
    if (editPassword.value.password !== editPassword.value.confirm) {
        uiStore.setToast('Le password non coincidono', 'error');
        return;
    }
    if (editPassword.value.password.length < 8) {
        uiStore.setToast('La password deve avere almeno 8 caratteri', 'error');
        return;
    }
    savingPassword.value = true;
    try {
        await updateUserPassword(selectedUserUuid.value, editPassword.value.password);
        editPassword.value = { password: '', confirm: '' };
        uiStore.setToast('Password aggiornata');
    } catch {
        uiStore.setToast('Errore durante l\'aggiornamento della password', 'error');
    } finally {
        savingPassword.value = false;
    }
};

const syncFromRoute = async () => {
    const userUuid = getRouteUserUuid();
    if (!userUuid) {
        clearUserDetail();
        return;
    }
    await openUserDetail(userUuid);
};

const showUser = (uuid: string) => {
    router.push(`/users/${uuid}`);
};

const goBackToUsersList = () => {
    router.push('/users');
};

const formatLabelDate = (value?: string | null) => {
    if (!value) return '—';
    return String(value).split('T')[0];
};

const isBurnedLabel = (ink: { burningDate?: string | null }) => !!ink.burningDate;

const isCompletedTattooLabel = (ink: {
    burningDate?: string | null;
    tattooStatus?: string | null;
    tattooUuid?: string | null;
}) => isBurnedLabel(ink) && ink.tattooStatus === 'CLOSE' && !!ink.tattooUuid;

const labelStatusDotClass = (ink: { burningDate?: string | null }) =>
    isBurnedLabel(ink) ? 'bg-red-500' : 'bg-green-500';

const onLabelClick = (ink: {
    uuid: string;
    burningDate?: string | null;
    tattooStatus?: string | null;
    tattooUuid?: string | null;
}) => {
    if (isCompletedTattooLabel(ink) && ink.tattooUuid) {
        router.push(`/users/${selectedUserUuid.value}/tattoos/${ink.tattooUuid}`);
        return;
    }
    copyUuidToClipboard(ink.uuid);
};

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

.users-page .user-edit-label {
    font-size: 12px;
    color: inherit;
}
</style>