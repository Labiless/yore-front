<template>
    <div class="mx-auto w-full items-start overflow-y-auto hide-scrollbar pb-24">
        <router-link to="/createtattoo" @click="createTattooStore.resetTattoo">
            <Button class="w-full h-12 mb-4">
                <Plus />Nuovo tatuaggio
            </Button>
        </router-link>

        <div class="flex items-center gap-2 p-2 my-4 w-fit max-w-full mx-auto rounded-md bg-slate-200">
            <Button @click="showTab = 0" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 0 ? 'bg-white!' : 'shadow-none'}`">Tutti</Button>
            <Button @click="showTab = 1" class="text-xs w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 1 ? 'bg-white!' : 'shadow-none'}`">
                <p class="w-3 h-3 rounded-full bg-green-500"></p>
            </Button>
            <Button @click="showTab = 2" class="text-xs text-center w-fit h-8 bg-transparent text-black"
                :class="`${showTab === 2 ? 'bg-white!' : 'shadow-none'}`">
                <p class="w-3 h-3 rounded-full bg-orange-500"></p>
            </Button>
            <Button @click="startDeletion" class="text-xs text-center w-fit h-8 bg-transparent text-black"
                :class="`${activeDelete ? 'bg-red-500! text-white' : 'shadow-none'}`">
                <Trash />
            </Button>
        </div>
        <Transition>
            <div v-if="!activeTattoo" class="flex flex-col gap-3">
                <div
                    v-for="tattoo in tattoosStore.tattoos"
                    :key="tattoo.uuid"
                    @click="onclickTattoo(tattoo)"
                    class="flex items-start gap-3 shadow-md p-2 pl-4 pr-3 bg-white rounded-md w-full h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                    :class="`${activeDelete && isDeletable(tattoo.status) ? 'active-delete' : ''}`"
                >
                        <div class="shrink-0 w-[30px] h-[30px] mt-0.5">
                            <img v-if="listTattooThumb(tattoo.photoUrl)" :src="listTattooThumb(tattoo.photoUrl)"
                                class="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full object-cover"
                                alt="" />
                            <div v-else class="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-gray-500"></div>
                        </div>
                        <div class="flex-1 min-w-0 flex gap-2 py-0.5">
                            <div class="flex flex-col items-center gap-1.5 shrink-0 w-7 pt-0.5">
                                <span class="text-xs font-medium text-gray-700">#{{ tattoo.id }}</span>
                                <Calendar class="size-3.5 shrink-0 opacity-60" />
                                <Droplet v-if="hasAssociatedInk(tattoo)" class="size-3.5 shrink-0 text-gray-600" />
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col gap-1">
                                <div class="flex items-start gap-2">
                                    <p class="flex-1 min-w-0 capitalize text-md font-bold leading-tight truncate">
                                        {{ tattoo.customerName }}
                                    </p>
                                    <div class="w-3 h-3 rounded-full shrink-0 mt-1" :class="getStatusColor(tattoo)"></div>
                                </div>
                                <p class="text-xs opacity-60">{{ tattoo.creationDate.split("T")[0] }}</p>
                                <p v-if="hasAssociatedInk(tattoo)"
                                    class="text-xs text-gray-600 truncate leading-snug"
                                    :title="associatedInkIds(tattoo)">
                                    {{ associatedInkIds(tattoo) }}
                                </p>
                            </div>
                        </div>
                    </div>
                <div ref="loadMoreSentinel" class="h-1 shrink-0" aria-hidden="true" />
                <p
                    v-if="tattoosStore.tattoosListLoading && tattoosStore.tattoos.length"
                    class="text-center text-sm text-gray-500 py-3"
                >
                    Caricamento...
                </p>
                <p
                    v-else-if="!tattoosStore.tattoosHasMore && tattoosStore.tattoos.length"
                    class="text-center text-xs text-gray-400 py-3"
                >
                    Fine elenco ({{ tattoosStore.tattoosTotal }} tatuaggi)
                </p>
                <p
                    v-else-if="!tattoosStore.tattoosListLoading && !tattoosStore.tattoos.length"
                    class="text-center text-sm text-gray-500 py-6"
                >
                    Nessun tatuaggio in questa categoria
                </p>
            </div>
            <div v-else class="flex flex-col gap-4">
                <button
                    type="button"
                    class="flex items-center gap-2 text-sm font-medium text-gray-700 w-fit"
                    @click="goBackToTattoosList"
                >
                    <ArrowLeft class="size-5 shrink-0" />
                    Torna all'elenco
                </button>

                <div v-if="tattooDocuments.length" class="mb-4">
                    <p class="text-sm font-semibold text-gray-700 mb-2">Documenti</p>
                    <ul class="flex flex-col gap-2">
                        <li v-for="doc in tattooDocuments" :key="doc.label">
                            <a
                                :href="doc.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block"
                            >
                                <Button
                                    type="button"
                                    class="w-full h-11 justify-start px-4 text-sm font-normal bg-white text-black border border-gray-200 shadow-sm hover:bg-blue-50"
                                >
                                    <Award
                                        v-if="doc.type === 'certificate'"
                                        class="size-4 mr-2 shrink-0"
                                    />
                                    <FileSignature
                                        v-else
                                        class="size-4 mr-2 shrink-0"
                                    />
                                    {{ doc.label }}
                                </Button>
                            </a>
                        </li>
                    </ul>
                </div>

                <section class="bg-white rounded-xl shadow-md p-4">
                    <p class="text-xs font-medium text-green-700 mb-2">Tatuaggio completato</p>
                    <h2 class="text-xl font-bold capitalize flex items-center gap-2 leading-tight">
                        <User class="size-5 shrink-0" />
                        {{ activeTattoo.customerName }}
                    </h2>
                    <p class="text-sm text-gray-600 mt-2">
                        Completato il {{ formatDisplayDate(activeTattoo.creationDate) }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">ID pratica #{{ activeTattoo.id }}</p>
                </section>

                <section
                    v-if="hasCustomerDetails"
                    class="bg-white rounded-xl shadow-md p-4"
                >
                    <h3 class="text-sm font-bold mb-3">Dati tatuato</h3>
                    <dl class="grid gap-3 text-sm">
                        <div v-if="activeCustomer?.email" class="detail-row">
                            <dt class="detail-label">
                                <Mail class="size-4 shrink-0" />
                                Email
                            </dt>
                            <dd class="detail-value">{{ activeCustomer.email }}</dd>
                        </div>
                        <div v-if="activeCustomer?.cf" class="detail-row">
                            <dt class="detail-label">
                                <IdCard class="size-4 shrink-0" />
                                Codice fiscale
                            </dt>
                            <dd class="detail-value uppercase">{{ activeCustomer.cf }}</dd>
                        </div>
                        <div v-if="activeCustomer?.birthDate" class="detail-row">
                            <dt class="detail-label">
                                <Calendar class="size-4 shrink-0" />
                                Data di nascita
                            </dt>
                            <dd class="detail-value">{{ formatDisplayDate(activeCustomer.birthDate) }}</dd>
                        </div>
                    </dl>
                </section>

                <section
                    v-if="tattooPhotos.before || tattooPhotos.after"
                    class="bg-white rounded-xl shadow-md p-4"
                >
                    <h3 class="text-sm font-bold mb-3">Foto del tatuaggio</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div v-if="tattooPhotos.before">
                            <p class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Prima</p>
                            <button
                                type="button"
                                class="block w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                                @click="openPhotoPreview(tattooPhotos.before, 'Prima del tatuaggio')"
                            >
                                <img
                                    :key="`before-${activeTattoo.uuid}-${tattooPhotos.before}`"
                                    :src="tattooPhotos.before"
                                    class="w-full aspect-[3/4] object-cover"
                                    alt="Prima del tatuaggio"
                                />
                            </button>
                        </div>
                        <div v-if="tattooPhotos.after">
                            <p class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Dopo</p>
                            <button
                                type="button"
                                class="block w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                                @click="openPhotoPreview(tattooPhotos.after, 'Dopo il tatuaggio')"
                            >
                                <img
                                    :key="`after-${activeTattoo.uuid}-${tattooPhotos.after}`"
                                    :src="tattooPhotos.after"
                                    class="w-full aspect-[3/4] object-cover"
                                    alt="Dopo il tatuaggio"
                                />
                            </button>
                        </div>
                    </div>
                </section>

                <section class="bg-white rounded-xl shadow-md p-4 mb-2">
                    <h3 class="text-sm font-bold mb-3">Caratteristiche del tatuaggio</h3>
                    <dl class="grid gap-3 text-sm">
                        <div class="detail-row">
                            <dt class="detail-label">Colore</dt>
                            <dd class="detail-value">{{ inkColorLabel }}</dd>
                        </div>
                        <div class="detail-row">
                            <dt class="detail-label">Stile</dt>
                            <dd class="detail-value">{{ activeTattoo.tattooStyle ?? '—' }}</dd>
                        </div>
                        <div class="detail-row">
                            <dt class="detail-label">Tipo</dt>
                            <dd class="detail-value">{{ tattooTypeLabel }}</dd>
                        </div>
                        <div class="detail-row">
                            <dt class="detail-label">Posizione</dt>
                            <dd class="detail-value">{{ tattooPositionLabel }}</dd>
                        </div>
                        <div class="detail-row">
                            <dt class="detail-label">Tipo di pelle</dt>
                            <dd class="detail-value">{{ tattooSkinTypeLabel }}</dd>
                        </div>
                    </dl>
                </section>

                <div
                    v-if="photoPreview"
                    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
                    @click.self="closePhotoPreview"
                >
                    <p class="text-white text-sm font-semibold mb-3">{{ photoPreview.label }}</p>
                    <img
                        :src="photoPreview.url"
                        :alt="photoPreview.label"
                        class="max-w-full max-h-[75vh] rounded-lg object-contain shadow-2xl"
                    />
                    <button
                        type="button"
                        class="mt-4 text-white text-sm"
                        @click="closePhotoPreview"
                    >
                        Chiudi
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>
<script setup lang="ts">

import { useUiStore } from '@/stores/ui';
import {
    Award,
    Calendar,
    FileSignature,
    Plus,
    Trash,
    ArrowLeft,
    Droplet,
    User,
    Mail,
    IdCard,
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useTatoosStore } from '@/stores/tattoos.store';
import { deleteTattoo, getTattoByUuid } from '@/services/api.tattoo.service';
import type { TattooListFilter } from '@/types/tattoos-page';
import {
    syncTattooPhotos,
    INK_COLOR_LABELS,
    TATTOO_TYPE_LABELS,
    formatDisplayDate,
    skinTypeLabel,
    positionLabel,
} from '@/constants/tattoo.config';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import Button from '@shared/components/ui/button/Button.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { getCustomerByUuid } from '@/services/api.customer.service';
import { useUserStore } from '@/stores/user.store';

const showTab = ref(0)
const uiStore = useUiStore();
const tattoosStore = useTatoosStore();
const createTattooStore = useCreateTattoStore();
const userStore = useUserStore();
const activeTattoo = ref<any>(null);
const photoPreview = ref<{ url: string; label: string } | null>(null);
const activeDelete = ref(false);
const route = useRoute();
const loadMoreSentinel = ref<HTMLElement | null>(null);
let loadMoreObserver: IntersectionObserver | null = null;

const tabToFilter = (tab: number): TattooListFilter => {
    if (tab === 1) return 'close';
    if (tab === 2) return 'active';
    if (tab === 3) return 'deletable';
    return 'all';
};

const loadTattoos = async (reset = false) => {
    await tattoosStore.fetchTattoosPage(userStore.getUiid, {
        reset,
        filter: tabToFilter(showTab.value),
    });
};

const tattooPhotos = computed(() =>
    activeTattoo.value ? syncTattooPhotos(activeTattoo.value.photoUrl) : {},
);

const tattooDocuments = computed(() => {
    const tattoo = activeTattoo.value;
    if (!tattoo) return [];

    return [
        {
            label: 'Certificato di tatuaggio',
            url: tattoo.certificateUrl,
            type: 'certificate' as const,
        },
        {
            label: 'Consenso informato',
            url: tattoo.releaseFormUrl,
            type: 'release' as const,
        },
    ].filter((doc) => !!doc.url);
});

const listTattooThumb = (photoUrl: string | string[] | null | undefined) => {
    const { after, before } = syncTattooPhotos(photoUrl);
    return after ?? before;
};
const inkColorLabel = computed(() => {
    const color = activeTattoo.value?.color;
    if (!color) return '—';
    return INK_COLOR_LABELS[color] ?? color;
});
const tattooTypeLabel = computed(() => {
    const type = activeTattoo.value?.tattooType;
    if (!type) return '—';
    return TATTOO_TYPE_LABELS[type]?.title ?? type;
});

const activeCustomer = computed(() => activeTattoo.value?.customer ?? null);

const hasCustomerDetails = computed(() => {
    const c = activeCustomer.value;
    if (!c) return false;
    return !!(c.email || c.cf || c.birthDate);
});

const tattooPositionLabel = computed(() =>
    positionLabel(activeTattoo.value?.position),
);

const tattooSkinTypeLabel = computed(() =>
    skinTypeLabel(activeTattoo.value?.skinType),
);

const openPhotoPreview = (url: string | undefined, label: string) => {
    if (!url) return;
    photoPreview.value = { url, label };
};

const closePhotoPreview = () => {
    photoPreview.value = null;
};

watch(
    () => route.params.tattooUuid as string | undefined,
    async (tattooUuid) => {
        if (!tattooUuid) {
            activeTattoo.value = null;
            return;
        }
        if (!activeTattoo.value || activeTattoo.value.uuid !== tattooUuid) {
            await showClosedTattoo(tattooUuid);
        }
    },
);

const getTattooUuidFromUrl = (): string => {
    const tattooUuid = route.params.tattooUuid;
    return typeof tattooUuid === 'string' ? tattooUuid : '';
};

const isDeletable = (status: string) => {
    return status !== 'CLOSE' && status !== 'PROGRESS';
}

const hasAssociatedInk = (tattoo: { inks?: string[] }) =>
    Array.isArray(tattoo.inks) && tattoo.inks.length > 0;

const associatedInkIds = (tattoo: { inks?: string[] }) =>
    (tattoo.inks ?? []).join(', ');

const getStatusColor = (tattoo: { status: string; inks?: string[] }) => {
    if (tattoo.status === 'CLOSE') return 'bg-green-500';
    if (hasAssociatedInk(tattoo)) return 'bg-yellow-500';
    return 'bg-orange-500';
};

watch(showTab, async () => {
    if (activeTattoo.value) return;
    uiStore.loading = true;
    await loadTattoos(true);
    uiStore.loading = false;
});

const setupLoadMoreObserver = () => {
    loadMoreObserver?.disconnect();
    if (!loadMoreSentinel.value) return;
    loadMoreObserver = new IntersectionObserver(
        (entries) => {
            if (
                entries[0]?.isIntersecting &&
                !activeTattoo.value &&
                tattoosStore.tattoosHasMore &&
                !tattoosStore.tattoosListLoading
            ) {
                loadTattoos(false);
            }
        },
        { root: null, rootMargin: '120px', threshold: 0 },
    );
    loadMoreObserver.observe(loadMoreSentinel.value);
};

watch(loadMoreSentinel, () => {
    if (!activeTattoo.value) setupLoadMoreObserver();
});

watch(
    () => activeTattoo.value,
    (detail) => {
        if (detail) {
            loadMoreObserver?.disconnect();
        } else {
            setupLoadMoreObserver();
        }
    },
);

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = 'Tatuaggi';

    await loadTattoos(true);

    try {
        if (getTattooUuidFromUrl().length > 0) {
            await showClosedTattoo(getTattooUuidFromUrl());
        }
    } catch {
        // ignore
    }
    uiStore.loading = false;
    setupLoadMoreObserver();
});

