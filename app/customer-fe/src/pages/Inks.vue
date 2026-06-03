<template>
    <div class="mx-auto w-full items-start overflow-y-auto hide-scrollbar pb-24">
        <Button class="w-full h-12 mb-4">
            <Plus /> Carica Inchiostro
        </Button>

        <section class="mb-6">
            <h2 class="text-lg font-bold mb-3">Inchiostri disponibili</h2>
            <div v-if="inksStore.availableCount > 0"
                class="flex justify-start items-center shadow-md p-4 bg-white rounded-md w-auto h-fit">
                <p class="text-2xl mx-2 font-bold">x{{ inksStore.availableCount }}</p>
                <div class="flex items-center border-l border-black ml-2 pl-2">
                    <Droplet class="m-2 shrink-0" />
                    <p class="font-bold capitalize">{{ inkTypeLabel }}</p>
                </div>
            </div>
            <p v-else class="text-sm text-gray-600 px-1">nessun inchiostro disponibile</p>
        </section>

        <section>
            <h2 class="text-lg font-bold mb-3">Inchiostri utilizzati</h2>
            <div v-if="inksStore.usedInks.length" class="flex flex-col gap-3">
                <div
                    v-for="ink in inksStore.usedInks"
                    :key="ink.uuid"
                    class="flex justify-start items-center shadow-md p-4 bg-white rounded-md w-full h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                    @click="goToTattoo(ink.tattooUuid)"
                >
                    <Droplet class="m-2 shrink-0" />
                    <div class="min-w-0 flex-1">
                        <p class="font-bold capitalize">{{ inkTypeLabel }}</p>
                        <p
                            v-if="ink.tattooedPersonName"
                            class="text-sm text-gray-800 capitalize"
                        >
                            {{ ink.tattooedPersonName }}
                        </p>
                        <p class="text-xs text-gray-500 truncate">{{ ink.uuid }}</p>
                        <p v-if="ink.burningDate" class="text-xs text-gray-500">
                            Utilizzato il {{ formatDate(ink.burningDate) }}
                        </p>
                    </div>
                </div>
                <div ref="loadMoreSentinel" class="h-1 shrink-0" aria-hidden="true" />
                <p
                    v-if="inksStore.usedInksLoading && inksStore.usedInks.length"
                    class="text-center text-sm text-gray-500 py-3"
                >
                    Caricamento...
                </p>
                <p
                    v-else-if="!inksStore.usedInksHasMore && inksStore.usedInks.length"
                    class="text-center text-xs text-gray-400 py-3"
                >
                    Fine elenco ({{ inksStore.usedInksTotal }} inchiostri)
                </p>
            </div>
            <p
                v-else-if="!inksStore.usedInksLoading"
                class="text-sm text-gray-600 px-1"
            >
                nessun inchiostro utilizzato
            </p>
            <p
                v-else
                class="text-center text-sm text-gray-500 py-6"
            >
                Caricamento...
            </p>
        </section>
    </div>
</template>

<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import { useUiStore } from '@/stores/ui';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Droplet, Plus } from 'lucide-vue-next';
import { inkLabelService } from '@/services/api.inks.service';
import { useUserStore } from '@/stores/user.store';
import { useInksStore } from '@/stores/inks.store';
import router from '@/router';

const uiStore = useUiStore();
const userStore = useUserStore();
const inksStore = useInksStore();
const inkTypes = ref<any[]>([]);
const loadMoreSentinel = ref<HTMLElement | null>(null);
let loadMoreObserver: IntersectionObserver | null = null;

const inkTypeLabel = computed(() => {
    const type = inkTypes.value[0];
    if (!type) return 'Inchiostro Yore';
    return `${type.name ?? 'Yore'} - ${type.color ?? ''}`.trim();
});

const formatDate = (value: string) => value.split('T')[0];

const goToTattoo = (tattooUuid?: string) => {
    if (!tattooUuid) return;
    router.push(`/tattoos/${tattooUuid}`);
};

const loadUsedInks = async (reset = false) => {
    await inksStore.fetchUsedInksPage(userStore.getUiid, { reset });
};

const setupLoadMoreObserver = () => {
    loadMoreObserver?.disconnect();
    if (!loadMoreSentinel.value) return;
    loadMoreObserver = new IntersectionObserver(
        (entries) => {
            if (
                entries[0]?.isIntersecting &&
                inksStore.usedInksHasMore &&
                !inksStore.usedInksLoading
            ) {
                loadUsedInks(false);
            }
        },
        { root: null, rootMargin: '120px', threshold: 0 },
    );
    loadMoreObserver.observe(loadMoreSentinel.value);
};

watch(loadMoreSentinel, () => setupLoadMoreObserver());

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = 'Inchiostri';
    inkTypes.value = await inkLabelService.getInkTypes();
    await Promise.all([
        inksStore.fetchAvailableCount(userStore.getUiid),
        loadUsedInks(true),
    ]);
    uiStore.loading = false;
    setupLoadMoreObserver();
});

onUnmounted(() => {
    loadMoreObserver?.disconnect();
});
</script>
