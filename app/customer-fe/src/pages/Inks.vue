<template>
    <div class="mx-auto w-full items-start overflow-y-auto hide-scrollbar pb-24">
        <Button class="w-full h-12 mb-4">
            <Plus /> Carica Inchiostro
        </Button>

        <section class="mb-6">
            <h2 class="text-lg font-bold mb-3">Inchiostri disponibili</h2>
            <div v-if="availableInks.length"
                class="flex justify-start items-center shadow-md p-4 bg-white rounded-md w-auto h-fit">
                <p class="text-2xl mx-2 font-bold">x{{ availableInks.length }}</p>
                <div class="flex items-center border-l border-black ml-2 pl-2">
                    <Droplet class="m-2 shrink-0" />
                    <p class="font-bold capitalize">{{ inkTypeLabel }}</p>
                </div>
            </div>
            <p v-else class="text-sm text-gray-600 px-1">nessun inchiostro disponibile</p>
        </section>

        <section>
            <h2 class="text-lg font-bold mb-3">Inchiostri utilizzati</h2>
            <div v-if="usedInks.length" class="flex flex-col gap-3">
                <div
                    v-for="ink in usedInks"
                    :key="ink.uuid"
                    class="flex justify-start items-center shadow-md p-4 bg-white rounded-md w-full h-fit hover:bg-blue-100 hover:cursor-pointer transition-all"
                    @click="goToTattoo(ink.tattooUuid)"
                >
                    <Droplet class="m-2 shrink-0" />
                    <div class="min-w-0 flex-1">
                        <p class="font-bold capitalize">{{ inkTypeLabel }}</p>
                        <p v-if="tattooedPersonLabel(ink.tattooUuid)" class="text-sm text-gray-800 capitalize">
                            {{ tattooedPersonLabel(ink.tattooUuid) }}
                        </p>
                        <p class="text-xs text-gray-500 truncate">{{ ink.uuid }}</p>
                        <p v-if="ink.burningDate" class="text-xs text-gray-500">
                            Utilizzato il {{ formatDate(ink.burningDate) }}
                        </p>
                    </div>
                </div>
            </div>
            <p v-else class="text-sm text-gray-600 px-1">nessun inchiostro utilizzato</p>
        </section>
    </div>
</template>

<script setup lang="ts">
import Button from '@shared/components/ui/button/Button.vue';
import { useUiStore } from '@/stores/ui';
import { computed, onMounted, ref } from 'vue';
import { Droplet, Plus } from 'lucide-vue-next';
import { apiLabelService, inkLabelService } from '@/services/api.inks.service';
import { getTattoosByUserUuid } from '@/services/api.tattoo.service';
import { getCustomerByUuid } from '@/services/api.customer.service';
import { useUserStore } from '@/stores/user.store';
import router from '@/router';

const uiStore = useUiStore();
const userStore = useUserStore();
const inks = ref<any[]>([]);
const inkTypes = ref<any[]>([]);
const tattooedPersonByTattooUuid = ref<Record<string, string>>({});

const availableInks = computed(() =>
    inks.value.filter((el) => !el.tattooUuid),
);

const usedInks = computed(() =>
    inks.value.filter((el) => el.tattooUuid),
);

const inkTypeLabel = computed(() => {
    const type = inkTypes.value[0];
    if (!type) return 'Inchiostro Yore';
    return `${type.name ?? 'Yore'} - ${type.color ?? ''}`.trim();
});

const formatDate = (value: string) => value.split('T')[0];

const tattooedPersonLabel = (tattooUuid?: string) => {
    if (!tattooUuid) return '';
    return tattooedPersonByTattooUuid.value[tattooUuid] ?? '';
};

const goToTattoo = (tattooUuid: string) => {
    if (!tattooUuid) return;
    router.push(`/tattoos/${tattooUuid}`);
};

const loadTattooedPersonNames = async (tattoos: { uuid: string; customerUuid?: string; customerName?: string }[]) => {
    const map: Record<string, string> = {};
    const customerCache = new Map<string, { name?: string; surname?: string }>();

    for (const tattoo of tattoos) {
        if (!tattoo.uuid) continue;

        if (tattoo.customerUuid) {
            if (!customerCache.has(tattoo.customerUuid)) {
                try {
                    const customer = await getCustomerByUuid(tattoo.customerUuid);
                    customerCache.set(tattoo.customerUuid, customer);
                } catch {
                    customerCache.set(tattoo.customerUuid, {});
                }
            }
            const customer = customerCache.get(tattoo.customerUuid);
            const fullName = [customer?.name, customer?.surname].filter(Boolean).join(' ').trim();
            if (fullName) {
                map[tattoo.uuid] = fullName;
                continue;
            }
        }

        if (tattoo.customerName?.trim()) {
            map[tattoo.uuid] = tattoo.customerName.trim();
        }
    }

    tattooedPersonByTattooUuid.value = map;
};

onMounted(async () => {
    uiStore.loading = true;
    uiStore.title = 'Inchiostri';
    inkTypes.value = await inkLabelService.getInkTypes();
    inks.value = await apiLabelService.getLabelsByUser(userStore.getUiid);
    const tattoos = await getTattoosByUserUuid(userStore.getUiid);
    await loadTattooedPersonNames(tattoos);
    uiStore.loading = false;
});
</script>