onUnmounted(() => {
    loadMoreObserver?.disconnect();
});

const onclickTattoo = async (tattoo: any) => {
    if (activeDelete.value) {
        if (!isDeletable(tattoo.status)) {
            uiStore.setToast('Non è possibile eliminare tatuaggi con inchiostri associati', 'error');
            return;
        }
        await tattoDeletion(tattoo);
        return;
    }
    if (tattoo.status !== 'CLOSE') {
        goToTatto(tattoo.uuid);
        return
    } else {
        await router.push(`/tattoos/${tattoo.uuid}`);
    }
}

const tattoDeletion = async (tattoo: any) => {
    uiStore.setPopoup('Confermi di voler eliminare il tatuaggio?', async () => {
        uiStore.loading = true;
        await deleteTattoo(tattoo.uuid);
        tattoosStore.removeTattooFromList(tattoo.uuid);
        activeDelete.value = false;
        showTab.value = 0;
        await loadTattoos(true);
        uiStore.loading = false;
        uiStore.setToast('Tatuaggio eliminato');
    });
}

const goToTatto = (tattooUuid: string) => {
    createTattooStore.uuid = tattooUuid;
    router.push('/createtattoo');
}

const showClosedTattoo = async (tattooUuid: string) => {
    uiStore.loading = true;
    try {
        const tattoo = await getTattoByUuid(tattooUuid);
        if (tattoo.status !== 'CLOSE') {
            goToTatto(tattoo.uuid);
            return;
        }
        activeTattoo.value = tattoo;
        tattoosStore.upsertTattoo(tattoo);
        if (tattoo.customerUuid) {
            try {
                const customer = await getCustomerByUuid(tattoo.customerUuid);
                activeTattoo.value.customer = customer;
            } catch {
                // dettaglio senza dati cliente estesi
            }
        }
    } catch {
        router.push('/tattoos');
    }
    uiStore.loading = false;
};

const goBackToTattoosList = () => {
    photoPreview.value = null;
    activeTattoo.value = null;
    router.push('/tattoos');
};

const startDeletion = () => {
    activeDelete.value = !activeDelete.value;
    if (activeDelete.value) {
        showTab.value = 3;
    }
    else {
        showTab.value = 0;
    }
}

</script>
<style scoped>
.detail-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgb(243 244 246);
}

.detail-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.detail-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: rgb(107 114 128);
    flex-shrink: 0;
}

.detail-value {
    text-align: right;
    font-weight: 500;
    color: rgb(17 24 39);
    word-break: break-word;
    min-width: 0;
}

.green {
    background-color: rgb(148, 255, 148);
}

.active-delete {
    animation: shake-loop 0.3s ease-in-out infinite;
    border: 1px solid red;
}

@keyframes shake-loop {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-1px);
    }

    50% {
        transform: translateX(1px);
    }

    75% {
        transform: translateX(-1px);
    }

    100% {
        transform: translateX(0);
    }
}
</style>