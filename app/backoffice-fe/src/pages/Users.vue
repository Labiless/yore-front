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
                        <ArrowLeft @click="goBackToUsersList" class="hover:cursor-pointer mr-2" />
                    </div>
                    <div
                        ref="userDetailScrollRef"
                        class="flex flex-col overflow-y-scroll h-[60vh] hide-scrollbar pb-24"
                    >
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
                        <section class="mb-4 bg-white rounded-xl w-full p-4 min-w-0">
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
import { getAllUsers, getUserByUuid } from "@/services/api.user.service";
import {
    Search,
    Plus,
    BookMarked,
    Mail,
    ArrowLeft,
    Copy,
    Eye,
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
import { getLabelsByUserPage } from '@/services/api.label.service';
import router from '@/router';
import { useRoute } from 'vue-router';

const uiStore = useUiStore();
const usersStore = useUsersStore();
const route = useRoute();
const transitionDirection = ref('next');

const showTab = ref(0)

const searchUuid = ref('');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const selectedUser = ref<any>(null);
const selectedUserUuid = ref('');
const labelsFilter = ref<'all' | 'available' | 'burned'>('all');
const userLabels = ref<any[]>([]);
const labelsPage = ref(0);
const labelsHasMore = ref(true);
const labelsLoading = ref(false);
const labelsTotal = ref(0);
const userDetailScrollRef = ref<HTMLElement | null>(null);
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

const getRouteUserUuid = (): string => {
    const userUuid = route.params.userUuid;
    return typeof userUuid === 'string' ? userUuid : '';
};

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
    let allUsers = await getAllUsers();
    allUsers = allUsers.filter((el: { role?: string }) => el.role !== 'admin');
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
        {
            root: userDetailScrollRef.value,
            rootMargin: '120px',
            threshold: 0,
        },
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
    labelsFilter.value = 'all';
    await loadUserLabels(true);
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
</style>