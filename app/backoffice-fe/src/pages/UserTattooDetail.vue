<template>
    <div class="mx-auto w-full pb-28 pt-2">
        <button
            type="button"
            class="flex items-center gap-2 text-sm font-medium text-gray-700 w-fit mb-4"
            @click="goBack"
        >
            <ArrowLeft class="size-5 shrink-0" />
            Torna all'utente
        </button>

        <CompletedTattooDetail
            v-if="tattoo"
            :tattoo="tattoo"
            :customer="customer"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import CompletedTattooDetail from '@shared/components/tattoo/CompletedTattooDetail.vue';
import { tattooService } from '@/services/api.tattoo.service';
import { getCustomerByUuid } from '@/services/api.customer.service';
import { useUiStore } from '@/stores/ui';
import router from '@/router';

const route = useRoute();
const uiStore = useUiStore();
const tattoo = ref<Record<string, any> | null>(null);
const customer = ref<Record<string, any> | null>(null);

const getRouteParam = (key: string): string => {
    const value = route.params[key];
    return typeof value === 'string' ? value : '';
};

const goBack = () => {
    const userUuid = getRouteParam('userUuid');
    router.push(userUuid ? `/users/${userUuid}` : '/users');
};

onMounted(async () => {
    const tattooUuid = getRouteParam('tattooUuid');
    if (!tattooUuid) {
        goBack();
        return;
    }

    uiStore.loading = true;
    uiStore.title = 'Dettaglio tatuaggio';
    try {
        const loadedTattoo = await tattooService.getTattoByUuid(tattooUuid);
        if (loadedTattoo.status !== 'CLOSE') {
            uiStore.setToast('Il tatuaggio non è ancora completato', 'error');
            goBack();
            return;
        }
        tattoo.value = loadedTattoo;
        if (loadedTattoo.customerUuid) {
            try {
                customer.value = await getCustomerByUuid(loadedTattoo.customerUuid);
            } catch {
                customer.value = null;
            }
        }
    } catch {
        uiStore.setToast('Tatuaggio non trovato', 'error');
        goBack();
    } finally {
        uiStore.loading = false;
    }
});
</script>
